# Tổng Kết Hoàn Thiện CP3 — "AI Thật + Đo Lường"

**Dự án:** VLearn AI Tutor (V-Pet Tutor) — Batch03-K4-AI-Product-Hackathon
**Ngày hoàn thành:** 31/07/2026

---

## 1. Vấn Đề Ban Đầu & Khắc Phục
- **Tình trạng:** Khi chạy tập lệnh đánh giá (`backend/eval/run_eval.py`), tất cả 20/20 test cases đều thất bại do lỗi 429 Quota Exceeded.
- **Nguyên nhân:** File `backend/services/gemini_service.py` bị hard-code gọi model `gemini-2.0-flash` vốn đang bị giới hạn quota bằng 0 trên API key đang sử dụng.
- **Giải pháp:** Sửa đổi `gemini_service.py` để sử dụng cấu hình model linh hoạt từ file `.env` (`GEMINI_MODEL=gemini-3.1-flash-lite`).

## 2. Kết Quả Kiểm Thử Thực Tế (Evaluation)
Ngay sau khi thay đổi sang model `gemini-3.1-flash-lite` và chạy lại bộ kiểm thử, AI đã vượt qua hoàn hảo toàn bộ các test case mà không cần phải chỉnh sửa thêm `SYSTEM_PROMPT`.

**Tổng quan:** Đạt tỷ lệ **100% (20/20 cases passed)**.

**Chi tiết theo từng nhóm (Category Breakdown):**
- ✅ `happy_path`: 5/5
- ✅ `out_of_scope`: 5/5
- ✅ `hallucination`: 3/3
- ✅ `ambiguity`: 4/4
- ✅ `domain_risk`: 3/3

## 3. Các Tài Liệu Bằng Chứng Đã Lưu
Để phục vụ cho yêu cầu chứng minh và làm slide báo cáo (CP4, CP5), các tài nguyên sau đã được tạo và lưu trữ:
1. **`backend/eval/eval_report_v1_baseline.json`**: Bản lưu báo cáo kiểm thử cơ sở ban đầu (làm bằng chứng về sự đo lường trung thực).
2. **`backend/eval/eval_report_final.json`**: Bản báo cáo chi tiết kết quả chạy kiểm thử đạt 20/20.
3. **`backend/eval/console_output.txt`**: Đoạn text kết quả (log console) dùng để chụp ảnh chèn vào slide demo.
4. **`spec.md`**: File đặc tả kỹ thuật (AI Spec) đã được tạo tại thư mục gốc từ bản template, với phần số liệu kiểm thử (Section 7) được điền đầy đủ dựa trên kết quả đạt được.

Tất cả các thay đổi đều đã được commit đầy đủ lên kho lưu trữ (Git). Dự án đã hoàn toàn sẵn sàng cho các công việc tiếp theo tại giai đoạn CP4.
