import os
import json
import logging
from openai import OpenAI
from dotenv import load_dotenv
from models.quiz_model import QuizRequest, QuizInternalResponse
from fastapi import HTTPException
from services.session_store import get_session
from services.slide_store import get_slide_context_summary

# Load .env từ root project (và cwd nếu có)
_ROOT_ENV = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
load_dotenv(_ROOT_ENV)
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s — %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("deepseek_service")

api_key = os.getenv("DEEP_SEEK_API_KEY")
client = None
if api_key:
    client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")
    log.info("✅ DEEP_SEEK_API_KEY loaded successfully.")
else:
    log.warning("⚠️  DEEP_SEEK_API_KEY not found in .env — running in MOCK mode.")

SYSTEM_PROMPT = """
Bạn là một AI Sư Phạm chuyên tạo câu hỏi trắc nghiệm để kiểm tra mức độ hiểu bài của học viên.

NGUYÊN TẮC BẮT BUỘC:
1. Câu hỏi và đáp án phải 100% bám sát đoạn văn bản (CONTEXT). Tuyệt đối không bịa thêm thông tin (Chống Hallucination).
2. Nếu CONTEXT chứa nội dung ngoài luồng, thời tiết, mã hóa, hack, gian lận (Out of scope / Domain Risk), HOẶC nội dung không rõ nghĩa (Ambiguity), bạn PHẢI TỪ CHỐI bằng cách trả về JSON với `status`: "rejected".
3. Khi TỪ CHỐI, các trường khác để rỗng hoặc mặc định, chỉ cần quan tâm `status`="rejected" và `message`="Lý do từ chối".
4. Khi HỢP LỆ, `status`="success", tạo đúng 1 câu hỏi, 4 đáp án (A/B/C/D), chỉ có đúng 1 đáp án đúng.
5. Độ khó tương ứng với difficulty_level: 1 (Dễ), 2 (Vừa), 3 (Khó).
6. Tương ứng với độ khó, gán exp_reward như sau: Dễ = 5, Vừa = 10, Khó = 15.
7. TRẢ VỀ JSON THUẦN HỢP LỆ (không bọc trong ```json).

OUTPUT FORMAT KHI HỢP LỆ:
{
  "status": "success",
  "question": "Nội dung câu hỏi",
  "options": ["A. Đáp án 1", "B. Đáp án 2", "C. Đáp án 3", "D. Đáp án 4"],
  "correct_answer": "A",
  "explanation": "Giải thích tại sao A đúng dựa trên context",
  "difficulty_level": 1,
  "exp_reward": 5,
  "message": ""
}

OUTPUT FORMAT KHI TỪ CHỐI:
{
  "status": "rejected",
  "message": "Nội dung không hợp lệ hoặc ngoài phạm vi bài học."
}
"""


def _strip_json_fences(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        if text.endswith("```"):
            text = text.rsplit("\n", 1)[0]
        if text.startswith("json"):
            text = text[4:].strip()
    return text.strip()


def generate_adaptive_quiz(request: QuizRequest) -> QuizInternalResponse:
    target_level = request.current_level or 1
    session_id = request.session_id or "demo-user"

    log.info(f"📥 [generate_quiz] session={session_id} | level={target_level} | slide='{request.slide_id}'")
    log.info(
        f"   context_text   : '{request.context_text[:80]}...'"
        if len(request.context_text) > 80
        else f"   context_text   : '{request.context_text}'"
    )
    log.info(f"   slide_context  : '{request.slide_context or '(không có — AI có thể mơ hồ)'}'")

    if not api_key or client is None:
        log.warning("🤖 MOCK mode: Trả về câu hỏi giả lập, không gọi DeepSeek API.")
        return QuizInternalResponse(
            status="success",
            question=f"[MOCK] Theo đoạn text, khái niệm chính được đề cập ở mức độ {target_level} là gì?",
            options=["A. Đúng", "B. Sai", "C. Lỗi", "D. Lỗi"],
            correct_answer="A",
            explanation="Mock explanation",
            difficulty_level=target_level,
            exp_reward=5 * target_level,
        )

    try:
        model_name = os.getenv("DEEP_SEEK_MODEL", "deepseek-chat")

        pet_state = get_session(request.session_id)
        history = pet_state.get("history", [])

        history_text = ""
        if history and len(history) > 0:
            history_text = "LỊCH SỬ LÀM BÀI CỦA HỌC VIÊN:\n"
            for item in history:
                status = "Đúng" if item["is_correct"] else "Sai"
                history_text += f"- Câu hỏi cũ: '{item['question']}' -> Trả lời: {status}\n"
            history_text += (
                "\nCHỈ ĐẠO AI QUYẾT ĐỊNH (Rubric R2): Dựa vào lịch sử trên, hãy TỰ ĐÁNH GIÁ và "
                "QUYẾT ĐỊNH độ khó (difficulty_level) cho câu hỏi tiếp theo. Nâng độ khó nếu học viên "
                "trả lời đúng, hạ độ khó nếu trả lời sai. TUYỆT ĐỐI KHÔNG lặp lại câu hỏi cũ!\n"
            )
        else:
            history_text = f"Học viên mới bắt đầu. Hãy tạo câu hỏi ở Level {target_level}.\n"

        slide_context_block = ""
        if request.slide_context:
            slide_context_block = f"\nBỐI CẢNH TỔNG QUÁT CỦA SLIDE:\n{request.slide_context}\n"
            log.info("   ✅ slide_context nhận từ FE (manual mode).")
        elif request.slide_id:
            page_num = getattr(request, "page_num", 1) or 1
            auto_context = get_slide_context_summary(request.slide_id, page_num)
            if auto_context:
                slide_context_block = (
                    f"\nBỐI CẢNH TỔNG QUÁT CỦA SLIDE (Backend tự tra cứu):\n{auto_context}\n"
                )
                log.info(
                    f"   ✅ slide_context tự động từ slide_store "
                    f"(slide_id={request.slide_id}, page={page_num})."
                )
            else:
                log.warning(f"   ⚠️  slide_id='{request.slide_id}' chưa upload PDF. Gọi POST /slide/upload trước.")
        else:
            log.warning("   ⚠️  Không có slide_id lẫn slide_context — AI sẽ tạo câu hỏi không có bối cảnh.")

        user_prompt = (
            f"{slide_context_block}"
            f"\n\nCONTEXT (đoạn text học viên bôi đen):\n{request.context_text}"
            f"\n\n{history_text}"
            f"\nYÊU CẦU: Sinh ra câu hỏi trắc nghiệm tiếp theo."
        )

        log.info(f"🚀 Đang gọi DeepSeek API ({model_name})... (session={request.session_id})")
        response = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
            temperature=0.3,
        )

        text = _strip_json_fences(response.choices[0].message.content or "")
        data = json.loads(text)
        result = QuizInternalResponse(**data)
        log.info(
            f"✅ DeepSeek trả về: status={result.status} | "
            f"difficulty={result.difficulty_level} | exp={result.exp_reward}"
        )
        return result
    except Exception as e:
        log.error(f"❌ DeepSeek API Error: {e}")
        raise HTTPException(status_code=500, detail=f"AI Service Error: {str(e)}")
