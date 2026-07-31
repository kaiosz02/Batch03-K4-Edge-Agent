# 🧠 Brainstorm: V-Pet Tutor — Bức tranh tổng thể & System Flow

---

## 🎯 Vấn đề cốt lõi cần giải
```
Học sinh đọc slide bài giảng
→ Gặp đoạn khó → Thấy chán nản → Bỏ cuộc sớm (Retention Rate thấp).
Giảng viên dạy xong
→ Không biết sinh viên thực sự hiểu hay đang "kẹt" ở slide nào.
```

---

## 💡 Giải pháp: 2 góc nhìn (Sinh viên & Giảng viên)

```
GÓC NHÌN SINH VIÊN                      GÓC NHÌN GIẢNG VIÊN (B2B)
─────────────────                       ─────────────────────────
Đọc slide (Auto-loaded)             →   Dashboard Analytics
      ↓                                       ↑
Bôi đen đoạn khó                    →   Ghi nhận "Vùng mù kiến thức"
      ↓                                       ↑
AI sinh Quiz (Adaptive)             →   Thống kê tỷ lệ Đúng/Sai
      ↓                                       ↑
Trả lời nhận EXP & Pet Tiến hóa     →   Xuất "Knowledge Heatmap"
```

---

## 📍 TẦNG 1: Trải nghiệm Sinh viên (Học tập & Gamification)

**1. Khởi tạo bài học (Static Load):**
- Hệ thống không yêu cầu sinh viên phải tự tải file PDF lên.
- Backend tự động nạp sẵn các file bài giảng chuẩn (ví dụ từ thư mục `data/vlearn-pack/slides`) lúc server khởi động. Sinh viên chỉ cần vào và học ngay.

**2. Bôi đen & Học tương tác (Just-in-time Learning):**
- Khi sinh viên không hiểu 1 khái niệm, họ **bôi đen (highlight)** đoạn text đó.
- Nhấn nút "Tạo câu hỏi ôn tập".

**3. AI Sinh Đề Động (Adaptive Quiz):**
- AI (Gemini) nhận Context (đoạn text bôi đen) + Trình độ hiện tại.
- Trả về JSON một câu hỏi trắc nghiệm bám sát đúng nghĩa đoạn text đó.
- *Lưu ý:* AI KHÔNG dùng ngân hàng đề tĩnh. Nó tự "đọc hiểu" cùng sinh viên.

**4. Gamification (Thú Cưng Nhận EXP):**
```
Nguồn EXP                          Số EXP
──────────────────────────────────────────
Trả lời đúng câu Dễ                +5 EXP
Trả lời đúng câu Vừa              +10 EXP  
Trả lời đúng câu Khó              +15 EXP
Trả lời sai (vẫn thưởng khích lệ)  +2 EXP
──────────────────────────────────────────
Level 1 (Trứng 🥚):   0   → 50  EXP
Level 2 (Gà con 🐣):  51  → 150 EXP
Level 3 (Gà 🐔):      151 → 300 EXP
```

---

## 📚 TẦNG 2: Trải nghiệm Giảng viên (Knowledge Heatmap)

Mỗi lần sinh viên tương tác (bôi đen, làm quiz), Backend ngầm thu thập dữ liệu:
```json
{
  "slide_id": "static_0",
  "page_num": 15,
  "text_snippet": "Vector Database lưu trữ...",
  "highlight_count": 82,
  "wrong_answer_count": 60
}
```

**Giá trị mang lại cho Giảng viên:**
- **Heatmap (Bản đồ nhiệt):** Giảng viên mở Dashboard sẽ thấy ngay Slide 15 đang "đỏ rực" vì có 82 sinh viên bôi đen và tỷ lệ làm sai là 73%.
- **Actionable Insight:** Giảng viên biết ngay khái niệm "Vector Database" đang được truyền đạt chưa tốt, cần sửa lại giáo trình hoặc giảng kỹ hơn ở buổi sau.

---

## 📊 Map với Rubric Hackathon (Điểm nào ăn chắc)

| Rubric | Cách ý tưởng này đáp ứng |
|---|---|
| **R1 — Bằng chứng** | Data: 58% bỏ cuộc sớm khi tự học qua slide tĩnh; Giảng viên thiếu data thực tế về chỗ khó của sinh viên. |
| **R2 — AI quyết định** | AI đánh giá trình độ và ngữ cảnh để **quyết định độ khó** và nội dung câu hỏi sinh ra. |
| **R3 — Giải quyết chỗ khó** | Khắc phục vấn đề AI hay "ảo giác": Ép Prompt chỉ được dùng đúng đoạn text bôi đen làm căn cứ sinh câu hỏi. |
| **R5 — Prototype chạy** | Đã hoàn thiện luồng: Load Static PDF → Bôi đen Text → Sinh Quiz bằng Gemini → Tính EXP → Lưu Log cho Heatmap. |

---

## 🚀 Lát cắt 1 câu (Chuẩn Rubric)

> *"V-Pet Tutor là trợ lý học tập kép: Vừa sinh câu hỏi thích ứng (kèm thú cưng ảo) giúp sinh viên vượt qua các đoạn slide khó, vừa vẽ Bản đồ nhiệt (Heatmap) giúp giảng viên tối ưu hóa giáo trình."*