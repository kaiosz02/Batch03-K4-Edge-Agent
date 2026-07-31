# Tài Liệu Tổng Quan Dự Án: VLearn AI Tutor

## 1. Giới thiệu dự án
VLearn AI Tutor là một nền tảng học tập trực tuyến (website trình chiếu slide) được tích hợp Trợ lý AI (AI Tutor). Dự án được phát triển trong khuôn khổ Venture Arena Hackathon, tập trung vào việc giải quyết vấn đề học viên bị mất mạch học khi phải tự đối chiếu tài liệu do AI trả lời thiếu căn cứ.

**Vấn đề cốt lõi:** Hiện tại, ~46% câu trả lời của AI Tutor không kèm theo số trang hoặc trích dẫn căn cứ, khiến học viên mất 3-5 phút tự tìm lại tài liệu và đối mặt với rủi ro tiếp thu kiến thức sai (AI hallucination).
**Giải pháp:** AI Tutor tự động tra cứu tài liệu và luôn đưa ra câu trả lời kèm số trang trích dẫn chính xác, hoặc chủ động từ chối/hỏi lại nếu không tìm thấy căn cứ. Giúp học viên hiểu bài ngay trên một màn hình mà không bị đứt đoạn quá trình học.

---

## 2. Các Tính Năng (Features)

### 2.1. Tính năng Học tập cốt lõi (AI Tutor)
* **Giải thích nội dung slide (Tính năng sống còn):** Khi người dùng bôi đen/khoanh vùng một thuật ngữ hoặc đoạn text trên slide, AI sẽ giải thích chính xác nội dung đó. **Bắt buộc:** Phải kèm theo trích dẫn/số trang cụ thể.
* **Tóm tắt slide hiện tại:** Rút gọn các ý chính của slide đang hiển thị.
* **Tổng kết nội dung:** Tổng hợp kiến thức của các slide đã học trong buổi.
* **Câu hỏi ôn tập thích ứng (Adaptive Quiz):** AI tự động tạo câu hỏi và điều chỉnh độ khó (Dễ → Trung bình → Khó) dựa trên độ chính xác của các câu trả lời trước đó của học viên.

### 2.2. Tính năng Phân tích dữ liệu (Data Analytics)
* **Thống kê điểm mù kiến thức (Crowdsourced Highlight Tracking):** Theo dõi và thống kê các đoạn text/thuật ngữ được học viên bôi đen hỏi AI nhiều nhất. Xuất báo cáo dạng Heatmap giúp Giảng viên (Instructors) nhận diện những phần khó hiểu để chủ động cải thiện tài liệu.

### 2.3. Tính năng Gamification (Tăng tương tác)
* **Thú cưng ảo (V-Pet):** Trợ lý ảo đồng hành hiển thị ở góc màn hình. V-Pet sẽ thay đổi biểu cảm và tiến hóa dựa trên điểm kinh nghiệm (EXP) học viên nhận được từ chất lượng tương tác học tập.
* **Streak & Chuỗi học tập:** Ghi nhận chuỗi ngày học liên tục và thưởng EXP để tạo động lực duy trì thói quen học hàng ngày.
* **Bảng điểm cá nhân (EXP Dashboard):** Hiển thị tổng EXP, cấp độ V-Pet và thống kê lịch sử học tập.

---

## 3. Các Trang Giao Diện (Pages)

1. **Trang Đăng nhập / Đăng ký (Auth Page):** Xác thực người dùng (Học viên/Giảng viên).
2. **Trang Chủ (Dashboard/Lobby):**
   - Danh sách các bài giảng và tài liệu.
   - Hiển thị Bảng điểm cá nhân (EXP, Streak) và trạng thái Thú cưng ảo.
3. **Trang Học tập (Slide Viewer & AI Tutor Workspace) - Trang quan trọng nhất:**
   - **Khu vực hiển thị Slide (Main Canvas):** Nơi học viên xem bài giảng, hỗ trợ UX bôi đen/khoanh vùng text siêu mượt.
   - **Khu vực AI Tutor Chatbox (Sidebar/Popup):** Cửa sổ trò chuyện với AI, hiển thị câu trả lời (luôn highlight số trang trích dẫn) và các nút thao tác nhanh.
   - **Khu vực V-Pet (Floating Widget):** Hiển thị thú cưng ảo với các micro-animations.
4. **Trang Phân tích dành cho Giảng viên (Instructor Analytics Dashboard):**
   - Bảng điều khiển hiển thị thống kê "Điểm mù kiến thức" và các đoạn text bị học viên hỏi nhiều nhất.

---

## 4. Công Nghệ & Giải Pháp Kiến Trúc (Technologies & Solutions)

Là một Senior Developer, tôi đề xuất Stack công nghệ sau nhằm đảm bảo tốc độ phát triển "thần tốc" trong 1.5 ngày Hackathon nhưng vẫn giữ được độ mượt mà và cảm giác "premium":

### 4.1. Frontend (Giao diện người dùng)
* **Framework:** **React.js** (hoặc **Next.js**) để lắp ráp giao diện linh hoạt dựa trên component.
* **Styling:** **Tailwind CSS** kết hợp với **Framer Motion** để thiết kế các hiệu ứng chuyển động, hover, chuyển cảnh siêu mượt cho V-Pet và Chatbox.
* **PDF/Slide Renderer:** Sử dụng `react-pdf` hoặc `pdf.js` để nhúng tài liệu trực tiếp. Việc bắt sự kiện highlight văn bản sẽ cần dùng JS DOM API hoặc thư viện chuyên dụng như `react-pdf-highlighter`.

### 4.2. Backend & Database
* **Backend:** **Python (FastAPI)** là lựa chọn hoàn hảo nhất. Tốc độ code nhanh, tích hợp native với các thư viện AI, LLM và Data Science.
* **Database (DB):** **Supabase** (PostgreSQL) để lưu User, EXP, cấu hình V-Pet, và lưu vết Tracking logs với API sinh sẵn, tiết kiệm thời gian code CRUD.
* **Vector Database (cho RAG):** **Pinecone** hoặc **ChromaDB**. Dễ tích hợp, trả về kết quả tìm kiếm ngữ nghĩa siêu tốc.

### 4.3. Giải pháp AI (AI Architecture)
* **Mô hình AI (LLM):** **Claude 3.5 Sonnet** hoặc **GPT-4o mini** (thông qua API) vì khả năng bám sát ngữ cảnh tài liệu rất tốt.
* **Pipeline RAG (Retrieval-Augmented Generation):**
  1. Xử lý file Slide: Extract chữ, chia nhỏ (chunking) theo ranh giới từng Slide.
  2. **Gắn Metadata cốt lõi:** Mỗi chunk bắt buộc phải có thông tin `page_number`.
  3. Đẩy lên Vector DB.
* **Kỹ thuật Prompting (Strict Grounding):**
  - Xây dựng System Prompt với nguyên tắc bắt buộc: *"Chỉ trả lời dựa trên context. Mỗi ý trả lời phải đính kèm [Slide số X]. Nếu nội dung không có trong context, từ chối trả lời, cấm được bịa đặt."*
  - Áp dụng cơ chế Threshold cho Vector Search: Nếu độ tương đồng câu hỏi và tài liệu quá thấp -> Chuyển thẳng về luồng "Không tìm thấy căn cứ".

---

## 5. Roadmap Chi Tiết Thực Hiện Dự Án (1.5 Ngày)

Đây là lộ trình thực thi kỹ thuật chi tiết bám sát timeline khắt khe của Venture Arena:

### Day 1: Buổi Sáng (Chốt scope & Dựng khung)
* **08:00 - 10:15 (CP1):** Chốt tính năng cốt lõi (Giải thích slide có trích dẫn đúng lát cắt). Hoàn thành Canvas 7 dòng.
* **10:15 - 12:00 (CP2 - Dựng Prototype UI & Flow):**
  - Khởi tạo project (Frontend + FastAPI) và chia sẻ Repo.
  - Lắp ráp UI Trang Học tập (Render PDF + Khung Chat + Nút chức năng).
  - Hardcode (mock) data trả về: Bấm "Giải thích" -> Hiện text cố định. Đảm bảo flow mượt mà từ đầu đến cuối mà chưa cần AI thật.

### Day 1: Buổi Chiều (AI thật & Đo lường)
* **12:00 - 16:00 (CP3 - AI Integration):**
  - Xử lý kỹ thuật RAG: Cắt tài liệu slide đẩy vào Vector DB.
  - Kết nối API LLM. Viết logic truy xuất: `Bôi đen chữ -> Search Vector DB -> Prompt LLM -> Trả kết quả`.
  - Tuning Prompt: Đảm bảo format kết quả trả về luôn có `(Slide số X)`.
  - Chạy thử 20 câu hỏi (Golden Set) để đánh giá % bám căn cứ.
* **16:00 - 17:30 (CP4 - Hoàn thiện Tính năng & Spec):**
  - Commit file `spec.md` với con số quality bar chuẩn chỉ.
  - Xử lý các edge cases của hệ thống (Ví dụ: Hỏi câu không liên quan thì AI phản ứng thế nào).

### Day 1: Buổi Tối (Mở rộng & Đánh bóng UX)
* **18:00 - 23:00 (Gamification & Analytics):**
  - Gắn V-Pet tĩnh/động vào góc màn hình, tạo logic cộng điểm EXP giả lập khi nhắn tin với AI.
  - Code API và logic cho tính năng Adaptive Quiz.
  - Lưu log các câu hỏi bôi đen vào DB để làm báo cáo Heatmap cho Giảng viên.

### Day 2: Buổi Sáng (Kiểm chứng & Đóng gói)
* **08:00 - 09:00 (Chuẩn bị Validation):**
  - Rà soát hệ thống, chuẩn bị thư mục `eval/` chứa log chạy Golden Set.
  - Deploy dự án (Vercel/Render) hoặc chạy Local ổn định cho user test.
* **09:00 - 10:00 (CP5 - Validation bằng User thật):**
  - Tổ chức cho ≥5 user ngoài team dùng thử cả 4 tính năng.
  - Thu thập feedback (cả khen và chê) vào thư mục `validation/`.
* **10:00 - 15:00 (CP6 - Pitching & Demo):**
  - Chuẩn bị `demo-slides.pdf` (6 trang).
  - Tập dượt phần Demo sản phẩm thật (chú ý show khoảnh khắc AI đọc được số trang và V-Pet phản ứng).
  - Đóng gói toàn bộ Repo (`README`, `spec`, code, eval, validation, reflection) và submit.
