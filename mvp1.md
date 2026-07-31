# 🗓️ Kế hoạch Tác chiến Chi tiết (MVP 1) — V-Pet Tutor

Tài liệu này là "bản đồ chỉ đường" chi tiết từng bước (Step-by-step) để nhóm đi từ bộ Source Code hiện tại đến bản Demo hoàn chỉnh nộp lúc CP6.

---

## 🛠️ Phase 1: Lắp "Não" AI và Chốt Logic Backend (Dự kiến: 1.5 - 2 Tiếng)
Mục tiêu: Đảm bảo AI sinh câu hỏi đúng chuẩn và không bị lỗi.

- [ ] **1.1. Cấu hình API Key:** 
  - Lấy GEMINI_API_KEY từ Google AI Studio.
  - Dán vào file `.env` ở thư mục gốc.
- [ ] **1.2. Test API thủ công:**
  - Chạy backend: `cd backend && python main.py`
  - Mở `http://localhost:8000/docs`, gửi request thử tới `POST /quiz/generate` xem AI có sinh đúng JSON không.
- [ ] **1.3. Viết 20 kịch bản Test (Eval Set):**
  - Mở file `backend/eval/test_cases.json`.
  - Tự nghĩ ra 20 tình huống (ví dụ: bôi đen câu lạc đề, bôi đen từ viết tắt, câu hỏi hóc búa...).
- [ ] **1.4. Chạy Eval & Sửa Prompt (Quan trọng nhất để lấy điểm Rubric):**
  - Chạy lệnh `python backend/eval/run_eval.py`.
  - Xem kết quả: Nếu AI bịa đáp án hoặc trả lời sai kịch bản ngoài luồng -> Sửa lại biến `SYSTEM_PROMPT` trong `gemini_service.py` cho chặt chẽ hơn.
  - Lặp lại đến khi pass > 80%.

---

## 🎨 Phase 2: Dựng Giao Diện Frontend (Next.js) (Dự kiến: 3 - 4 Tiếng)
Mục tiêu: Xây dựng các khối giao diện hiển thị cho người dùng.

- [ ] **2.1. Chuẩn bị môi trường FE:**
  - Chạy `cd frontend && npm install && npm run dev`.
  - Mở `http://localhost:3000` để code trực tiếp.
- [ ] **2.2. Vẽ Component `PetWidget` (Thú Cưng):**
  - Dựng UI một cái khung ở góc dưới màn hình.
  - Hiển thị Emoji (🥚 hoặc 🐣) dựa trên prop `level`.
  - Vẽ thanh Progress Bar hiển thị `EXP / Max EXP`.
- [ ] **2.3. Vẽ Component `SlideViewer` (Giả lập bài giảng):**
  - Dùng 1 ảnh (ví dụ slide 4 ngày 1) làm hình nền.
  - Phủ một thẻ `<div>` trong suốt có viền vàng lên chữ "RAG là..." để làm Vùng Nóng (Hotspot).
- [ ] **2.4. Vẽ Component `QuizCard` (Thẻ trắc nghiệm):**
  - Dựng UI Modal/Popup hiển thị: Câu hỏi + 4 Nút đáp án (A,B,C,D).

---

## 🔌 Phase 3: Nối Dây (Integration) Frontend ↔ Backend (Dự kiến: 2 Tiếng)
Mục tiêu: Giao diện bấm được và nhảy số.

- [ ] **3.1. Fetch Data khởi tạo:**
  - Khi load trang, gọi `GET /pet/status` để lấy EXP hiện tại gán vào `PetWidget`.
- [ ] **3.2. Luồng làm Quiz:**
  - User click vào "Vùng nóng" trên Slide -> Code React hiện màn hình Loading -> Gọi API `POST /quiz/generate` với đoạn text RAG.
  - Nhận data JSON về -> Tắt Loading -> Mở popup `QuizCard` nhét câu hỏi và 4 đáp án vào.
- [ ] **3.3. Luồng nộp bài & Trả thưởng:**
  - User click chọn 1 đáp án.
  - So sánh với `correct_answer` từ API trả về -> Đúng/Sai.
  - Gọi API `POST /pet/update` gửi kết quả (đúng/sai).
  - API trả về EXP mới -> Update lại thanh Progress Bar của con gà (Kèm alert chúc mừng/an ủi).

---

## 🎬 Phase 4: Chuẩn bị Demo (Dự kiến: 2 Tiếng)
- [ ] **4.1. Quay màn hình flow (Happy Path):** User mở slide -> Click vùng nóng -> Trả lời đúng -> Thú cưng lớn lên.
- [ ] **4.2. Quay màn hình kịch bản lỗi:** User bôi đen vớ vẩn -> AI nhắc nhở.
- [ ] **4.3. Làm slide chốt:** Chụp kết quả chạy `run_eval.py` ném vào slide để show cho giám khảo: "Tụi em có test AI bài bản đàng hoàng!".
