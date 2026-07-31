# 🔌 Frontend Integration Guide — V-Pet Tutor Backend API

> **Backend URL:** `http://localhost:8000`  
> **Swagger Docs (test thủ công):** `http://localhost:8000/docs`  
> **Khởi động backend:** `cd backend && ../.venv/bin/uvicorn main:app --reload`

---

## 📋 Tổng quan luồng hoạt động

```
1. App khởi động  →  GET /pet/status          (load trạng thái thú cưng)
2. Chọn file PDF  →  POST /slide/upload        (upload 1 lần, lưu slide_id)
3. Bôi đen chữ   →  POST /quiz/generate       (sinh câu hỏi, lưu quiz_id)
4. Chọn đáp án   →  POST /quiz/{quiz_id}/submit (nộp bài, nhận EXP + kết quả)
5. Instructor     →  GET /analytics/heatmap    (xem vùng khó của slide)
```

---

## 🚀 Bước 1 — Upload PDF bài giảng

**Gọi 1 lần khi học sinh chọn file PDF. Lưu `slide_id` vào state.**

```
POST /slide/upload
Content-Type: multipart/form-data
```

**TypeScript/React:**
```typescript
async function uploadSlide(file: File, title?: string) {
  const formData = new FormData()
  formData.append('file', file)           // File PDF (input type="file")
  if (title) formData.append('title', title)  // Tên bài giảng (tùy chọn)

  const res = await fetch('http://localhost:8000/slide/upload', {
    method: 'POST',
    body: formData,
    // ⚠️ KHÔNG set Content-Type header — browser tự set boundary
  })
  const data = await res.json()
  // data = { slide_id: "a3f9b1c2", title: "...", total_pages: 12 }

  // ✅ LƯU slide_id vào state để dùng cho các bước sau
  setSlideId(data.slide_id)
  setTotalPages(data.total_pages)
}
```

**Response:**
```json
{
  "slide_id": "a3f9b1c2",
  "title": "Chương 3 - Vector Database",
  "total_pages": 12,
  "message": "Upload thành công. Dùng slide_id='a3f9b1c2' cho quiz generation."
}
```

---

## 🐾 Bước 2 — Load trạng thái thú cưng

**Gọi khi app mở hoặc sau mỗi lần nộp bài để cập nhật UI thú cưng.**

```
GET /pet/status?session_id={userId}
```

**TypeScript:**
```typescript
async function loadPetStatus(sessionId: string) {
  const res = await fetch(`http://localhost:8000/pet/status?session_id=${sessionId}`)
  const pet = await res.json()
  // pet.emotion: "happy" | "excited" | "hungry"
  // pet.level: 1 (Trứng) | 2 (Gà Con) | 3 (Gà Trống)
  setPetStatus(pet)
}
```

**Response:**
```json
{
  "level": 2,
  "level_name": "Gà Con 🐣",
  "current_exp": 85,
  "max_exp": 150,
  "emotion": "happy",
  "streak_days": 3,
  "message": null
}
```

---

## ❓ Bước 3 — Sinh câu hỏi khi học sinh bôi đen chữ

**Kích hoạt khi học sinh bôi đen text và nhấn nút "Hỏi AI".**

```
POST /quiz/generate
Content-Type: application/json
```

**TypeScript:**
```typescript
async function generateQuiz(sessionId: string, slideId: string, pageNum: number) {
  // Lấy text học sinh vừa bôi đen
  const selectedText = window.getSelection()?.toString().trim()
  if (!selectedText || selectedText.length < 10) return

  const res = await fetch('http://localhost:8000/quiz/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      context_text: selectedText,   // ✅ Đoạn text bôi đen
      slide_id: slideId,            // ✅ Từ bước 1 (POST /slide/upload)
      page_num: pageNum,            // ✅ Trang đang xem (1-indexed)
      session_id: sessionId,        // ✅ ID học sinh (giữ nhất quán)
      // current_level: 2           // Tùy chọn — backend tự tính từ history
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    // err.detail = "Nội dung không hợp lệ." khi AI reject
    showError(err.detail)
    return
  }

  const quiz = await res.json()
  // ✅ QUAN TRỌNG: Lưu quiz_id để dùng cho submit
  setCurrentQuizId(quiz.quiz_id)
  setCurrentQuiz(quiz)
}
```

**Request body:**
```json
{
  "context_text": "Vector DB lưu trữ bản ghi dưới dạng vector nhúng",
  "slide_id": "a3f9b1c2",
  "page_num": 3,
  "session_id": "user-001"
}
```

**Response thành công:**
```json
{
  "quiz_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "question": "Vector DB lưu trữ bản ghi dưới dạng gì?",
  "options": ["A. Bảng quan hệ", "B. Vector nhúng", "C. File JSON", "D. Key-Value"],
  "difficulty_level": 2
}
```

**Response khi AI từ chối (status 400):**
```json
{ "detail": "Nội dung không hợp lệ hoặc ngoài phạm vi bài học." }
```

---

## ✅ Bước 4 — Nộp đáp án

**Gọi khi học sinh bấm chọn 1 trong 4 đáp án.**

```
POST /quiz/{quiz_id}/submit
Content-Type: application/json
```

**TypeScript:**
```typescript
async function submitAnswer(quizId: string, answer: 'A'|'B'|'C'|'D', sessionId: string) {
  const res = await fetch(`http://localhost:8000/quiz/${quizId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      selected_answer: answer,   // Chỉ gửi "A", "B", "C", hoặc "D"
      session_id: sessionId,     // Phải GIỐNG với lúc generate
    }),
  })

  const result = await res.json()
  // Hiển thị kết quả, cập nhật thú cưng
  showResult(result)
  setPetStatus(result.pet_status)  // Cập nhật EXP + level thú cưng ngay
}
```

**Response:**
```json
{
  "is_correct": true,
  "correct_answer": "B",
  "explanation": "Đúng! Vector DB lưu dữ liệu dưới dạng vector nhúng (embedding)...",
  "exp_added": 10,
  "pet_status": {
    "level": 2,
    "level_name": "Gà Con 🐣",
    "current_exp": 95,
    "max_exp": 150,
    "emotion": "excited",
    "streak_days": 3,
    "message": "Xuất sắc! Bạn nhận được +10 EXP 😻"
  }
}
```

---

## 📊 Instructor Dashboard — Heatmap

**Dùng cho trang Analytics của Giảng viên.**

```
GET /analytics/heatmap?document_id={doc_id}
```

**TypeScript:**
```typescript
async function loadHeatmap(documentId = 'doc_001') {
  const res = await fetch(`http://localhost:8000/analytics/heatmap?document_id=${documentId}`)
  const data = await res.json()
  // Dùng data.highlights để vẽ biểu đồ:
  // - highlight_count cao → tô màu đỏ (vùng khó)
  // - difficulty_score gần 1.0 → AI tạo câu hỏi ở đây hay sai nhất
  renderHeatmap(data.highlights)
}
```

---

## ⚠️ Các lỗi thường gặp & cách xử lý

| HTTP Status | Nguyên nhân | Xử lý |
|---|---|---|
| `400` | AI từ chối sinh câu hỏi (text mơ hồ/nội dung cấm) | Hiện thông báo: "Hãy chọn đoạn văn có nội dung học thuật cụ thể hơn nhé!" |
| `404` từ `/quiz/submit` | `quiz_id` không tồn tại hoặc đã nộp rồi | Hiện thông báo: "Bài thi đã hết hạn. Hãy tạo câu hỏi mới!" |
| `404` từ `/slide/{id}` | `slide_id` chưa upload | Gọi lại `POST /slide/upload` |
| `500` | Lỗi Gemini API | Hiện thông báo: "AI đang bận, thử lại sau ít giây nhé!" |

---

## 🧪 Test nhanh bằng curl

```bash
# 1. Kiểm tra server chạy
curl http://localhost:8000/

# 2. Upload PDF (thay path thực tế)
curl -X POST http://localhost:8000/slide/upload \
  -F "file=@/path/to/lecture.pdf" \
  -F "title=Chương 3 Vector DB"

# 3. Xem danh sách slides đã upload
curl http://localhost:8000/slide/list

# 4. Load pet status
curl "http://localhost:8000/pet/status?session_id=test-user"

# 5. Sinh câu hỏi (thay slide_id từ bước 2)
curl -X POST http://localhost:8000/quiz/generate \
  -H "Content-Type: application/json" \
  -d '{"context_text":"Vector DB lưu trữ bản ghi dưới dạng vector nhúng","slide_id":"a3f9b1c2","page_num":2,"session_id":"test-user"}'

# 6. Nộp đáp án (thay quiz_id từ bước 5)
curl -X POST http://localhost:8000/quiz/f47ac10b-xxx/submit \
  -H "Content-Type: application/json" \
  -d '{"selected_answer":"B","session_id":"test-user"}'

# 7. Xem Swagger UI đầy đủ
open http://localhost:8000/docs
```
