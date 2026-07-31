# 🧠 Brainstorm: Trải Nghiệm Người Dùng (UX) trên Frontend

Tài liệu này tập trung vào thiết kế luồng tương tác giữa **Sinh viên** và **Thú cưng (Pet)** trên giao diện Frontend để đảm bảo tính tự nhiên, không gây gượng ép và tối đa hóa yếu tố Gamification.

---

## 🎯 Vấn đề của luồng cũ (Bị ép buộc)
- **Hiện trạng:** Sinh viên bôi đen text -> Nhấn nút "Tạo Quiz" -> Hệ thống tự động đẩy ra câu hỏi luôn.
- **Tại sao chưa tốt?** 
  - Thiếu tính "người" (human-touch). AI giống như một cái máy móc sinh đề chứ không phải bạn đồng hành.
  - Có thể sinh viên chỉ lỡ tay bôi đen hoặc muốn hỏi khái niệm khác chứ chưa sẵn sàng làm bài test ngay.

---

## 💡 Ý tưởng mới: "Luồng Bạn Đồng Hành" (Pet Trigger Flow)

Chúng ta cần chèn **Thú cưng (Pet)** vào giữa như một người gợi mở. Luồng UX chuẩn sẽ diễn ra như sau:

### Bước 1: Gợi ý (The Hook)
Sinh viên bôi đen một đoạn text (Ví dụ: *"Vector Database"*). Hệ thống KHÔNG gọi API AI ngay. Thú cưng dừng di chuyển và hiện **speech bubble ngay trên đầu Pet**:
> **Thú cưng 🐣:** "🐾 Meo! Mình thấy bạn vừa bôi đen đoạn: *'Vector Database...'* Chỗ này khá khoai đấy! Bạn có muốn làm 1 câu trắc nghiệm nhanh để nhận **+10 EXP** tiến hóa cho mình không?"
> 
> `[Bắt Đầu 🎯]`  |  `[Thôi, lúc khác]`

### Bước 2: Cam kết (The Commitment)
- Nếu người dùng chọn **[Thôi, lúc khác]**: Pet trả lời "Oki, khi nào sẵn sàng thì gọi mình nhé!" (Hủy action).
- Nếu người dùng chọn **[Bắt Đầu 🎯]**: 
  - Frontend sẽ render hiệu ứng Pet đang suy nghĩ (Loading state).
  - Lúc này Frontend mới chính thức gọi API `POST /quiz/generate` xuống Backend.

### Bước 3: Thử thách & Phần thưởng (Challenge & Reward)
- AI trả về Quiz Card.
- Học sinh chọn đáp án:
  - **Đúng:** Pet vui mừng (Emotion: Excited) + Hiện hiệu ứng pháo hoa + "Ting! +10 EXP". Thanh máu/kinh nghiệm đầy lên.
  - **Sai:** Pet an ủi (Emotion: Hungry/Sad) + "Không sao, cố lên! +2 EXP khích lệ".

---

## 🛠 Cách triển khai trong code

State tương tác được điều phối tại trang học, tách biệt lời thoại Pet khỏi chatbot:

1. `SlideViewer` render PDF bằng text layer để đoạn bôi đen nằm trong DOM của ứng dụng, thay vì nằm trong `iframe`.
2. `SlideViewer` gửi `{ text, slideId, pageNum, selectionId }` lên `Home`.
3. `Home` lưu `pendingSelection`, ghi telemetry và yêu cầu `AnimatedPet` hiện bubble có hai nút **OK, làm task** và **Để sau**.
4. Pet tạm dừng di chuyển trong lúc bubble đang mở. Chỉ khi chọn **OK**, `useTutorChat.startQuizFromSelection()` mới gọi `POST /quiz/generate`.
5. `TutorPanel` chỉ render Quiz Card/task; không hiển thị lời mời hoặc lời động viên của Pet.
6. Sau khi chấm, `pet_status` từ backend được đưa lên `Home`, rồi hiển thị message, emotion và thanh EXP trong bubble trên đầu Pet.
7. Khi nộp đáp án, Quiz Card chuyển sang trạng thái `submitting` để chặn double-click; backend cũng lấy quiz theo cơ chế một lần để không cộng EXP hai lần.

### Contract dữ liệu bắt buộc

```ts
{
  context_text: string;
  slide_id: string;
  page_num: number;
  session_id: string;
}
```

`context_text` phải được lưu trong `pendingSelection`. Không đọc lại bằng `window.getSelection()` lúc bấm **OK**, vì thao tác bấm nút có thể làm mất selection.

### Ranh giới trách nhiệm

- **Pet bubble:** thông báo ngắn, xác nhận, trạng thái đang xử lý, EXP và cảm xúc.
- **TutorPanel:** quiz/task, đáp án và phần giải thích dài.
- Pet không có ô nhập văn bản và không đóng vai trò chatbot thứ hai.

---

Bằng cách này, chúng ta vừa tối ưu chi phí API (chỉ gọi khi user thực sự muốn), vừa tăng sự tương tác cảm xúc giữa người và Thú cưng, làm bật lên đúng tính chất **Gamification** của dự án!
