# Tổng hợp Toàn bộ Ngữ cảnh – VLearn AI Tutor Hackathon

> Tài liệu này tổng hợp toàn bộ thông tin từ 3 nguồn:
> - `Venture_Arena_Hackathon_Info.md` – Thông tin chung về Hackathon
> - `Roadmap_VLearn_AI_Tutor.md` – Roadmap chi tiết của team
> - `context.md` – Bối cảnh & Canvas 7 dòng

---

# PHẦN I – THÔNG TIN CHUNG VỀ HACKATHON (Venture Arena)

## 1.1 Tổng Quan

- **Chủ đề:** Build. Pitch. Invest.
- **Thời gian:** 1,5 ngày (30/07 – 31/07).
- **Quy mô:** Team từ 3 – 5 người.
- **Tính chất:** Đây là một chu kỳ làm sản phẩm nén lại trong 1,5 ngày, không phải bài tập nộp báo cáo hay cuộc thi lập trình đơn thuần. Điểm nhấn là lao vào code từ phút đầu thường mất nhiều nhất.
- **Trình tự 4 bước (Việc 1 & 2 chiếm trọng số 30 điểm):**
  1. **Tìm:** Đọc data, hỏi người thật, tìm vấn đề có bằng chứng (Sáng Day 5).
  2. **Thu hẹp:** Chọn ĐÚNG MỘT việc nhỏ nhất để chứng minh ý tưởng (Trước trưa Day 5).
  3. **Dựng:** Build prototype có AI chạy thật, đo lường (Chiều Day 5).
  4. **Chứng minh:** Cho người thật dùng thử và thuyết phục trong 5 phút (Day 6).

## 1.2 Track & Chủ đề (Đề bài)

- **Track duy nhất:** AI cho khóa AI Thực Chiến (Team chính là product team của khóa học). Tấn công đúng "pain point" của người học.
- **3 Hướng lựa chọn (Chiến tuyến):**
  - **VLEARN (AI Tutor):** Nền tảng học tập của khóa. Cải thiện một khoảnh khắc học tập cụ thể (tối ưu AI tutor, kiểm tra hiểu bài, bản đồ lỗ hổng...). Đừng xây chatbot chung chung.
  - **TRỢ LÝ HỌC VIÊN (Discord Assistant):** Bot trả lời trong Discord. Tìm tín hiệu trôi trong cộng đồng.
  - **HƯỚNG MỞ:** Khai phá một cơ hội/vấn đề chưa ai gọi tên.

## 1.3 The Evidence Gate (5 Cửa ải Bằng Chứng)

Ý tưởng chỉ đi tiếp khi có bằng chứng. Không đầu tư vào cảm giác:

1. **Pain cụ thể:** Ai đang làm gì, vướng đâu, hậu quả?
2. **Bằng chứng:** Khảo sát ≥ 20 người (và ≥ 50% xác nhận) HOẶC mining data có đếm được (≥ 5 ví dụ & cách kiểm lại).
3. **Problem & Impact:** Bài toán không dùng chữ AI; so sánh tác động trước/sau.
4. **Lát cắt đủ sắc:** 1 người dùng – 1 công việc – 1 quyết định AI – 1 kết quả.
5. **Sẵn sàng thử:** Ít nhất 3 người ngoài team đồng ý thử prototype.

### Tiêu chuẩn Bằng Chứng (Chi tiết):

- **Đường A – Hỏi người thật:** Khảo sát ≥ 20 người, ≥ 50% xác nhận. Không hỏi câu "Bạn có cần tính năng X không?", hãy hỏi về hành vi đã xảy ra: "Lần gần nhất bạn muốn xem lại bài giảng, bạn đã làm gì?".
- **Đường B – Đếm trên data:** Số đếm được ≥ 5 ví dụ nguyên văn, phương pháp đếm rõ ràng.

### Lát Cắt (Định nghĩa):

- **Công thức:** Một câu bao gồm `Một người dùng` + `Một công việc` + `Một quyết định AI` + `Một kết quả`.
- *Ví dụ ĐẠT:* Học viên đang đọc tài liệu, bôi đen hỏi đoạn đó có căn cứ không → AI trả lời kèm số trang hoặc báo không đề cập.

## 1.4 Luật Gọi Vốn (Pitching & Đầu tư)

- **Hai vai:** Team vừa là Startup (pitch), vừa là Investor (đầu tư). Không được đầu tư cho chính team mình.
- **Pitching:** Khoảng 5 phút pitch + 5 phút Q&A.
- **Quỹ đầu tư:** Mỗi team/cá nhân có tối đa 100 điểm. Được all-in hoặc phân bổ nhưng phải có lý do.
- **Chiến thắng:** Top 3 Startup có tổng điểm đầu tư cao nhất. 3 Investor đồng hành cùng Top cũng nhận thưởng.

## 1.5 Deliverables (Sản phẩm giao nộp – Repo)

Một repo public với các thành phần:

1. `README.md`: Thành viên, mã học viên, phân công.
2. `spec.md`: Bài toán, bằng chứng, lát cắt, quality bar (**File quan trọng nhất**).
3. `demo-slides.pdf`: Câu chuyện và phần demo (6 trang).
4. `codebase/`: Prototype (ghi rõ mock phần nào).
5. `eval/` (Nặng 15đ): Golden set và kết quả lướt chạy.
6. `validation/` (Nặng 8đ): Feedback log từ vòng user test.
7. `reflection/`: File cá nhân của từng thành viên.

> ⚠️ **Thiếu `eval/` và `validation/` = mất 23 điểm — không được bỏ sót.**

## 1.6 Checkpoints (6 Mốc) – Lịch Trình

Nộp muộn ≤ 60 phút tính 60% điểm, muộn hơn không tính.

| Checkpoint | Nội dung | Khóa 3 | Khóa 4 |
|---|---|---|---|
| **CP1** | Chốt Canvas 7 dòng | 10:15 Day 1 | 15:00 Day 1 |
| **CP2** | Bấm được (flow từ đầu đến cuối, chưa cần AI thật) | 12:00 Day 1 | 17:00 Day 1 |
| **CP3** | AI thật + Đo (Labcoach test ≥20 câu + golden set) | 16:00 Day 1 | 10:30 Day 2 |
| **CP4** | Chốt tiến độ – Commit `spec.md` (quality bar bằng con số) | 17:30 Day 1 | 12:00 Day 2 |
| **CP5** | Xác minh & Validation (≥5 người thử, phản hồi có khen/chê) | 09:00 Day 2 | 14:00 Day 2 |
| **CP6** | Demo – Pitch 5 phút + Q&A | 10:00 Day 2 | 15:00 Day 2 |

## 1.7 Tiêu chí Chấm điểm (Rubric)

### A. Điểm bài Lab (100 điểm) – Labcoach chấm qua repo:

- **Nộp đủ (25 điểm):** 5 mốc CP (mỗi CP 5đ nếu đúng hạn).
- **Chấm nội dung (75 điểm):**

| Mục | Nội dung | Điểm |
|---|---|---|
| R1 | Bằng chứng & impact (`spec.md §1-§2`) | 15đ |
| R2 | Lát cắt & thiết kế (`spec.md §4`) | 15đ |
| R4 | Kiểm thử + quality bar (`eval/` + `spec.md §7`) | 15đ |
| R3 | Chỗ khó & rủi ro (`spec.md §5-§6`) | 11đ |
| R5 | Prototype chạy được (`codebase/`) | 8đ |
| R6 | Validation với user (`validation/`) | 8đ |
| R7 | Quy trình & repo (cấu trúc) | 3đ |

### B. Điểm Demo (Chấm chéo + Giải thưởng):

| Giải | Điểm thưởng cộng vào lab |
|---|---|
| Giải Nhất | +10đ |
| Giải Nhì | +7đ |
| Giải Ba | +5đ |
| Vào top pitching ngoài top 3 | +3đ |

## 1.8 Quy Định Về Data

1. Chỉ dùng data pack hackathon hoặc data giả tự sinh.
2. Discord chỉ dùng để quan sát/khảo sát ẩn danh.
3. Không phát tán data, không up mxh, không commit vào repo.
4. Không suy ngược danh tính, không public API key.
5. Dùng công cụ ngoài (AI) hạn chế đưa thông tin dư thừa.
6. Xóa data sau sự kiện.

---

# PHẦN II – BỐI CẢNH DỰ ÁN & CANVAS 7 DÒNG

## 2.1 Thông tin chung

- **Sự kiện:** Venture Arena – Hackathon (Day 5 – Day 6)
- **Mốc hiện tại:** CP1 – Chốt Canvas 7 dòng

## 2.2 Thành viên Nhóm & Phân công

| Thành viên | Mã Học Viên | Phân công Vai trò |
|---|---|---|
| **Hoàng Văn Quang** | 2A202601334 | Lead & Spec (`spec.md`) |
| **Nguyễn Thị Việt Vinh** | 2A202601836 | Evidence & Validation (`validation/`) |
| **Hoàng Thị Trà My** | 2A202601290 | Prompt Engineering & Golden Set (`eval/`) |
| **Tạ Hồng Quí** | 2A202601538 | Technical Build (`codebase/`) |

## 2.3 Canvas 7 Dòng (CP1 Deliverable)

1. **Chiến tuyến:** VLearn AI Tutor (Nền tảng học tập).
2. **Người dùng mục tiêu:** Học viên đang trực tiếp đọc tài liệu/slide bài giảng trong buổi học.
3. **Pain Point (1 câu):** Học viên đang đọc tài liệu trong buổi học, khi hỏi AI Tutor thì nhận câu trả lời không kèm căn cứ/số trang cụ thể, khiến phải mất 3–5 phút tự lật lại tài liệu đối chiếu, gây mất mạch đọc và rủi ro tiếp thu sai kiến thức nếu AI hallucinate.
4. **Bằng chứng đầu tiên:** **582 / 1.261** lượt tutor trả lời trong chatlog (~46.15%) không kèm số trang / trích dẫn căn cứ cụ thể.
5. **Lát cắt MỘT CÂU:**
   > *Học viên đang đọc slide bài giảng (1 người dùng), muốn giải thích khái niệm khó trong slide đang xem (1 việc), AI Tutor tự động tra cứu tài liệu để đưa ra câu trả lời kèm số trang trích dẫn chính xác hoặc từ chối trả lời/hỏi lại nếu không tìm thấy căn cứ (1 quyết định AI), giúp học viên hiểu bài ngay mà không mất mạch đọc (1 kết quả).*
6. **Mức Automation:**
   - **Conditional Automation:** AI tự động trả lời khi tìm được căn cứ xác thực trong slide; nếu mơ hồ/không tìm thấy căn cứ → AI chủ động từ chối/hỏi lại hoặc chuyển hỗ trợ cho TA.
   - *Lý do:* Chi phí trả lời sai (cost-of-error) rất đắt vì làm học viên hiểu sai kiến thức nền tảng.
7. **Willing Users (≥ 3 người thử ngoài nhóm):** Minh, Hà, Trang.

## 2.4 Giải Pháp Sản Phẩm – Các Chức Năng Chính

### Chức năng học tập (AI Tutor)
1. **Giải thích slide hiện tại:** Giải thích chính xác nội dung/số trang slide đang xem.
2. **Tóm tắt slide:** Rút gọn ý chính của slide hiện tại.
3. **Tổng kết nội dung slide:** Tổng hợp các slide đã học trong buổi/phần học.
4. **Tạo câu hỏi ôn tập thích ứng (Adaptive Quiz):** Thay vì sinh câu hỏi ngẫu nhiên, **AI sẽ là người quyết định độ khó của câu hỏi tiếp theo**. AI tự động phân tích độ chính xác từ câu trả lời trước của học viên để điều chỉnh mức độ khó tăng dần (Dễ → Trung bình → Khó), đảm bảo học viên thực sự nắm vững kiến thức.

### Tính năng Phân tích dữ liệu học tập (Data Analytics)
5. **Thống kê điểm mù kiến thức (Crowdsourced Highlight Tracking):** Hệ thống sẽ track (theo dõi) và thống kê những đoạn text/thuật ngữ trong slide được nhiều học viên bôi đen để yêu cầu AI giải thích nhất. Từ đó, tạo ra báo cáo giúp Giảng viên (Instructors) nhận diện ngay những khái niệm đang gây khó hiểu cho số đông để chủ động cải thiện tài liệu hoặc giải thích kỹ hơn.

> **Nguyên tắc chung:** Tất cả các chức năng học tập (AI) đều bắt buộc đính kèm căn cứ (trích dẫn / số trang slide) vào câu trả lời để tránh Hallucination.

### Chức năng Gamification & Frontend UI (Tăng tương tác)
6. **Thú Cưng Ảo (V-Pet):** Một người bạn đồng hành hiển thị góc màn hình, thay đổi biểu cảm (đói 😿 / vui 😻 / tiến hoá ✨) và cấp độ (🥚 → 🐣 → 🐔) dựa trên EXP mà học viên tích lũy được từ chất lượng tương tác học tập.
7. **Streak & Phần thưởng học liên tục:** Hệ thống ghi nhận chuỗi ngày học liên tiếp, thưởng EXP bonus cho Thú Cưng khi học viên duy trì thói quen học đều đặn — tạo động lực quay lại app mỗi ngày.
8. **Bảng điểm cá nhân (EXP Dashboard):** Học viên theo dõi được tổng EXP, cấp độ Thú Cưng hiện tại và lịch sử tương tác, giúp họ nhận ra bản thân đang học chủ động hay thụ động qua từng buổi.

## 2.5 Vấn đề cốt lõi

**582/1.261** lượt tutor trả lời (~46%) không kèm số trang/căn cứ → học viên phải tự mở lại tài liệu (mất 3–5 phút, mất mạch đọc), có rủi ro học sai kiến thức nếu AI trả lời sai mà không kiểm chứng được.

---

# PHẦN III – ROADMAP CHI TIẾT THEO CHECKPOINT

## 3.1 Phân công Vai trò (5 vai / 4 người)

| Vai trò | Việc chính | Người phụ trách |
|---|---|---|
| Bằng chứng | Khảo sát/đếm data chứng minh pain point có thật | Quang |
| Prompt | Thiết kế prompt cho 4 tính năng, đảm bảo bám căn cứ | My |
| Build | Dựng prototype (UI + gọi AI thật) | Vinh |
| Spec | Viết `spec.md`, định nghĩa lát cắt, quality bar | Quí |
| Validation | Tổ chức cho ≥3–5 người ngoài team thử, ghi nhận phản hồi | Cả team (Quang + Quí chốt) |

## 3.2 Timeline theo Checkpoint

### CP1 – Chốt Canvas | Hạn: 10:15 Day 1 (Day 5)

- [x] Hoàn thiện Canvas 7 dòng.
- [ ] Nộp form đăng ký team + đề tài.
- [ ] **Lát cắt 1 câu:**
  > *Học viên đang đọc slide, hỏi AI Tutor giải thích/tóm tắt/tổng kết/ôn tập đoạn đó → AI trả lời kèm số trang/slide căn cứ, hoặc báo không tìm thấy căn cứ để hỏi lại.*

### Trước trưa Day 5 – Thu hẹp

- [ ] Chốt ĐÚNG 1 tính năng để build trước tiên (khuyến nghị: **"Giải thích slide hiện tại"**).
- [ ] Xác định rõ input/output: input = nội dung slide hiện tại (+ câu hỏi học viên nếu có), output = câu trả lời có trích dẫn số trang/slide.

### CP2 – Bấm được | Hạn: 12:00 Day 1 (Day 5)

- [ ] Dựng được flow bấm từ đầu đến cuối (chưa cần AI thật/đẹp, data giả OK):
  - Học viên mở slide → bấm nút (Giải thích / Tóm tắt / Tổng kết / Ôn tập) → hiện câu trả lời mẫu (mock).
- [ ] UI tối thiểu: hiển thị nội dung slide + 4 nút chức năng + khung trả lời.

### Chiều Day 5 – Build prototype AI thật

- [ ] Build: Vinh (chủ lực), My hỗ trợ prompt.
- [ ] Kết nối AI thật (ví dụ Claude API) với retrieval từ nội dung slide/tài liệu.
- [ ] Bắt buộc mỗi câu trả lời AI phải:
  - Trích được số trang/số slide căn cứ, HOẶC
  - Báo rõ "không tìm thấy căn cứ trong tài liệu" thay vì bịa.
- [ ] Đo lường sơ bộ: tỉ lệ câu trả lời có kèm căn cứ (so với baseline 54% hiện tại).

### CP3 – AI thật + Đo | Hạn: 16:00 Day 1 (Day 5)

- [ ] Prototype chạy được với AI thật (không còn mock).
- [ ] Chuẩn bị sẵn để Labcoach test ≥ 20 câu hỏi lạ + golden set.
- [ ] Golden set: chuẩn bị trước ~10–15 câu hỏi mẫu kèm đáp án đúng để đối chiếu.
- [ ] Ghi nhận trung thực % đúng/sai — báo cáo thật được cộng điểm.

### CP4 – Chốt tiến độ | Hạn: 17:30 Day 1 (Day 5)

- [ ] Commit `spec.md` hoàn chỉnh (Quí phụ trách), gồm:
  - §1-2: Bài toán + bằng chứng + impact (đo trước/sau, không dùng chữ "AI" trong problem statement)
  - §4: Lát cắt cụ thể (1 người dùng – 1 công việc – 1 quyết định AI – 1 kết quả)
  - §5-6: Chỗ khó & rủi ro (VD: AI trích sai số trang, tài liệu dài quá context, v.v.)
  - §7: Quality bar bằng con số cụ thể (VD: "≥90% câu trả lời phải kèm căn cứ đúng hoặc báo không tìm thấy")

### Đêm Day 5 / Sáng Day 6 – Chuẩn bị Validation

- [ ] Chuẩn bị `eval/` (golden set + kết quả chạy) — **nặng 15 điểm, đừng bỏ sót**.
- [ ] Liên hệ trước ≥ 5 người thử thật.

### CP5 – Xác minh & Validation | Hạn: 09:00 Day 2 (Day 6)

- [ ] Cho ≥ 5 người ngoài team thử thật cả 4 tính năng.
- [ ] Ghi nhận phản hồi cụ thể — **phải có cả khen và chê** (toàn khen = mất điểm R6).
- [ ] Lưu vào `validation/`: feedback log chi tiết (ai thử, thử gì, phản hồi gì).

### CP6 – Demo | Hạn: 10:00 Day 2 (Day 6)

- [ ] Chuẩn bị `demo-slides.pdf` (6 trang): pain point → giải pháp → demo → kết quả đo được.
- [ ] Luyện pitch 5 phút + chuẩn bị trả lời Q&A 5 phút.
- [ ] Demo trực tiếp: chạy thử cả 4 tính năng trên 1 slide thật.

## 3.3 Checklist Deliverables (Repo public)

- [ ] `README.md` – thành viên, MSSV, phân công vai trò
- [ ] `spec.md` – bài toán, bằng chứng, lát cắt, quality bar (**quan trọng nhất**)
- [ ] `demo-slides.pdf` – 6 trang
- [ ] `codebase/` – prototype (ghi rõ phần nào là mock)
- [ ] `eval/` – golden set + kết quả chạy (15đ)
- [ ] `validation/` – feedback log từ user test thật (8đ)
- [ ] `reflection/` – file cá nhân từng thành viên

---

# 3 ĐIỀU CỐT LÕI CẦN NHỚ

1. **Lát cắt là MỘT CÂU** — viết chung chung sẽ mất điểm R2.
2. **Đếm được mới là bằng chứng** — bộ test quá dễ mất điểm R4.
3. **Số liệu trung thực được thưởng** — phản hồi người thử toàn khen sẽ bị đánh giá là phiên thử chưa đạt, mất R6.

> *Đừng pitch để được vỗ tay. Hãy pitch để được đặt cược.*
