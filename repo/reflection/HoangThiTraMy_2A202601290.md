## 1. Vai trò trong nhóm
    -**Vai trò:** EDA data chatlog + Tester + 
    -**Nhóm:** Group 05 — Batch 03 (Khoá K4)

    ## 2. Phần công việc cụ thể tôi đã trực tiếp làm
    - [Mô tả chi tiết task 1: ví dụ - Xây dựng prompt sinh Adaptive Quiz trong backend/services/quiz.py]
    - [Mô tả chi tiết task 2: ví dụ - Đẩy dữ liệu chatlog và phân tích 12 cụm vấn đề sinh viên gặp phải]
    - [Mô tả chi tiết task 3: ví dụ - Viết mục §4 và §5 trong spec.md]

    ## 3. AI đã hỗ trợ tôi như thế nào?
    -**Công cụ AI sử dụng:** [ChatGPT / Cursor / Claude / Antigravity CLI]
    -**Ứng dụng thực tế:**
    - AI hỗ trợ viết nhanh cấu trúc khung code backend / UI component.
    - Hỗ trợ tối ưu hóa System Prompt cho LLM.
    -**Mức độ làm chủ (Vibe-coding compliance):** Tôi đã trực tiếp đọc, refactor lại mã nguồn do AI gợi ý, chạy
  test thử nghiệm và hiểu rõ 100% luồng xử lý dữ liệu của phần mình phụ trách.

    ## 4. Bài học kinh nghiệm từ Case thất bại (Fail Case) của nhóm
    -**Tình huống lỗi gặp phải:** [Nêu 1 lỗi thực tế nhóm từng gặp. Ví dụ: Ở lượt test đầu tiên, AI hay sinh ra
  câu hỏi trắc nghiệm nằm ngoài nội dung slide bôi đen do Prompt chưa trích dẫn đúng context text.]
    -**Nguyên nhân:** [System prompt ban đầu đặt quy tắc chưa đủ chặt chẽ (lỗi Nguồn sự thật).]
    -**Bài học rút ra:** [Cần thắt chặt Constraint "bám 100% vào context_text" và bổ sung bước fallback/low-
  confidence nếu đoạn bôi đen quá ngắn.]