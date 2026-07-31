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
Sinh viên bôi đen một đoạn text (Ví dụ: *"Vector Database"*). Hệ thống KHÔNG gọi API Gemini ngay, mà Thú cưng sẽ "nhảy" ra chat:
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

## 🛠 Cách triển khai vào Code hiện tại (`useTutorChat.ts`)

Để đưa ý tưởng này vào thực tế, chúng ta sẽ áp dụng pattern **Message States** trong Chat:

1. Thêm một loại tin nhắn đặc biệt (Type: `confirm_quiz`) vào state của tin nhắn.
2. Khi gọi hàm `triggerQuizFromSelection()`, thay vì fetch API ngay, ta đẩy một tin nhắn `confirm_quiz` chứa nội dung text bôi đen vào khung chat.
3. Component render tin nhắn sẽ hiển thị 2 nút bấm.
4. Khi user click "Bắt đầu", nó sẽ trigger một hàm mới `executeQuizGeneration(text)` để thực sự gọi API.

---

Bằng cách này, chúng ta vừa tối ưu chi phí API (chỉ gọi khi user thực sự muốn), vừa tăng sự tương tác cảm xúc giữa người và Thú cưng, làm bật lên đúng tính chất **Gamification** của dự án!
