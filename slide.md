# 📊 Kịch Bản & Cấu Trúc Slide Thuyết Trình — V-Pet Tutor

> **Mục tiêu file này:** Dùng để làm dàn ý (outline) khi thiết kế Slide hoặc chuẩn bị kịch bản Pitching. Cấu trúc này được thiết kế theo hướng **"Rào trước đón sau"** — chủ động đưa các giới hạn hệ thống vào Roadmap để thể hiện tầm nhìn Product/Engineering, chặn họng các câu hỏi bắt bẻ của Ban Giám Khảo (BGK).

---

## Slide 1: Tiêu đề & Tầm nhìn (Vision)
- **Tên dự án:** V-Pet Tutor — Học tập Thích ứng (Adaptive Learning) kết hợp Gamification.
- **Tagline:** "Biến mỗi tài liệu khô khan thành một hành trình nuôi dưỡng tri thức."
- **Vấn đề cốt lõi (Pain-points):** 
  - *Học sinh:* Việc tự học qua PDF/Slide thiếu tương tác, tỷ lệ bỏ cuộc sớm lên tới 58% (Thiếu động lực / Low Retention).
  - *Giảng viên:* Thiếu insight thực tế về việc sinh viên đang "kẹt" ở đâu trong tài liệu (Blind spot trong giáo dục).

---

## Slide 2: Giải pháp của chúng tôi (The Solution)
- **V-Pet Tutor là gì?** Không chỉ là công cụ học cho sinh viên, mà còn là trợ lý phân tích cho giảng viên.
- **3 Trụ cột chính:**
  1. **AI Edge (Gemini):** Đọc hiểu ngữ cảnh ngay tại thời điểm học viên bôi đen text (Just-in-time learning), sinh câu hỏi động không cần ngân hàng đề tĩnh.
  2. **Gamification (Thú cưng ảo):** Phản hồi trực quan. Trả lời đúng -> Cộng EXP -> Thú cưng tiến hóa.
  3. **B2B Analytics (Heatmap):** Tổng hợp dữ liệu tương tác của lớp học để xuất báo cáo vùng kiến thức khó cho Giảng viên.

---

## Slide 3: Demo Flow - Góc nhìn Học sinh (User Experience)
*(Slide này nên có Video hoặc GIF quay màn hình bản build hiện tại)*
- **Bước 1 (Chọn bài học):** Giao diện nạp sẵn danh sách bài giảng tĩnh (Auto-load static slides) — học sinh chỉ cần chọn bài là học ngay, không cần upload phức tạp.
- **Bước 2 (Đọc & Highlight):** Học viên bôi đen một khái niệm khó hiểu.
- **Bước 3 (On-the-fly Generation):** AI phân tích đúng đoạn text đó và sinh câu hỏi trắc nghiệm tùy chỉnh.
- **Bước 4 (Tiến hóa):** Nộp bài -> Chấm điểm -> Cộng EXP theo độ khó (Dễ +5, Vừa +10, Khó +15) -> Thú cưng lên cấp (Trứng 🥚 -> Gà con 🐣 -> Gà 🐔).

---

## Slide 4: Demo Flow - Góc nhìn Giảng viên (Instructor Analytics)
- Giới thiệu tính năng **Knowledge Heatmap** (Điểm bán hàng B2B ăn tiền nhất của dự án).
- **Cơ chế hoạt động:** 
  - Mỗi khi học viên bôi đen text để xin câu hỏi, hệ thống ghi log lại (slide nào, dòng chữ nào, tỷ lệ trả lời sai bao nhiêu).
  - AI tổng hợp thành một "Bản đồ nhiệt". Giảng viên nhìn vào sẽ thấy ngay: *"À, slide 15 đoạn định nghĩa Vector DB đang có tới 80% sinh viên bôi đen và trả lời sai."* -> Điều chỉnh lại giáo trình cho khóa sau.

---

## Slide 5: Cơ chế "Sinh đề Động" (The Secret Sauce)
*(Khẳng định độ "xịn" của kỹ thuật)*
- Khác biệt với các nền tảng EduTech khác: **Hệ thống KHÔNG SỬ DỤNG ngân hàng đề tĩnh.**
- Áp dụng **Adaptive Quiz Engine**:
  - Giải quyết 4 lỗ hổng của AI giáo dục: ① AI sinh câu sai kiến thức; ② Học viên trả lời mơ hồ; ③ Học viên hack điểm; ④ Câu hỏi quá khó làm nản chí.
  - Hệ thống của chúng tôi tự động điều chỉnh độ khó dựa trên lịch sử của phiên học (In-memory session state).

---

## Slide 6: Kiến trúc Hệ thống (System Architecture)
- **Frontend:** Next.js (Xử lý tương tác PDF iframe mượt mà, Gamification Canvas).
- **Backend:** FastAPI (Xử lý Logic chấm điểm, Quản lý Session bằng in-memory dict).
- **AI Engine:** Google Gemini (Generative AI với cấu trúc Schema/Structured Output nghiêm ngặt).
- *(Rào trước)* **Data Flow MVP:** Để đảm bảo tốc độ iteration trong Hackathon, dữ liệu trạng thái được lưu qua cấu trúc **In-memory (RAM)** để response realtime, bỏ qua độ trễ của Database vật lý.

---

## Slide 7: Roadmap & Tối ưu hóa (Chặn họng câu hỏi khó)
*(Thể hiện tư duy Product/Kiến trúc hệ thống lớn)*

1. **Tech Debt (Nợ kỹ thuật):** 
   - *Vấn đề:* Bản demo lưu state trên RAM nên sẽ mất dữ liệu khi restart.
   - *Giải pháp:* Tích hợp Redis để quản lý Session nhanh và PostgreSQL để lưu trữ tiến độ (Persistent Data) khi lên môi trường Staging/Production.
2. **Cost & Scalability (Chi phí API LLM):** 
   - *Vấn đề:* Bản Demo đang gọi trực tiếp AI cho mỗi cú bôi đen (tốn token, tốn tiền).
   - *Giải pháp:* Áp dụng **Vector Caching (Ví dụ: Redis Vector / ChromaDB)**. Nếu sinh viên B bôi đen cùng một đoạn text giống sinh viên A -> Lấy câu hỏi từ Cache trả về thay vì gọi API Gemini, tiết kiệm 90% chi phí.
3. **Mở rộng Gamification:** 
   - Thêm cơ chế Streak (Học liên tục 3 ngày thưởng 20 EXP).
   - Bổ sung Hệ thống Prestige (reset level lấy huy hiệu) để giải quyết giới hạn max level và cửa hàng Skin (Trang phục) cho Pet.

---

## Slide 8: Q&A (Hỏi & Đáp)
- "Cảm ơn Ban Giám Khảo, chúng em sẵn sàng lắng nghe và trao đổi ạ!"
- *(Nhóm mở file `question_test.md` ở màn hình khác để sẵn sàng trả lời các câu hỏi tình huống).*
