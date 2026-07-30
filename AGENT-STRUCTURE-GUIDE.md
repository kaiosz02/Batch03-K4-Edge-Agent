> **Mục đích:** File này hướng dẫn AI coding agent (Claude Code / Cursor...) dựng và duy trì cấu trúc thư mục chuẩn cho dự án **VLearn AI Tutor** — Frontend **Next.js (App Router)** + Backend **FastAPI**. Đọc file này trước khi tạo file/thư mục mới. Bám sát cấu trúc để mọi thành viên (và AI) tìm đúng chỗ, không tạo trùng lặp.

## 0. Bối cảnh sản phẩm (đọc trước khi code)

- **Lát cắt:** Học viên đang đọc slide bài giảng, hỏi AI Tutor giải thích/tóm tắt/tổng kết/ôn tập đoạn đang xem → AI trả lời **kèm số trang/slide trích dẫn** hoặc **từ chối/hỏi lại** nếu không tìm thấy căn cứ.
- **4 tính năng học tập (bắt buộc trích dẫn căn cứ):** Giải thích slide hiện tại · Tóm tắt slide · Tổng kết nội dung đã học · Tạo câu hỏi ôn tập.
- **Gamification (phụ, không được làm loãng lõi AI):** V-Pet (thú cưng ảo theo EXP) · Streak học liên tục · EXP Dashboard.
- **Nguồn dữ liệu:** `data/vlearn-pack/` (chatlog ẩn danh + transcript bài giảng có mã đoạn + slide bản hackathon) — dùng để build retrieval/citation và golden set, **không commit nguyên văn vào repo**.
- **Ràng buộc kỹ thuật quan trọng nhất:** mọi câu trả lời AI phải **trace được về số trang/slide nguồn**, hoặc trả lời "không tìm thấy căn cứ" — đây là quyết định AI trung tâm cần log/trace được (rubric R5).

---

## 1. Cấu trúc repo tổng (root)

```
Batch03-K4-AI-Product-Hackathon/
├── README.md
├── spec.md                     ← AI Spec (rubric 15+15+11+15đ)
├── demo-slides.pdf
├── frontend/                   ← Next.js App Router
├── backend/                    ← FastAPI
├── eval/                       ← golden set + kết quả các lượt chạy (15đ)
├── validation/                 ← feedback log user test (8đ)
├── reflection/                 ← mỗi thành viên 1 file
├── data/                       ← data pack cấp sẵn (không sửa, không commit thêm bản sao)
└── tham-khao/
```

Agent **không tự tạo `codebase/`** — repo này đã tách sẵn `frontend/` và `backend/` ở root, giữ nguyên cách tổ chức đó.

---

## 2. FRONTEND — `frontend/` (Next.js 16, App Router, TypeScript, Tailwind v4)

> Stack hiện tại: `next@16.2.12`, `react@19.2.4`, Tailwind v4 (qua `@tailwindcss/postcss`, không có `tailwind.config`). **Next 16 có breaking changes so với kiến thức huấn luyện cũ — agent phải đọc `node_modules/next/dist/docs/` trước khi dùng API Next.js chưa chắc chắn** (đã ghi trong `frontend/AGENTS.md`).

### Cấu trúc mục tiêu

```
frontend/
├── src/
│   ├── app/                          ← App Router — chỉ chứa route, layout, page
│   │   ├── layout.tsx                ← Root layout (font, Providers, global shell)
│   │   ├── page.tsx                  ← Trang chủ / màn học tập chính
│   │   ├── globals.css
│   │   ├── dashboard/
│   │   │   └── page.tsx              ← EXP Dashboard (modal hoặc route riêng)
│   │   └── api/                      ← Route Handlers CHỈ dùng nếu cần proxy/BFF
│   │       └── ...
│   │
│   ├── components/                   ← UI components dùng chung, chia theo domain
│   │   ├── ui/                       ← primitives tái sử dụng (Button, Card, Modal, ProgressBar...)
│   │   ├── tutor/                    ← AI Tutor chat panel, quick-action pills, citation badge
│   │   ├── slide-viewer/             ← Document/slide viewer (trái/giữa màn hình)
│   │   ├── gamification/             ← V-Pet widget, Streak badge, EXP Dashboard modal
│   │   └── layout/                   ← Shell 2 cột (viewer + sidebar), header, nav
│   │
│   ├── features/                     ← Logic theo tính năng (state + hooks + gọi API), tách khỏi components thuần UI
│   │   ├── explain-slide/
│   │   ├── summarize-slide/
│   │   ├── review-summary/
│   │   ├── quiz-generator/
│   │   └── gamification/             ← tính EXP, streak, cập nhật pet state phía client
│   │
│   ├── lib/
│   │   ├── api-client.ts             ← wrapper fetch tới backend FastAPI (base URL từ env)
│   │   ├── types.ts                  ← type dùng chung khớp Pydantic schema backend (giữ đồng bộ thủ công)
│   │   └── utils.ts
│   │
│   ├── hooks/                        ← hook dùng chung (useSlideContent, usePetState...)
│   └── constants/                    ← nhãn nút, ngưỡng EXP/level, cấu hình UI tĩnh
│
├── public/
├── .env.local                        ← NEXT_PUBLIC_API_BASE_URL=http://localhost:8000 (KHÔNG commit nếu chứa secret)
├── next.config.ts
├── package.json
├── AGENTS.md / CLAUDE.md             ← đã có sẵn, đọc kỹ trước khi code
└── tsconfig.json
```

### Quy tắc cho agent khi code frontend

1. **`app/` chỉ định tuyến, không chứa logic nghiệp vụ.** Page/layout import từ `components/` và `features/`, giữ file trong `app/` mỏng.
2. **Tách biệt `components/` (thuần UI, nhận props) và `features/` (state + gọi API theo tính năng)** — dễ demo từng tính năng độc lập, dễ mock khi AI thật chưa xong (đúng tinh thần CP2: flow bấm được trước, AI thật ghép sau).
3. **Citation là bắt buộc ở UI**, không phải chi tiết phụ: mọi component hiển thị câu trả lời AI (`tutor/`) phải render được citation badge (số trang/slide) hoặc trạng thái "không tìm thấy căn cứ" — không tự ý bỏ qua khi UI chưa đẹp.
4. **Gamification là lớp phụ, không chặn flow AI Tutor.** Đặt trong `components/gamification/` + `features/gamification/`, gọi API riêng (`/api/gamification/...`), không lồng logic tính EXP vào trong logic gọi AI.
5. **Mọi lời gọi backend đi qua `lib/api-client.ts`**, không `fetch()` rải rác trong component — dễ đổi base URL, dễ thêm log/trace khi cần chứng minh "AI call thật" cho rubric R5.
6. **Không tạo `pages/` (Pages Router cũ)** — dự án dùng App Router, không trộn hai kiểu route.
7. Trước khi dùng API Next.js mới/lạ (routing, caching, server actions...), agent **phải xem `node_modules/next/dist/docs/` hoặc web search bản 16.x** thay vì suy đoán từ kiến thức cũ.
8. Nếu cần đọc thêm hướng dẫn viết component/style: xem skill `frontend-design` trước khi style UI mới.

---

## 3. BACKEND — `backend/` (FastAPI)

> Hiện tại chỉ có `main.py` + `requirements.txt` (fastapi, uvicorn, pydantic). Cần mở rộng thành cấu trúc theo domain để dễ log/trace lời gọi AI (rubric R5) và dễ chạy golden set (R4).

### Cấu trúc mục tiêu

```
backend/
├── main.py                         ← chỉ tạo app, include routers, CORS, startup/shutdown
├── requirements.txt
├── .env                            ← API key model AI (KHÔNG commit — thêm vào .gitignore)
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── router.py           ← gom các router con
│   │       ├── tutor.py            ← /explain, /summarize, /review, /quiz
│   │       └── gamification.py     ← /exp, /streak, /pet-state
│   │
│   ├── core/
│   │   ├── config.py                ← Settings (pydantic-settings): API key, model name, path data pack
│   │   └── logging.py                ← cấu hình log/trace mọi lời gọi AI (bắt buộc cho R5)
│   │
│   ├── services/
│   │   ├── retrieval_service.py     ← tra cứu slide/transcript theo số trang, trả về đoạn + mã trích dẫn
│   │   ├── citation_service.py      ← kiểm tra câu trả lời AI có bám nguồn không, gắn số trang
│   │   ├── ai_client.py             ← gọi model AI thật (Claude/Gemini API), có retry + log request/response
│   │   └── gamification_service.py  ← tính EXP, streak, cấp độ pet
│   │
│   ├── schemas/                     ← Pydantic models (request/response) — nguồn sự thật cho types ở frontend
│   │   ├── tutor.py                 ← ExplainRequest, TutorResponse (answer, citations[], has_evidence: bool)
│   │   └── gamification.py
│   │
│   ├── models/                      ← nếu có DB (SQLModel/SQLAlchemy) — hiện tại có thể chưa cần, dùng JSON/in-memory cho prototype
│   │
│   └── data/
│       └── loaders.py               ← load transcript/slide từ ../data/vlearn-pack (KHÔNG copy data vào backend/, chỉ đọc từ đường dẫn gốc)
│
├── eval/                            ← script chạy golden set qua API thật (khác với eval/ ở root chứa kết quả)
│   └── run_golden_set.py
│
└── tests/
    └── test_tutor_api.py            ← test có/không có căn cứ, test case ngoài phạm vi tài liệu
```

### Quy tắc cho agent khi code backend

1. **`main.py` chỉ khởi tạo app + include router** — không viết logic xử lý request trực tiếp trong `main.py`.
2. **Mọi endpoint AI Tutor phải trả về schema có trường citation rõ ràng**, ví dụ:
   ```python
   class TutorResponse(BaseModel):
       answer: str
       citations: list[str]      # ví dụ ["Slide 12", "Trang 5"]
       has_evidence: bool        # False khi AI không tìm thấy căn cứ → phải nói rõ, không bịa
   ```
   Đây là hợp đồng dữ liệu trung tâm — khớp với `frontend/src/lib/types.ts`.
3. **`services/ai_client.py` là nơi DUY NHẤT gọi model AI thật** — mọi request/response phải được log (dùng `core/logging.py`) để làm bằng chứng "lời gọi AI thật, không hardcode" (checklist CP3, rubric R5).
4. **`services/retrieval_service.py` đọc trực tiếp từ `data/vlearn-pack/`** (đường dẫn tương đối lên root), không copy/nhân bản data vào `backend/` — tuân thủ quy định bảo mật dữ liệu ở README gốc.
5. **Không commit `.env`** — API key model AI để trong biến môi trường, thêm `.env` vào `.gitignore` gốc nếu chưa có.
6. **CORS**: bật `CORSMiddleware` trong `main.py` cho origin của frontend (`http://localhost:3000`) ngay từ đầu để không chặn tích hợp CP2.
7. **Gamification tách route riêng** (`api/v1/gamification.py`) — không trộn logic tính EXP vào response của endpoint AI Tutor.
8. Script trong `backend/eval/run_golden_set.py` gọi thẳng API thật (không mock) để sinh bảng % cho `eval/` ở root — phục vụ rubric R4 (đo lượt đầu tại CP3, các lượt sau tới CP6).

---

## 4. Luồng dữ liệu tổng quát (agent cần hiểu trước khi nối API)

```
[Slide Viewer] --(nội dung slide đang xem + câu hỏi)--> [tutor feature hook]
      --(POST /api/v1/tutor/explain)--> [FastAPI router]
      --> [ai_client.py gọi model thật] + [retrieval_service.py tra transcript/slide]
      --> [citation_service.py gắn số trang / đánh giá has_evidence]
      --> [TutorResponse{answer, citations, has_evidence}]
[AI Tutor Chat Panel] hiển thị answer + citation badge, hoặc "không tìm thấy căn cứ, bạn có muốn hỏi lại?"
```

---

## 5. Việc KHÔNG được làm (agent tự kiểm trước khi commit)

- Không hardcode câu trả lời AI trong frontend để "demo cho đẹp" — vi phạm rubric R5 (≥1 lời gọi AI thật ở quyết định trung tâm).
- Không copy nguyên văn data pack vào `frontend/` hoặc `backend/` — chỉ đọc từ `data/` gốc, trích dẫn ngắn nếu cần minh hoạ trong `eval/`.
- Không để logic tính EXP/streak/pet chặn hoặc trộn vào pipeline trả lời AI Tutor — đây là lát cắt phụ, lát cắt chính vẫn là câu trả lời có căn cứ.
- Không tạo song song cả `pages/` và `app/` trong frontend.
- Không đoán API Next.js 16 từ kiến thức cũ — kiểm tra `node_modules/next/dist/docs/` hoặc search trước.
