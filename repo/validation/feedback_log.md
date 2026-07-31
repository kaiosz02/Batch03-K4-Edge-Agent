# BÁO CÁO VALIDATION VỚI USER THẬT (FEEDBACK LOG CP5)
**Dự án:** V-Pet Tutor — Thú Cưng Học Tập Thích Ứng  
**Nhóm:** Group: Edge-agent (Khóa K4 AI Thực Chiến)  
**Thời gian thực hiện:** Vòng Validation CP5 (Sáng Ngày 2 Hackathon)  
**Đối tượng thử nghiệm:** 5 học viên ngoài nhóm (bao gồm 3 Willing Users đã đăng ký từ CP1 tại Khóa 3 và Khóa 4)

---

## 1. QUY TRÌNH & THIẾT KẾ PHIÊN VALIDATION (10 PHÚT / NGƯỜI)

### 1.1 Kịch bản Giao Task (Task-based Testing)
- **Bối cảnh:** Học viên đóng vai người tự học trên VLearn đang đọc slide bài giảng (đặc biệt các slide thuộc "Vùng nóng" Confusion Hotspots như Slide 8, Slide 12 - nơi 28.4% học viên thụ động yêu cầu giải thích).
- **Nhiệm vụ:**
  1. Đọc slide bài giảng trên giao diện VLearn.
  2. Bôi đen một thuật ngữ / đoạn kiến thức khó hiểu để kích hoạt **V-Pet Adaptive Quiz**.
  3. Tương tác làm bài quiz, nhận giải thích và xem điểm thưởng EXP / cấp độ Thú cưng.
  4. Thử nghiệm các tình huống biên (bôi đen quá ngắn, bấm thử lại nhiều lần, hoặc bypass bài quiz).

### 1.2 Nguyên tắc Quan sát & Thu thập 
1. **Im lặng quan sát:** Người phụ trách validation (Việt Vinh) hoàn toàn không gợi ý, không giải thích trước UI, chỉ ghi nhận hành vi bấm chuột, điểm kẹt, phản ứng cảm xúc của user.
2. **Phỏng vấn 3 câu hỏi chuẩn CP5 (Nguyên văn):**
   - **Câu 1:** *"Điều gì khó hiểu hoặc khó chịu nhất khi bạn sử dụng?"*
   - **Câu 2:** *"Kết quả câu trả lời / bài quiz này bạn có tin tưởng không — vì sao?"*
   - **Câu 3:** *"Bạn có dùng thật sản phẩm này trong các buổi học tới không — vì sao / vì sao chưa?"*

---

## 2. BẢNG FEEDBACK LOG CHI TIẾT 

| STT | Người thử (Tên/Vai — Willing User?) | Task thử nghiệm | Quan sát (Hành vi & Điểm kẹt) | Quote Nguyên Văn (3 Câu trả lời CP5) | Mức nghiêm trọng |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | **Trịnh Bá Khánh Trình**<br>*(Học viên Khóa 4 — Willing User CP1)* | Bôi đen thuật ngữ "Rule-based Bot" tại Slide 8, làm Quiz nâng điểm EXP V-Pet. | Bôi đen chuẩn, làm xong quiz nhận EXP. Tuy nhiên khi vội muốn đặt câu hỏi trực tiếp giải thích thêm thì bị Popup Quiz bắt buộc làm trước, loay hoay tìm nút thoát. | • **C1:** *"Lúc học mà có pet đồng hành cùng mình cảm thấy vui hơn hẳn. "*<br>• **C2:** *"Kết quả quiz và giải thích rất tin vì AI ghi rõ trích dẫn '[Slide 8]', mình bấm lật slide kiểm tra thấy khớp 100%."*<br>• **C3:** *"Sẽ dùng thật vì cảm giác có con V-Pet nhảy ra cổ vũ làm bớt nản khi đọc tài liệu lý thuyết khô khan."* | **Trung bình** *(UX flow friction)* |
| **2** | **Nguyễn Tuấn Vũ**<br>*(Học viên Khóa 3 — Willing User CP1)* | Bôi đen đoạn ngắn "Form validation" (chỉ 2 từ) tại Slide 8. | Hà bôi đen quá ngắn (2 từ). AI không đủ dữ kiện sinh quiz nên Thú cưng im lìm hiện dòng nhắc nhỏ. Hà tưởng web bị đơ trong 3 giây đầu. | • **C1:** *"Học slide nào cũng có quiz theo trình độ của bản thân, nên dễ tiếp thu hơn.'."*<br>• **C2:** *"Tin tưởng vì khi bôi đoạn dài hơn thì quiz sinh ra hỏi đúng trọng tâm slide chứ không bịa linh tinh ngoài bài."*<br>• **C3:** *"Chắc chắn dùng vì cơ chế tăng điểm EXP và lên cấp cho thú cưng làm mình có động lực đọc hết các slide khó."* | **Thấp** *(UI Notice visibility)* |
| **3** | **Phạm Xuân Phong**<br>*(Học viên Khóa 3 — Willing User CP1)* | Thử làm bài quiz thích ứng, cố tình bấm lụi đáp án sai 4-5 lần để kiểm tra tích điểm. | Trang bấm lụi liên tục các phương án sai. Thấy mỗi lần sai chỉ bị trừ bớt EXP nhưng thử lại 3-4 lần vẫn mò ra đáp án đúng để nhận điểm. | • **C1:** *"Khó chịu nhất là nếu chọn sai mà bấm thử lại 3-4 lần thì vẫn mò ra đáp án đúng và nhận được EXP. Này dễ bị mấy bạn bấm lụi để cày level lắm."*<br>• **C2:** *"Tin chứ, vì phần giải thích đáp án sai nói rõ lý do tại sao phương án đó không khớp với tài liệu Slide 12."*<br>• **C3:** *"Dùng thật nếu fix được trò spam click lụi, vì mình thích kiểu vừa học vừa nuôi pet tích streak."* | **Cao** *(Domain Risk - Exploitation)* |
| **4** | **La Thanh Tuyết**<br>*(Học viên Khóa 3 — Outside Tester)* | Đọc slide bài giảng Day 1, bôi đen vùng kiến thức khó tại Slide 12 để làm thử thách V-Pet. | Tương tác hào hứng với avatar V-Pet animation. Làm đúng Quiz mức Khó và nhận điểm tối đa. | • **C1:** *"Lúc bôi đen mà chú gà con nhảy ra đố vui làm mình thấy hào hứng hẳn, không bị chán như đọc PDF một mình."*<br>• **C2:** *"Tin 100% vì câu hỏi sát với slide, đáp án có trích nguồn rõ ràng."*<br>• **C3:** *"Rất muốn dùng thật trong các buổi học tới để đỡ buồn ngủ."* | **Thấp** *(Feature Request: Sound/Effects)* |
| **5** | **Phùng Quốc Việt**<br>*(Học viên Khóa 3 — Outside Tester)* | Kiểm tra tính xác thực nguồn trích dẫn slide khi AI giải thích kết quả Quiz. | Tập trung kiểm tra badge trích dẫn `[Slide 12]`. Click vào trích dẫn để nhảy đối chiếu nội dung slide. | • **C1:** *"Giao diện hơi nhiều thông tin ở góc phải, lúc mới vào phải mất vài giây mới định vị được bảng V-Pet."*<br>• **C2:** *"Thích nhất là trả lời xong AI ghi rõ '[Slide 12]' để mình click kiểm tra lại liền, không sợ AI nói xàm."*<br>• **C3:** *"Có dùng thật vì trích dẫn minh bạch giúp mình không phải lật tìm lại slide mất thời gian."* | **Trung bình** *(UI Layout layout)* |

---

## 3. TỔNG HỢP & NGHỆ THUẬT XỬ LÝ FEEDBACK (SYNTHESIS 4 PHẦN)

### 3.1 Chủ đề lặp lại nhiều nhất (Recurring Themes)
1. **Luồng trải nghiệm bị chặn khi đang vội (UX Friction):** Học viên mong muốn có sự linh hoạt giữa việc nuôi Thú Cưng (Game) và việc hỏi Tutor nhanh (Task completion). Không được ép làm Quiz nếu họ có câu hỏi cụ thể.
2. **Rủi ro cày điểm gian lận (Domain Anti-cheat Risk):** Cơ chế chọn lụi nhiều lần (Brute-force) để lấy EXP sẽ làm mất giá trị giáo dục của Adaptive Quiz.
3. **Sự minh bạch trích dẫn (Trust & Alignment):** Trích dẫn chính xác số trang `[Slide X]` là yếu tố then chốt (100% user xác nhận) giúp loại bỏ hoàn toàn nỗi sợ AI hallucinate.

### 3.2 1-2 Thay đổi ĐÃ LÀM trước Demo (Ghi nhận Changelog §9 & Slide 5)
- **Nâng cấp 1 — Thêm nút "Bỏ qua thử thách" (Áp dụng HAX Principle G8):**  
  *Trỏ về feedback của Nguyễn Đức Minh:* Bổ sung nút **"Bỏ qua thử thách"** trên Popup Quiz. Cho phép học viên ngay lập tức bypass bài quiz để chuyển sang luồng hỏi đáp Tutor giải thích trực tiếp.
- **Nâng cấp 2 — Cơ chế khóa thử thách 1 phút chống Brute-force (Domain Risk §5):**  
  *Trỏ về feedback của Lê Thu Trang:* Nếu học viên bấm chọn sai đáp án quá 3 lần liên tiếp trong một câu hỏi, hệ thống sẽ tạm thời **Khóa thử thách 1 phút** và không cộng EXP, ngăn chặn triệt để hành vi click lụi cày level.

### 3.3 Giữ nguyên ĐÓ CÓ LÝ DO (Intentionally Kept with Rationale)
- **Giữ nguyên KHÔNG làm Bảng xếp hạng thi đua (Leaderboard):**  
  *Căn cứ:* Mặc dù 1 tester đề xuất làm Leaderboard so kè điểm giữa các học viên, nhóm quyết định **GIỮ NGUYÊN loại bỏ Leaderboard** dựa trên số liệu khảo sát $N=40$ (Leaderboard tạo áp lực tâm lý tiêu cực cho người học yếu). V-Pet chỉ tập trung vào tiến trình cá nhân (Personal Streak & Level).
- **Giữ nguyên thông báo từ chối khi bôi đen quá ngắn (<3 từ):**  
  *Căn cứ:* Hệ thống tiếp tục giữ cơ chế **Conditional Automation**, từ chối sinh Quiz khi bôi đen < 3 từ để bảo vệ Quality Bar ($\ge 80\%$), tránh trường hợp AI thiếu ngữ cảnh dẫn đến sinh câu hỏi sai lệch kiến thức.

### 3.4 Đưa vào Backlog (Nội dung Slide 6 — Kế hoạch 1 tuần tới)
1. **Lưu trữ State bền vững (Persistence):** Chuyển toàn bộ dữ liệu EXP/Level V-Pet từ In-Memory RAM sang **Redis Session Storage + PostgreSQL** để bảo toàn khi hạ tầng restart.
2. **Semantic Vector Caching:** Cache các câu hỏi Adaptive Quiz theo vector semantic của đoạn bôi đen, giúp tiết kiệm **90% chi phí API LLM** khi scale hàng nghìn học viên.
3. **Tăng tỷ lệ AI chủ động tương tác (Proactive Tutor):** Nâng tỷ lệ AI chủ động đặt câu hỏi kiểm tra độ hiểu bài (`validate_understanding`) từ 0.08% hiện tại lên $\ge 20\%$.

---


