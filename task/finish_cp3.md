# Kế Hoạch Hoàn Thiện CP3 — "AI Thật + Đo Lường"
**Dự án:** VLearn AI Tutor (V-Pet Tutor) — Batch03-K4-AI-Product-Hackathon
**Người thực hiện:** AI Agent (Coding Agent)
**Repo:** `D:\thuc_hanh_vinAI\Batch03-K4-AI-Product-Hackathon`
**Ngày tạo kế hoạch:** 31/07/2026

---

## 0. Bối Cảnh & Chẩn Đoán Hiện Trạng

**Yêu cầu CP3:** Labcoach gõ ≥20 câu lạ + chạy golden set để kiểm chứng AI hoạt động thật, đo lường được. Ghi nhận trung thực (kể cả fail) được thưởng điểm.

**Đã có:**
- `backend/eval/test_cases.json` — 20 test case, đủ 5 category (`happy_path`, `out_of_scope`, `hallucination`, `ambiguity`, `domain_risk`).
- `backend/eval/run_eval.py` — script eval tự động, xuất `eval_report.json`.
- `backend/services/gemini_service.py` — logic gọi AI với system prompt chống hallucination + reject out-of-scope + adaptive difficulty.

**Vấn đề chặn (root cause):**
- `eval_report.json` hiện tại: **20/20 case FAIL**, tất cả đều lỗi `429 quota exceeded, limit: 0` khi gọi model `gemini-2.0-flash`.
- Đây **không phải** lỗi logic AI hay prompt — đây là lỗi **hạ tầng (API key/quota)**. Nghĩa là: chưa có lần nào eval thực sự chạy được để đo chất lượng AI.
- Chưa xác nhận được file `.env` có tồn tại đúng vị trí root hay không.

**Mục tiêu của Agent:** Đưa CP3 từ "code xong nhưng chưa chạy được" → "chạy được, có số liệu thật, pass ≥80%, có báo cáo trung thực".

---

## 1. Nguyên Tắc Làm Việc Cho Agent

1. **Không sửa `test_cases.json` để "lách" qua lỗi** — golden set phải giữ nguyên độ khó/đa dạng để kết quả có giá trị thật.
2. **Ghi nhận trung thực mọi lần fail** — không xóa log lỗi cũ, giữ lại làm bằng chứng "đã kiểm thử nghiêm túc" (Labcoach đánh giá cao việc này).
3. Sau mỗi thay đổi lớn (sửa prompt, đổi model), **chạy lại toàn bộ 20 case**, không chỉ chạy case đã fail.
4. Commit git sau mỗi bước hoàn thành, message rõ ràng (ví dụ: `fix: resolve gemini api quota issue`, `chore: rerun eval after prompt fix`).
5. Nếu bị chặn > 15 phút ở bất kỳ bước nào → dừng lại, báo cáo lỗi cụ thể cho người phụ trách team thay vì tự ý đổi kiến trúc.

---

## 2. Danh Sách Công Việc (Theo Thứ Tự Ưu Tiên)

### 🔴 Bước 1 — Chẩn đoán & Sửa vấn đề API Key (BLOCKER — làm trước tiên)

- [ ] **1.1.** Kiểm tra file `.env` có tồn tại tại root repo (`D:\thuc_hanh_vinAI\Batch03-K4-AI-Product-Hackathon\.env`) không. Nếu không có, tạo file với nội dung:
  ```
  GEMINI_API_KEY=<key_thật_từ_Google_AI_Studio>
  ```
- [ ] **1.2.** Xác minh key còn hoạt động: chạy `backend/eval/test_api.py` để liệt kê danh sách model khả dụng với key hiện tại.
  ```bash
  cd backend/eval && python test_api.py
  ```
  - Nếu lỗi authentication → key sai/hết hạn → tạo key mới tại https://aistudio.google.com/apikey.
  - Nếu key hợp lệ nhưng danh sách model không có `gemini-2.0-flash` → đây chính là nguyên nhân lỗi `limit: 0`.
- [ ] **1.3.** Nếu quota vẫn = 0 cho `gemini-2.0-flash`, thử đổi sang model khác đang có quota free-tier (kiểm tra qua bước 1.2), ví dụ `gemini-1.5-flash` hoặc `gemini-2.5-flash`. Sửa trong `backend/services/gemini_service.py`:
  ```python
  model = genai.GenerativeModel("gemini-1.5-flash")  # hoặc model khả dụng khác
  ```
- [ ] **1.4.** Kiểm tra billing/free-tier status của Google AI Studio project — nếu tài khoản mới tạo, đôi khi cần đợi vài phút để quota kích hoạt.
- [ ] **1.5. (Fallback nếu vẫn không fix được trong 30 phút):** Báo ngay cho leader team để xin key backup từ thành viên khác hoặc dùng key demo chung của khóa học (nếu có).

**✅ Tiêu chí hoàn thành Bước 1:** Chạy thử 1 request thủ công tới `POST /quiz/generate` qua `http://localhost:8000/docs` và nhận được JSON hợp lệ (không phải lỗi 429/500).

---

### 🟡 Bước 2 — Chạy Eval Thật Lần Đầu

- [ ] **2.1.** Khởi động backend: `cd backend && python main.py`
- [ ] **2.2.** Chạy eval: `python backend/eval/run_eval.py`
- [ ] **2.3.** Đọc kỹ output console + `eval_report.json` mới, ghi lại:
  - Số case pass/fail thực tế (không phải lỗi quota).
  - Với case fail: lỗi thuộc loại nào — sai định dạng JSON, hallucination (bịa thông tin ngoài context), không reject được out-of-scope, reject nhầm case hợp lệ, v.v.
- [ ] **2.4.** Backup báo cáo lần chạy đầu tiên thành `eval_report_v1_baseline.json` (giữ làm bằng chứng "đo lường trung thực" theo tinh thần CP3).

**✅ Tiêu chí hoàn thành Bước 2:** Có 1 bộ `eval_report.json` với `actual_status` thực (`success`/`rejected`), không còn lỗi 429.

---

### 🟢 Bước 3 — Phân Tích & Sửa Prompt (Nếu tỷ lệ pass < 80%)

- [ ] **3.1.** Phân loại lỗi theo category trong `eval_report.json`:
  | Category | Vấn đề thường gặp | Hướng sửa |
  |---|---|---|
  | `hallucination` | AI trả lời đúng nhưng đáp án/giải thích không bám sát context | Thêm câu nhấn mạnh "chỉ dùng thông tin có trong CONTEXT, không suy diễn" vào `SYSTEM_PROMPT` |
  | `out_of_scope` | AI không reject được câu ngoài luồng | Bổ sung thêm ví dụ cụ thể (few-shot) về loại câu cần reject |
  | `ambiguity` | AI cố tạo câu hỏi từ context vô nghĩa | Thêm rule: "Nếu CONTEXT dưới 10 từ hoặc không mang nghĩa hoàn chỉnh → reject" |
  | `domain_risk` | AI reject nhầm case hợp lệ về chủ đề AI/kỹ thuật | Rà lại rule reject, tránh reject quá tay các thuật ngữ chuyên ngành hợp lệ |
- [ ] **3.2.** Sửa từng phần trong `SYSTEM_PROMPT` (file `backend/services/gemini_service.py`), mỗi lần sửa **chỉ 1 nhóm vấn đề**.
- [ ] **3.3.** Chạy lại `run_eval.py` sau mỗi lần sửa, so sánh tỷ lệ pass với lần trước.
- [ ] **3.4.** Lặp lại đến khi tỷ lệ pass ≥ 80% (theo mục tiêu trong `mvp1.md`) — không cần đạt 100%, vì fail có lý do rõ ràng vẫn được Labcoach đánh giá tốt hơn là "toàn pass nhưng không đáng tin".

**✅ Tiêu chí hoàn thành Bước 3:** `eval_report.json` cuối cùng đạt ≥16/20 pass, các case fail còn lại có `error` message rõ ràng, dễ giải thích khi demo.

---

### 🔵 Bước 4 — Chuẩn Bị Bằng Chứng Cho CP3 / Chuyển Tiếp CP4

- [ ] **4.1.** Đặt tên rõ ràng cho file kết quả cuối: `backend/eval/eval_report_final.json`.
- [ ] **4.2.** Ghi lại tóm tắt số liệu (pass rate, breakdown theo category) — sẽ dùng để điền vào `spec.md` mục "R4. Kiểm thử + quality bar" (15 điểm).
- [ ] **4.3.** Chụp/lưu lại output console khi chạy `run_eval.py` thành công — dùng cho slide demo (theo gợi ý ở `mvp1.md` mục 4.3: *"Chụp kết quả chạy run_eval.py ném vào slide"*).
- [ ] **4.4.** Commit toàn bộ thay đổi vào git với message: `feat: complete CP3 - real AI eval passing X/20`.
- [ ] **4.5.** Bàn giao cho bước tiếp theo: tạo `spec.md` ở root repo (hiện chưa có, chỉ có template `03-template-ai-spec.md`) — đây là file quan trọng nhất cho CP4, cần điền số liệu thật từ eval vào §7 (quality bar).

**✅ Tiêu chí hoàn thành Bước 4:** Repo có đầy đủ bằng chứng để Labcoach chấm R4, sẵn sàng chuyển sang CP4 (chốt `spec.md`).

---

## 3. Rủi Ro Cần Lưu Ý Trong Quá Trình Làm

- **Rate limit khi chạy eval nhiều lần:** `run_eval.py` đã có `time.sleep(4)` giữa các case — nếu vẫn bị 429 khi quota đã ổn, cân nhắc tăng sleep hoặc chạy eval theo batch nhỏ (5 case/lần) để tránh burn hết quota free-tier trong lúc debug.
- **Đừng over-fit prompt vào đúng 20 câu hiện có:** Labcoach sẽ tự gõ thêm câu lạ khác ở CP3 — nếu sửa prompt quá cứng theo đúng 20 case, dễ bị lộ khi gặp câu mới. Nên giữ prompt tổng quát theo nguyên tắc, không hard-code từ khóa cụ thể từ `test_cases.json`.
- **Thời gian:** Theo `mvp1.md`, Phase 1 (AI + eval) dự trù 1.5–2 tiếng. Nếu Bước 1 (fix API key) tốn quá 30-45 phút, nên báo ngay cho team để không lệch tiến độ sang Phase 2 (Frontend).

---

## 4. Checklist Tổng Hợp (Dùng Để Track Nhanh)

```
[ ] .env có GEMINI_API_KEY hợp lệ
[ ] test_api.py chạy ra danh sách model, không lỗi auth
[ ] POST /quiz/generate trả JSON hợp lệ qua Swagger UI
[ ] run_eval.py chạy hết 20 case, không còn lỗi 429
[ ] eval_report_v1_baseline.json đã lưu (bằng chứng lần đầu)
[ ] Tỷ lệ pass ≥ 80% sau khi sửa SYSTEM_PROMPT
[ ] eval_report_final.json đã lưu + tóm tắt số liệu
[ ] Console output đã chụp lại cho slide demo
[ ] Đã commit git đầy đủ
[ ] Sẵn sàng bắt đầu CP4 (spec.md)
```