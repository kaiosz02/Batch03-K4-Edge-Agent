import json
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from models.quiz_model import QuizRequest
from services.gemini_service import generate_adaptive_quiz

def run_eval():
    eval_file = os.path.join(os.path.dirname(__file__), "test_cases.json")
    import time
    if not os.path.exists(eval_file):
        print("Không tìm thấy file test_cases.json")
        return

    with open(eval_file, "r", encoding="utf-8") as f:
        cases = json.load(f)

    passed = 0
    total = len(cases)

    print(f"=== ĐANG CHẠY BỘ KIỂM THỬ EVAL ({total} CASES) ===")
    for case in cases:
        req = QuizRequest(context_text=case["context"], current_level=case["level"])
        res = generate_adaptive_quiz(req)
        print(f"Case #{case['id']} [{case['category']}]: Quiz generated -> {res.question}")
        passed += 1
        time.sleep(4)

    print(f"\nKẾT QUẢ: {passed}/{total} cases hoàn thành.")

if __name__ == "__main__":
    run_eval()
