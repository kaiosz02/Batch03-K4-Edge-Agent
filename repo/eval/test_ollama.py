import json
import urllib.request
import urllib.error
import os
from dotenv import load_dotenv

load_dotenv()

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "https://ollama.com")
OLLAMA_API_KEY = os.getenv("OLLAMA_API_KEY", "")
MODEL_NAME = os.getenv("OLLAMA_MODEL", "gemma4:cloud")

def test_quiz_generation():
    url = f"{OLLAMA_HOST.rstrip('/')}/api/generate"
    
    prompt_text = """
Bạn là một AI Sư Phạm chuyên tạo câu hỏi trắc nghiệm.
Dựa vào đoạn văn sau (CONTEXT):
"RAG (Retrieval-Augmented Generation) là kỹ thuật kết hợp giữa mô hình ngôn ngữ lớn (LLM) và hệ thống truy xuất thông tin (Retriever) để giảm thiểu ảo giác (hallucination)."

YÊU CẦU: Tạo đúng 1 câu hỏi trắc nghiệm với 4 đáp án (A, B, C, D), chỉ ra đáp án đúng và giải thích ngắn gọn dưới dạng JSON thuần.
JSON format:
{
  "question": "Nội dung câu hỏi",
  "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
  "correct_answer": "A",
  "explanation": "Giải thích..."
}
"""

    payload = {
        "model": MODEL_NAME,
        "prompt": prompt_text,
        "stream": False,
        "format": "json"  # Yêu cầu Ollama trả về đúng JSON
    }
    
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Python Ollama Test Client)"
    }

    if OLLAMA_API_KEY:
        headers["Authorization"] = f"Bearer {OLLAMA_API_KEY}"

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")

    print(f"🚀 Đang gửi câu hỏi tới Ollama ({MODEL_NAME}) tại: {url}")
    print("📝 Đoạn context gửi đi: 'RAG là kỹ thuật kết hợp LLM và Retriever...'")
    print("-" * 65)

    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            status_code = response.getcode()
            response_body = response.read().decode("utf-8")
            res_json = json.loads(response_body)
            
            ai_reply = res_json.get("response", "")
            print(f"✅ Response Status Code: {status_code}\n")
            print("🤖 KẾT QUẢ AI TRẢ LỜI CÂU HỎI (JSON):")
            print("-" * 65)
            print(ai_reply)
            print("-" * 65)
            
            # Thử parse JSON kết quả xem có hợp lệ không
            try:
                parsed_quiz = json.loads(ai_reply)
                print("\n🎉 PARSE JSON THÀNH CÔNG!")
                print(f"📌 Câu hỏi: {parsed_quiz.get('question')}")
                print(f"📌 Đáp án đúng: {parsed_quiz.get('correct_answer')}")
                print(f"📌 Lời giải thích: {parsed_quiz.get('explanation')}")
            except Exception:
                print("\n⚠️ AI trả về văn bản nhưng chưa parse trực tiếp được thành dict JSON.")
                
            return res_json
            
    except urllib.error.HTTPError as e:
        print(f"❌ HTTP Error: {e.code} - {e.reason}")
        print(f"Details: {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    test_quiz_generation()
