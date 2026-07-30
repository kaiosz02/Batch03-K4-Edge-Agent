import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from models.quiz_model import QuizRequest, QuizResponse

load_dotenv()

# Configure Gemini API if key is present
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

SYSTEM_PROMPT = """
Bạn là một AI Sư Phạm chuyên tạo câu hỏi trắc nghiệm để kiểm tra mức độ hiểu bài của học viên.

NGUYÊN TẮC BẮT BUỘC:
1. Câu hỏi và đáp án phải 100% bám sát đoạn văn bản (CONTEXT). Tuyệt đối không bịa thêm thông tin (Chống Hallucination).
2. Nếu CONTEXT chứa nội dung ngoài luồng, thời tiết, mã hóa, hack, gian lận (Out of scope / Domain Risk), HOẶC nội dung không rõ nghĩa (Ambiguity), bạn PHẢI TỪ CHỐI bằng cách đặt question = "Nội dung không hợp lệ hoặc ngoài phạm vi bài học.".
3. Khi TỪ CHỐI, hãy để correct_answer là "A", và options bao gồm các lý do từ chối (ví dụ: "A. Đoạn văn bản không chứa thông tin học thuật.", "B. Lỗi", "C. Lỗi", "D. Lỗi"), exp_reward = 0.
4. Khi HỢP LỆ, tạo đúng 1 câu hỏi, 4 đáp án (A/B/C/D), chỉ có đúng 1 đáp án đúng.
5. Độ khó tương ứng với difficulty_level: 1 (Dễ), 2 (Vừa), 3 (Khó).
6. Tương ứng với độ khó, gán exp_reward như sau: Dễ = 5, Vừa = 10, Khó = 15.
7. TRẢ VỀ JSON THUẦN HỢP LỆ.

OUTPUT FORMAT:
{
  "question": "Nội dung câu hỏi",
  "options": ["A. Đáp án 1", "B. Đáp án 2", "C. Đáp án 3", "D. Đáp án 4"],
  "correct_answer": "A",
  "explanation": "Giải thích tại sao A đúng dựa trên context",
  "difficulty_level": 1,
  "exp_reward": 5
}
"""

def generate_adaptive_quiz(request: QuizRequest) -> QuizResponse:
    target_level = request.current_level or 1
    
    # Fallback/Mock mode if API Key is not configured yet
    if not api_key:
        return QuizResponse(
            question=f"[MOCK] Theo đoạn text, khái niệm chính được đề cập ở mức độ {target_level} là gì?",
            options=[
                "A. Khái niệm cơ bản trong slide",
                "B. Thuật ngữ không liên quan",
                "C. Đáp án giả định 1",
                "D. Đáp án giả định 2"
            ],
            correct_answer="A",
            explanation="Đây là câu hỏi mock khi chưa cài đặt GEMINI_API_KEY.",
            difficulty_level=target_level,
            exp_reward=5 * target_level
        )

    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        
        history_text = ""
        if request.history and len(request.history) > 0:
            history_text = "LỊCH SỬ LÀM BÀI CỦA HỌC VIÊN:\n"
            for idx, item in enumerate(request.history):
                status = "Đúng" if item.is_correct else "Sai"
                history_text += f"- Câu hỏi cũ: '{item.question}' -> Trả lời: {status}\n"
            history_text += "\nCHỈ ĐẠO AI QUYẾT ĐỊNH (Rubric R2): Dựa vào lịch sử trên, hãy TỰ ĐÁNH GIÁ và QUYẾT ĐỊNH độ khó (difficulty_level) cho câu hỏi tiếp theo. Nâng độ khó nếu học viên trả lời đúng, hạ độ khó nếu trả lời sai. TUYỆT ĐỐI KHÔNG lặp lại câu hỏi cũ!\n"
        else:
            history_text = f"Học viên mới bắt đầu. Hãy tạo câu hỏi ở Level {target_level}.\n"

        prompt = f"{SYSTEM_PROMPT}\n\nCONTEXT:\n{request.context_text}\n\n{history_text}\nYÊU CẦU: Sinh ra câu hỏi trắc nghiệm tiếp theo."
        
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Clean JSON markdown fences if present
        if text.startswith("```"):
            text = text.split("\n", 1)[1]
            if text.endswith("```"):
                text = text.rsplit("\n", 1)[0]
            if text.startswith("json"):
                text = text[4:].strip()
                
        data = json.loads(text)
        return QuizResponse(**data)
    except Exception as e:
        print(f"Error: {e}")
        # Fallback safety response
        return QuizResponse(
            question="Theo đoạn văn bản bạn vừa chọn, đâu là ý chính?",
            options=[
                "A. Đoạn văn bản mô tả nội dung chính của bài học",
                "B. Đoạn văn bản mô tả ví dụ minh họa",
                "C. Đoạn văn bản đưa ra bài tập thực hành",
                "D. Đoạn văn bản tóm tắt chương trước"
            ],
            correct_answer="A",
            explanation=f"Fallback quiz due to error: {str(e)}",
            difficulty_level=target_level,
            exp_reward=5
        )
