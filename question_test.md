# 📋 Câu Hỏi Thuyết Trình & Bug Report — V-Pet Tutor

---

## 🎯 PHẦN 1: Câu Hỏi & Trả Lời Chuẩn Bị Thuyết Trình

---

### ❓ Q1: Làm sao dám khẳng định LLM tạo ra câu trả lời chính xác?

**Trả lời ngắn:** "Chúng tôi không khẳng định LLM luôn đúng 100%, nhưng có 3 lớp kiểm soát để đảm bảo chất lượng."

**3 lớp kiểm soát:**
- **Lớp 1 — Grounding (Bám context):** System Prompt ép AI chỉ dựa vào đoạn text học viên bôi đen, không được bịa thêm.
- **Lớp 2 — Eval tự động:** Bộ 20 test case với `expected_action` (generate / reject) kiểm tra tỉ lệ đúng trên tập mẫu đã xác nhận bởi con người.
- **Lớp 3 — Giải thích hiển thị:** Sau mỗi câu trả lời, AI phải giải thích lý do bằng cách trích dẫn trực tiếp từ đoạn slide. Học viên có thể đọc lại để tự kiểm chứng.

---

### ❓ Q2: Nếu học sinh trả lời sai liên tục → hệ thống vận hành như thế nào?

**Trả lời ngắn:** "Hệ thống Adaptive Quiz sẽ tự điều chỉnh độ khó và bổ sung thêm giải thích."

**Luồng chi tiết:**
```
Trả lời Sai Lần 1 → +2 EXP khích lệ → AI ghi vào history
Trả lời Sai Lần 2 → AI đọc history (2 lần sai) → sinh câu Dễ hơn
Trả lời Sai Lần 3+ → AI nhận diện vùng khó → sinh câu kèm gợi ý (Hint)
```
Tất cả lịch sử được lưu phía server (trong session), AI đọc lại mỗi lần generate câu mới.

---

### ❓ Q3: Làm sao biết chắc LLM nhận diện được đáp án đó là chính xác?

**Trả lời ngắn:** "Không dựa vào model tự đánh giá — Backend kiểm soát logic chấm bài hoàn toàn."

**Cơ chế:**
- AI chỉ có nhiệm vụ sinh ra câu hỏi + đáp án + đáp án đúng (chuỗi "A", "B", "C", "D").
- `correct_answer` được lưu kín phía Backend, không gửi xuống Frontend.
- Khi học viên nộp bài, Backend tự so sánh `selected_answer` với `correct_answer` đã lưu. AI không tham gia vào khâu chấm.
- **Chất lượng** đáp án được đảm bảo bởi System Prompt + bộ Eval 20 case có con người xác nhận.

---

### ❓ Q4: Nếu người dùng cố tình gian lận (cậy điểm)?

**Trả lời ngắn:** "Chúng tôi đã đóng các lỗ hổng hack điểm nghiêm trọng."

**Các cơ chế chống gian lận đang có:**
| Kỹ thuật tấn công | Cơ chế phòng thủ |
|---|---|
| Gửi `exp_earned=9999` | API `/pet/update` đã bị xóa. Không còn endpoint cho client tự bơm điểm |
| Inspect Network → lấy đáp án trước | `/quiz/generate` chỉ trả về câu hỏi, đáp án lưu ở server |
| Gửi `is_correct=true` với đáp án sai | Backend tự chấm bài, không tin tham số từ client |
| Submit nhiều lần cùng 1 quiz | Sau khi submit, quiz_id bị xóa khỏi `active_quizzes` |

---

### ❓ Q5: Có phát triển thêm "thú cưng có quần áo đẹp" không?

**Trả lời ngắn:** "Đây là một trong những Roadmap hấp dẫn nhất của sản phẩm và đã được ghi trong backlog."

**Roadmap Gamification mở rộng:**
- **Skin / Outfit:** Mở khóa trang phục khi đạt mốc EXP. VD: Level 3 → Thú cưng đội mũ tốt nghiệp 🎓
- **Accessory NFT-style:** Phần thưởng đặc biệt khi hoàn thành chuỗi streak dài
- **Cạnh tranh bạn bè:** Leaderboard EXP giữa các học viên cùng lớp

---

## 🐛 PHẦN 2: Các Bug Thực Tế Trong Code (Cần Biết Khi Bị Hỏi)

> [!WARNING]
> Các bug dưới đây em tìm thấy trực tiếp trong code hiện tại. Anh nên chuẩn bị câu trả lời để xử lý nếu Ban Giám Khảo phát hiện ra.

---

### 🐛 Bug #1: `submit` vẫn trả về `exp_reward` khi sai bài (ít nghiêm trọng)
- **File:** [`quiz.py:47`](file:///home/laptop_wii/Desktop/La_VIN/Batch03-K4-Edge-Agent/backend/routers/quiz.py#L47)
- **Vấn đề:** `exp_added = quiz_data["exp_reward"] if is_correct else 2` nhưng `award_exp` lại luôn nhận `quiz_data["exp_reward"]` vào tham số, hàm nội bộ mới xử lý +2 khi sai. Giá trị `exp_added` trong response bị sai khi is_correct=False.
- **Ảnh hưởng:** Giao diện Frontend có thể hiển thị "Bạn nhận +10 EXP" dù thực tế chỉ cộng +2.
- **Chuẩn bị:** *"Đây là lỗi hiển thị nhỏ về UX, logic cộng điểm vẫn đúng. Chúng tôi sẽ fix trong sprint tiếp theo."*

---

### 🐛 Bug #2: `active_quizzes` sẽ bị mất sau khi restart server (thiết kế biết trước)
- **File:** [`quiz.py:11`](file:///home/laptop_wii/Desktop/La_VIN/Batch03-K4-Edge-Agent/backend/routers/quiz.py#L11)
- **Vấn đề:** `active_quizzes = {}` lưu trên RAM. Nếu server bị restart giữa chừng, học viên submit với quiz_id cũ sẽ nhận 404.
- **Chuẩn bị:** *"Chúng tôi biết hạn chế này. MVP1 dành cho demo 1 phiên, Production sẽ dùng Redis hoặc SQLite để persistent state."*

---

### 🐛 Bug #3: `allow_origins=["*"]` kết hợp `allow_credentials=True` là thiếu bảo mật
- **File:** [`main.py:12-13`](file:///home/laptop_wii/Desktop/La_VIN/Batch03-K4-Edge-Agent/backend/main.py#L12)
- **Vấn đề:** Theo chuẩn RFC, kết hợp này bị browser chặn (CORS error) và còn mở cửa cho tấn công CSRF.
- **Chuẩn bị:** *"Chúng tôi đã nhận diện vấn đề CORS/CSRF này và sẽ siết lại origin khi deploy staging."*

---

### 🐛 Bug #4: EXP vượt quá cấp độ tối đa (Level 3) không được kiểm soát
- **File:** [`pet.py:30-34`](file:///home/laptop_wii/Desktop/La_VIN/Batch03-K4-Edge-Agent/backend/routers/pet.py#L30)
- **Vấn đề:** `calculate_level_info` trả về `max_exp=300` khi EXP đạt 300+, nhưng học viên vẫn tiếp tục cộng EXP. `current_exp` có thể vượt `max_exp` mà không có cơ chế reset hoặc "Prestige".
- **Chuẩn bị:** *"Đây là MVP nên giới hạn thiết kế ở 3 level. Prestige system là ý tưởng cho phiên bản sau."*

---

### 🐛 Bug #5: Import vòng tròn (Circular Import) tiềm ẩn
- **File:** [`gemini_service.py:62`](file:///home/laptop_wii/Desktop/La_VIN/Batch03-K4-Edge-Agent/backend/services/gemini_service.py#L62)
- **Vấn đề:** `gemini_service.py` import `get_session` từ `routers/pet.py`. Nếu sau này `pet.py` import bất kỳ thứ gì từ `services/`, sẽ gây lỗi `ImportError: circular import` khó debug.
- **Chuẩn bị:** *"Đúng, đây là technical debt về kiến trúc. Pattern đúng là tách `session_store.py` thành module riêng. Chúng tôi sẽ refactor trước khi mở rộng thêm feature."*

---

### 🐛 Bug #6: Root endpoint vẫn liệt kê `POST /pet/update` đã bị xóa
- **File:** [`main.py:30`](file:///home/laptop_wii/Desktop/La_VIN/Batch03-K4-Edge-Agent/backend/main.py#L30)
- **Vấn đề:** Swagger documentation tự động sẽ đúng, nhưng endpoint `"POST /pet/update"` trong `read_root()` response là thông tin sai vì API này đã bị xóa.
- **Chuẩn bị:** *"Lỗi typo trong tài liệu, API thực tế đã được cập nhật. Swagger docs là nguồn sự thật duy nhất."*