# Reflection cá nhân — Hoàng Văn Quang

**MSSV:** 2A202601334
**Vai trò:** Frontend Developer & 2D Animator

## 1. Phần công việc tôi đã thực hiện

Tôi phụ trách xây dựng toàn bộ giao diện (Frontend) cho sản phẩm V-Pet Tutor. Các công việc cụ thể bao gồm:
- Phát triển giao diện chính: Trình chiếu slide bài giảng, tính năng bôi đen văn bản để gọi API sinh Adaptive Quiz.
- Thiết kế và lập trình chuyển động 2D (2D animation) cho V-Pet: Tạo các trạng thái cảm xúc sinh động cho Pet để phản hồi lại tương tác của người dùng (ví dụ: vui mừng/vỗ tay khi trả lời đúng, khích lệ khi trả lời sai, tăng level/EXP).
- Tích hợp API Backend: Gắn kết UI với các endpoint mà backend cung cấp (tải slide, gửi quiz, nhận kết quả đúng/sai, cập nhật thanh EXP và Heatmap), đảm bảo luồng trải nghiệm gamification diễn ra mượt mà và không có độ trễ lớn.

## 2. AI đã hỗ trợ tôi như thế nào?

Tôi đã sử dụng AI coding assistant (Cursor, ChatGPT) để:
- Tạo nhanh các bộ khung (boilerplate) cho UI component và CSS/Tailwind classes, giúp tiết kiệm thời gian căn chỉnh bố cục.
- Hỗ trợ viết logic cho các hiệu ứng chuyển động 2D (CSS animations / sprite logic), giúp pet có các chuyển tiếp trạng thái tự nhiên hơn.
- Debug và tối ưu hóa: AI giúp tôi rà soát các lỗi liên quan đến quản lý trạng thái (state management) trên Frontend, đặc biệt là các vấn đề bất đồng bộ (asynchronous) khi người dùng thao tác nhanh trong lúc chờ API phản hồi.

## 3. Bài học từ case thất bại

Ở phiên bản đầu tiên của giao diện, tôi đã xử lý animation "ăn mừng" (cộng EXP) chạy ngay lập tức khi người dùng bấm nút nộp bài, trước khi có kết quả chính thức từ backend trả về. Điều này dẫn đến lỗi hiển thị sai lệch khi người dùng thực chất đã trả lời sai hoặc request bị lỗi, nhưng Pet vẫn ăn mừng. 
Qua case này, tôi rút ra bài học sâu sắc về việc quản lý trạng thái: Frontend tuyệt đối không được "cầm đèn chạy trước ô tô". Mọi thay đổi về trạng thái, điểm số hay hiệu ứng của Pet đều phải tuân thủ nghiêm ngặt và lấy **backend làm nguồn sự thật duy nhất (Single Source of Truth)**.
