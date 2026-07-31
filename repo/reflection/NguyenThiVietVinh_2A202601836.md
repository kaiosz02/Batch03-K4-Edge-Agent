## 1. Vai trò trong nhóm
- **Họ và tên:** Nguyễn Thị Việt Vinh
- **MSSV:** 2A202601836
- **Vai trò:** Tổng hợp slide thuyết trình 6 trang, đóng góp ý tưởng sản phẩm cùng các thành viên.
- **Nhóm:** Group Edge-agent (Khóa K4 AI Thực Chiến)

## 2. Phần công việc cụ thể tôi đã trực tiếp làm
- **Biên soạn Slide Thuyết Trình & Kịch bản Presenter Notes (`slide_6_trang.md`, `slide.md`, `slides.html`):**
  - Xây dựng trọn bộ Slide thuyết trình 6 trang bám sát 5 tiêu chí nghiệm thu và chuẩn `02-guide.md` §5.1 ("Không có bằng chứng thì không có slide").
  - Soạn kịch bản nói (Presenter Notes) từng slide kèm mốc thời gian chuẩn (45s - 2 min/slide), giúp nhóm trình bày đúng 5 phút.
  - Thiết kế bảng phản dame Q&A với Ban Giám Khảo bám sát Rubric (giải thích tại sao không chọn Leaderboard, xử lý Ảo giác RAG, cơ chế RAM Storage vs Redis DB).
-
- **Thu thập User Feedback & Validation CP5:**
  - Thực hiện phỏng vấn và thu thập ý kiến nguyên văn từ ≥5 học viên ngoài nhóm (Zone B, C) về trải nghiệm V-Pet Tutor.
  - Phối hợp với team dev cập nhật Changelog (§9) thêm nút "Bỏ qua thử thách" (HAX G8) và cơ chế khóa thử thách 1 phút chống spam EXP.

## 3. AI đã hỗ trợ tôi như thế nào?
- **Công cụ AI sử dụng:** Antigravity CLI, Gemini 3.1 Flash Lite / Gemini 3.6 Flash, ChatGPT.
- **Ứng dụng thực tế:**
  - Dùng AI để tổng hợp nhanh dữ liệu chatlog mining và format cấu trúc slide HTML/Markdown trực quan.
  - Sử dụng AI để đề xuất kịch bản phản biện Q&A, dự đoán các câu hỏi xoáy của Ban Giám Khảo về tính khả thi và rủi ro domain.
  - Hỗ trợ chuẩn hóa các thuật ngữ product (JTBD, Confusion Hotspot, Adaptive Quiz, Pedagogical Moves, Conditional Automation).
- **Mức độ làm chủ (Vibe-coding compliance):** Tôi đã trực tiếp đọc, rà soát tỉ mỉ toàn bộ số liệu minh chứng (28.4%, 39.02%, 46.15%, 20/20 Golden Set), chỉnh sửa kịch bản nói cho tự nhiên và nắm rõ 100% nội dung spec cũng như luồng demo của nhóm.

## 4. Bài học kinh nghiệm từ Case thất bại (Fail Case) của nhóm
- **Tình huống lỗi gặp phải:** Ở lượt test Eval đầu tiên của backend, hệ thống báo thất bại 0/20 test cases do lỗi `429 Quota Exceeded` vì code backend bị hardcode gọi model `gemini-2.0-flash` đã cạn quota.
- **Nguyên nhân:** Đặt tên model trực tiếp trong file code service thay vì load từ biến môi trường `.env`, dẫn đến việc không phát hiện sớm hạn mức API khi chạy số lượng lớn test case.
- **Bài học rút ra:** Luôn đưa các tham số cấu hình (Model Name, API Key, Threshold) ra file `.env`, xây dựng cơ chế fallback model tự động (`gemini-3.1-flash-lite`), và thực hiện kiểm thử tự động (Eval Golden Set) liên tục để phát hiện sớm các lỗi nghẽn hạ tầng trước khi thuyết trình.