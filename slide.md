# 📊 Kịch Bản & Cấu Trúc Slide Thuyết Trình — V-Pet Tutor

> **Mục tiêu file này:** Dùng để làm dàn ý (outline) khi thiết kế Slide hoặc chuẩn bị kịch bản nói. Cấu trúc này được thiết kế theo hướng **"Rào trước đón sau"** — chủ động đưa các giới hạn/tech debt của hệ thống vào Roadmap để chặn họng các câu hỏi bắt bẻ của Ban Giám Khảo (BGK) hoặc nhóm khác.

---

## Slide 1: Tiêu đề & Tầm nhìn (Vision)
- **Tên dự án:** V-Pet Tutor — Học tập qua Tương tác & Trò chơi hóa (Gamification).
- **Tagline:** "Biến mỗi tài liệu nhàm chán thành một hành trình nuôi dưỡng tri thức."
- **Vấn đề cốt lõi:** Việc tự học qua PDF/Slide truyền thống thiếu tính tương tác, dẫn đến học viên mau chán và không có động lực duy trì thói quen học tập (Low Retention Rate).

---

## Slide 2: Giải pháp của chúng tôi (The Solution)
- **V-Pet Tutor là gì?** Một hệ thống Adaptive Learning (Học tập thích ứng) kết hợp Gamification.
- **2 Trụ cột chính:**
  1. **AI Edge (Gemini):** Đọc hiểu ngữ cảnh ngay tại thời điểm học viên đang đọc (Just-in-time learning). Không phụ thuộc vào ngân hàng đề tĩnh.
  2. **Gamification (Thú cưng ảo):** Phản hồi trực quan thành tích học tập (Feedback Loop).

---

## Slide 3: Demo Flow (Trải nghiệm Người dùng)
*(Slide này nên có Video hoặc GIF quay màn hình)*
- **Bước 1 (Đọc & Highlight):** Học viên bôi đen một khái niệm khó trong bài.
- **Bước 2 (Trigger):** Yêu cầu làm bài kiểm tra nhanh.
- **Bước 3 (On-the-fly Generation):** AI phân tích đoạn text và sinh ra câu hỏi theo đúng trình độ hiện tại.
- **Bước 4 (Phản hồi & Tiến hóa):** Trả lời đúng -> Cộng EXP -> Thú cưng lên cấp (Trứng -> Gà con -> Gà trống).

---

## Slide 4: Cơ chế "Sinh đề Động" (The Secret Sauce)
*(Slide này để khẳng định độ "xịn" của kỹ thuật)*
- Khác biệt với các nền tảng khác: **Hệ thống KHÔNG SỬ DỤNG ngân hàng đề tĩnh.**
- Áp dụng **Adaptive Quiz Engine**:
  - AI đọc lại lịch sử trả lời của học viên.
  - Nếu học viên làm sai -> Tự động sinh câu hỏi gợi ý, hạ độ khó.
  - Đảm bảo tính cá nhân hóa 100% dựa trên đúng đoạn text bôi đen.

---

## Slide 5: Kiến trúc Hệ thống (System Architecture)
- **Frontend:** Next.js (Xử lý tương tác, Highlight text, Hiển thị Pet).
- **Backend:** FastAPI (Xử lý Logic chấm điểm, Quản lý Session).
- **AI Engine:** Google Gemini (Generative AI).
- *(Rào trước)* **Data Flow MVP:** Để đảm bảo tốc độ iteration trong Hackathon, dữ liệu state (Pet Level, Quiz) đang được lưu qua cấu trúc **In-memory (RAM)** và file-based logging thay vì Database cồng kềnh.

---

## Slide 6: Roadmap & Tối ưu hóa (Chặn họng câu hỏi khó)
*(Đây là Slide quan trọng nhất để chứng minh team có tư duy Product/Kiến trúc lớn)*
Thay vì để bị hỏi, hãy tự nhận trước những điểm yếu của bản Demo và chỉ ra hướng giải quyết:

1. **Tech Debt (Nợ kỹ thuật):** 
   - Đã nhận diện vấn đề CORS/CSRF và State bị mất khi restart server. 
   - *Hướng giải quyết:* Tích hợp Redis để quản lý Session và SQLite/PostgreSQL để lưu trữ persistent trên môi trường Staging.
2. **Cost & Scalability (Chi phí API):** 
   - Bản Demo đang gọi trực tiếp AI cho mỗi câu hỏi.
   - *Hướng giải quyết:* Sẽ áp dụng **Vector Caching**. Nếu học sinh bôi đen cùng 1 đoạn text ở cùng Level -> Lấy câu hỏi từ Cache trả về thay vì gọi API AI, tiết kiệm 90% chi phí vận hành.
3. **Mở rộng Gamification:** 
   - Bổ sung Hệ thống Prestige (reset level lấy huy hiệu) để giải quyết giới hạn Level max, thêm cửa hàng Skin/Outfit cho Pet.

---

## Slide 7: Q&A (Hỏi & Đáp)
- "Cảm ơn Ban Giám Khảo, chúng em sẵn sàng lắng nghe và trao đổi ạ!"
- *(Nhóm mở file `question_test.md` ở màn hình khác hoặc cầm điện thoại để sẵn sàng "phản dame").*
