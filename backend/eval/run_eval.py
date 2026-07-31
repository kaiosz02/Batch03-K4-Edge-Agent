import json
import os
import sys
import time

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from models.quiz_model import QuizRequest
from services.deepseek_service import generate_adaptive_quiz

def run_eval():
    eval_file = os.path.join(os.path.dirname(__file__), "test_cases.json")
    if not os.path.exists(eval_file):
        print("Không tìm thấy file test_cases.json")
        return

    with open(eval_file, "r", encoding="utf-8") as f:
        cases = json.load(f)

    passed = 0
    total = len(cases)
    results = []

    print(f"=== ĐANG CHẠY BỘ KIỂM THỬ EVAL ({total} CASES) ===")
    for case in cases:
        req = QuizRequest(context_text=case["context"], current_level=case["level"])
        
        expected = case.get("expected_action")
        actual_status = None
        error_msg = ""
        is_pass = False
        
        try:
            res = generate_adaptive_quiz(req)
            actual_status = res.status
            
            if expected == "generate":
                if actual_status == "success":
                    if len(res.options) == 4 and res.correct_answer in ["A", "B", "C", "D"]:
                        is_pass = True
                    else:
                        error_msg = "Không đủ 4 option hoặc đáp án sai định dạng"
                else:
                    error_msg = f"Mong đợi generate nhưng lại bị {actual_status} - {res.message}"
            elif expected == "reject":
                if actual_status == "rejected":
                    is_pass = True
                else:
                    error_msg = f"Mong đợi reject nhưng lại generate thành công."
        except Exception as e:
            error_msg = str(e)
            if expected == "reject": 
                # If it threw HTTP Exception due to reject, it might be correct depending on how we implemented it, 
                # but our gemini_service returns `status="rejected"` inside QuizInternalResponse, it doesn't throw.
                pass

        if is_pass:
            passed += 1
            print(f"✅ Case #{case['id']} [{case['category']}]: PASSED (Expected: {expected})")
        else:
            print(f"❌ Case #{case['id']} [{case['category']}]: FAILED - {error_msg}")
        
        results.append({
            "id": case['id'],
            "category": case['category'],
            "expected": expected,
            "actual_status": actual_status,
            "pass": is_pass,
            "error": error_msg
        })
        
        # Sleep to avoid rate limiting
        time.sleep(4)

    print(f"\nKẾT QUẢ: {passed}/{total} cases hoàn thành.")
    
    # Save results
    report_file = os.path.join(os.path.dirname(__file__), "eval_report.json")
    with open(report_file, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"Đã lưu báo cáo chi tiết vào {report_file}")

if __name__ == "__main__":
    run_eval()
