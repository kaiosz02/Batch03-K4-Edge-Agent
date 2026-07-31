# Hướng Dẫn Cài Đặt và Chạy Dự Án VLearn AI Tutor

Tài liệu này cung cấp hướng dẫn chi tiết từng bước để cài đặt và khởi chạy dự án **VLearn AI Tutor** trong môi trường phát triển cục bộ (local).

Dự án sử dụng kiến trúc tách biệt hoàn toàn giữa Frontend và Backend.

---

## 1. Yêu cầu hệ thống (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã được cài đặt các phần mềm sau:
- **Node.js**: Phiên bản `v18.17.0` trở lên (Đề xuất bản LTS mới nhất). Kiểm tra bằng lệnh: `node -v`
- **npm** (đi kèm với Node.js). Kiểm tra bằng lệnh: `npm -v`
- **Python**: Phiên bản `3.10` trở lên (Dành cho Backend FastAPI sắp tới).

---

## 2. Hướng dẫn chạy Frontend (Next.js)

Giao diện người dùng được xây dựng bằng **Next.js 16 (App Router)** và **TailwindCSS v4**.

### Bước 2.1: Cài đặt thư viện (Dependencies)
Mở terminal, di chuyển vào thư mục `frontend` và tiến hành cài đặt các gói cần thiết:

```bash
cd frontend
npm install
```

### Bước 2.2: Khởi chạy môi trường Phát triển (Development)
Sau khi cài đặt xong, bạn có thể khởi chạy server ở chế độ Development (Hỗ trợ Hot-Reload):

```bash
npm run dev
```
> **Kết quả mong đợi:** Server sẽ chạy tại địa chỉ `http://localhost:3000`. Mở trình duyệt và truy cập vào đường dẫn này để xem giao diện VLearn AI Tutor.

### Bước 2.3: Đóng gói và chạy môi trường Sản xuất (Production)
Nếu bạn muốn kiểm tra hiệu năng thực tế của ứng dụng, hãy build dự án trước khi chạy:

```bash
npm run build
npm run start
```
> **Lưu ý:** Chế độ này sẽ chạy bộ mã nguồn đã được tối ưu hóa, nhanh hơn và mượt mà hơn.

---

## 3. Hướng dẫn chạy Backend (FastAPI)

Backend đã được tích hợp và chạy tại cổng `8000`.

```bash
# Chạy từ thư mục gốc của dự án
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd backend
uvicorn main:app --reload
```

Backend chạy tại `http://localhost:8000`; Swagger tại `http://localhost:8000/docs`.

AI dùng mock fallback nếu chưa có key. Muốn gọi AI thật, tạo `.env` ở thư mục gốc:

```dotenv
DEEP_SEEK_API_KEY=your_key
DEEP_SEEK_MODEL=deepseek-chat
```

---

## 4. Cấu trúc và Dữ liệu dự án

Để dự án hoạt động chính xác (đặc biệt là tính năng xem Slide PDF trên Frontend), hệ thống yêu cầu cấu trúc thư mục giả lập (mock data) phải giữ nguyên như sau:

```text
📦 Batch03-K4-AI-Product-Hackathon
 ┣ 📂 data                     # Thư mục chứa dữ liệu tĩnh
 ┃ ┗ 📂 vlearn-pack
 ┃   ┗ 📂 slides
 ┃     ┗ 📜 d1-slide-hackathon.pdf  # File Slide PDF bắt buộc phải có
 ┣ 📂 frontend                 # Mã nguồn UI (Next.js)
 ┣ 📂 backend                  # Mã nguồn AI API (FastAPI)
 ┗ 📜 how_to_run.md            # File hướng dẫn này
```

**Lưu ý quan trọng về PDF:** Backend tự nạp các file trong `data/vlearn-pack/slides/`, phục vụ qua `/static/slides` và trả metadata qua `/slide/list`. Frontend dùng PDF text layer để người học có thể bôi đen nội dung. Hãy khởi động backend trước frontend.

---
*Chúc bạn có những trải nghiệm tuyệt vời với VLearn AI Tutor tại VinAI Hackathon! 🚀*
