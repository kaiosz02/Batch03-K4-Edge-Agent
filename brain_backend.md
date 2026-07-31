Ran command: `git pull`
Viewed 03-template-ai-spec.md:16-36

Để mình brainstorm ra một bức tranh hoàn chỉnh và rõ ràng nhất cho ý tưởng kết hợp cả 2 của anh:

---

## 🧠 Brainstorm: V-Pet Tutor — Bức tranh tổng thể

---

### 🎯 Vấn đề cốt lõi cần giải
```
Học viên đọc slide trên VLearn
→ Gặp đoạn khó → Bôi đen → Hỏi AI → Nhận đáp án → QUÊN NGAY
→ Không biết mình có thực sự hiểu không
→ Không có lý do gì để quay lại ôn tập
```

---

### 💡 Giải pháp: 2 tầng hoạt động

```
TẦNG 1: PHÁT HIỆN                    TẦNG 2: LUYỆN TẬP
─────────────────                     ─────────────────
Track bôi đen                    →    Adaptive Quiz
(AI tìm vùng mọi người           →    (AI sinh câu hỏi
 thắc mắc nhiều nhất)            →     thích ứng với trình độ)
         ↓                                    ↓
   "Đây là chỗ khó"              →      "Chiến không?"
         ↓                                    ↓
                        Pet nhận EXP 🐾
```

---

### 📍 TẦNG 1: Confusion Hotspot — Track bôi đen

**Dữ liệu thu được (ẩn bên dưới):**
```
Slide 4 — Day 2:
├── Ý 1: "RAG là gì"           → 100 người bôi đen 🔥🔥🔥
├── Ý 2: "Vector Database"     →  50 người bôi đen 🔥🔥
├── Ý 3: "Embedding"           →  10 người bôi đen 🔥
└── Ý 4: "Retriever"           →   3 người bôi đen
```

**AI làm gì ở đây?**
- Không chỉ đếm số lượt → AI đọc **các câu hỏi thực tế** tại vùng đó
- AI tổng hợp và chẩn đoán: *"Lớp đang bị nhầm RAG với Fine-tuning"*
- AI sinh ra **câu hỏi đúng trọng tâm** nhầm lẫn đó

**Hiển thị trên UI:**
```
[Slide 4 - Ý 1]  🔥 VÙNG NÓNG — 100 người cùng thắc mắc chỗ này!
                 ┌─────────────────────────────────────┐
                 │  Thú cưng đang đói! 🐣              │
                 │  Chiến 1 câu hỏi để lấy EXP không? │
                 │           [BẮT ĐẦU] 🎯             │
                 └─────────────────────────────────────┘
```

---

### 📚 TẦNG 2: Adaptive Quiz — Ngân hàng câu hỏi thích ứng

**Cơ chế hoạt động (IRT - Item Response Theory đơn giản hoá):**

```
                    Học viên bắt đầu
                          │
                    [Câu hỏi Dễ]
                    "RAG là viết tắt của gì?"
                     /              \
                 Đúng ✅           Sai ❌
                  +5 EXP            +2 EXP
                   │                 │
            [Câu hỏi Vừa]    [Câu hỏi Dễ hơn]
            "RAG khác         "Trong RAG, R là..."
             Fine-tune         (có gợi ý hint)
             thế nào?"
              /      \
          Đúng ✅   Sai ❌
          +10 EXP   +3 EXP
              │
      [Câu hỏi Khó - Vận dụng]
      "Nếu Vector DB bị lỗi
       thì RAG pipeline bị
       ảnh hưởng gì?"
          +15 EXP 🔥
```

**AI làm gì ở đây (Quyết định AI trung tâm)?**
- Nhận input: `{context: đoạn slide, level: 1-3, lịch_sử: [đúng/sai]}`
- Output chuỗi JSON:
```json
{
  "do_kho": 2,
  "cau_hoi": "RAG khác Fine-tuning thế nào?",
  "dap_an": ["A. RAG dùng data ngoài", "B. Fine-tune thay model", "C. Cả hai đều sai", "D. A và B đúng"],
  "dap_an_dung": "D",
  "giai_thich": "RAG lấy thêm context từ bên ngoài còn Fine-tune...",
  "exp_thuong": 10
}
```

---

### 🐾 Thú Cưng nhận EXP như thế nào?

```
Nguồn EXP                          Số EXP
──────────────────────────────────────────
Trả lời đúng câu Dễ                +5 EXP
Trả lời đúng câu Vừa              +10 EXP  
Trả lời đúng câu Khó              +15 EXP
Trả lời sai (vẫn thưởng khích lệ)  +2 EXP
Streak 3 ngày liên tiếp           +20 EXP 🎁
──────────────────────────────────────────
Level 1 (Trứng 🥚):   0   → 50  EXP
Level 2 (Gà con 🐣):  51  → 150 EXP
Level 3 (Gà 🐔):      151 → 300 EXP
```

---

### 📊 Map với Rubric Hackathon (Điểm nào ăn chắc)

| Rubric | Cách ý tưởng này đáp ứng |
|---|---|
| **R1 — Bằng chứng** | Data chatlog: 28.4% hỏi thụ động; 58% bỏ cuộc sớm; Khảo sát 40 người: 3.5/5 muốn streak |
| **R2 — Lát cắt + AI quyết định** | AI sinh câu hỏi thích ứng dựa trên lịch sử đúng/sai — đây là quyết định AI thật |
| **R3 — 4 lớp chỗ khó** | ① AI sinh câu hỏi sai kiến thức; ② Học viên trả lời mơ hồ; ③ Học viên hack điểm; ④ AI hỏi quá khó → nản |
| **R5 — Prototype chạy** | Gọi Gemini API → trả JSON → render Quiz Card + cập nhật Pet |

---

### 🚀 Lát cắt 1 câu (Chuẩn Rubric)

> *"Khi học viên mở đoạn slide có nhiều người cùng thắc mắc (Confusion Hotspot), AI tự động sinh câu hỏi trắc nghiệm thích ứng theo trình độ; học viên trả lời sẽ nhận EXP để nâng cấp Thú Cưng đồng hành."*

---

Bức tranh này đã đủ rõ để anh bắt tay vào làm Prototype và điền spec chưa? Mình có thể giúp viết System Prompt cho Gemini hoặc phác thảo file `spec.md` luôn nếu anh cần!