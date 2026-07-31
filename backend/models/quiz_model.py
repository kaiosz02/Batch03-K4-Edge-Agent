from pydantic import BaseModel
from typing import List, Optional

# ==============================================================================
# FRONTEND INTEGRATION GUIDE — quiz_model.py
# ==============================================================================
# API Base URL: http://localhost:8000
#
# [1] GENERATE QUIZ — POST /quiz/generate
#     Frontend gửi JSON body với các trường sau:
#       - context_text  (string, BẮT BUỘC): Đoạn text học sinh vừa bôi đen.
#       - slide_context (string, NÊN CÓ) : Tiêu đề slide hoặc tóm tắt chủ đề
#                                          tổng quát của trang đang hiển thị.
#                                          Ví dụ: "Chương 3: Vector Database & HNSW"
#                                          Nếu FE không truyền, AI tạo câu hỏi
#                                          không có bối cảnh → dễ mơ hồ.
#       - slide_id      (string, tùy chọn): ID của slide hiện tại.
#       - current_level (int, tùy chọn)  : Level gợi ý ban đầu (1/2/3).
#       - session_id    (string, tùy chọn): ID phiên học (mặc định "demo-user").
#
#     Response trả về:
#       - quiz_id       (string): ID dùng để nộp bài, lưu lại!
#       - question      (string): Nội dung câu hỏi hiển thị cho học sinh.
#       - options       (list)  : ["A. ...", "B. ...", "C. ...", "D. ..."]
#       - difficulty_level (int): Độ khó 1/2/3 để hiển thị badge.
#
# [2] SUBMIT QUIZ — POST /quiz/{quiz_id}/submit
#     Frontend gửi JSON body:
#       - selected_answer (string, BẮT BUỘC): "A", "B", "C" hoặc "D"
#       - session_id      (string, tùy chọn): Phải GIỐNG với lúc generate.
#
#     Response trả về:
#       - is_correct    (bool)  : Đúng hay sai.
#       - correct_answer(string): Đáp án đúng để highlight.
#       - explanation   (string): Giải thích để hiển thị bên dưới.
#       - exp_added     (int)   : Số EXP thực tế cộng vào thú cưng.
#       - pet_status    (object): Trạng thái thú cưng mới nhất (level, exp, emotion).
#
# [3] GET PET STATUS — GET /pet/status?session_id=<session_id>
#     Dùng để load trạng thái thú cưng khi mở app lần đầu.
#
# [4] GET HEATMAP — GET /analytics/heatmap?document_id=<id>
#     Dùng cho trang Dashboard của Giảng viên.
# ==============================================================================


class QuizHistoryItem(BaseModel):
    question: str
    is_correct: bool

class QuizRequest(BaseModel):
    # Đoạn text học sinh bôi đen — NGUỒN CHÍNH để AI tạo câu hỏi
    context_text: str

    # Backend tự lấy bối cảnh slide từ slide_store dựa vào slide_id + page_num
    # FE chỉ cần truyền 2 trường này, KHÔNG cần truyền slide_context thủ công
    slide_id: Optional[str] = None       # Lấy từ response của POST /slide/upload
    page_num: Optional[int] = 1          # Trang hiện tại đang hiển thị (1-indexed)

    # Fallback: FE vẫn có thể truyền slide_context thủ công nếu chưa upload PDF
    slide_context: Optional[str] = None

    current_level: Optional[int] = 1
    session_id: Optional[str] = "demo-user"

class QuizInternalResponse(BaseModel):
    status: str = "success"
    question: str = ""
    options: List[str] = []
    correct_answer: str = ""
    explanation: str = ""
    difficulty_level: int = 1
    exp_reward: int = 0
    message: str = ""

class QuizGenerateResponse(BaseModel):
    quiz_id: str
    question: str
    options: List[str]
    difficulty_level: int

class QuizSubmitRequest(BaseModel):
    selected_answer: str   # Chỉ gửi "A", "B", "C", hoặc "D"
    session_id: Optional[str] = "demo-user"

class QuizSubmitResponse(BaseModel):
    is_correct: bool
    correct_answer: str
    explanation: str
    exp_added: int
    pet_status: dict   # Xem models/pet_model.py để biết cấu trúc đầy đủ
