# Bộ phản biện nhanh — V-Pet Tutor

> Mục tiêu: trả lời trung thực, ngắn và đưa cuộc trao đổi trở lại giá trị mà
> prototype đã chứng minh được.

## 1. Công thức xử lý khi bị hỏi khó

Không tranh luận ngay. Trả lời theo bốn nhịp:

1. **Xác nhận:** “Anh/chị bắt đúng một giới hạn của bản MVP.”
2. **Khoanh phạm vi:** “Điều prototype hôm nay chứng minh là…”
3. **Đưa bằng chứng:** Chỉ nói số liệu hoặc tính năng có thể mở ra kiểm tra.
4. **Chốt bước tiếp theo:** “Để kết luận về tác động, team sẽ đo…”

Mẫu trả lời cứu nguy:

> “Anh/chị bắt đúng điểm này. Bản MVP chưa chứng minh **[điều bị hỏi]**;
> điều chúng em đã chứng minh là **[flow hoặc kết quả đang chạy được]**, thể
> hiện qua **[bằng chứng]**. Bước tiếp theo chúng em sẽ **[cách đo cụ thể]**
> trước khi đưa ra kết luận.”

Nếu chưa biết câu trả lời:

> “Em chưa có đủ dữ liệu để khẳng định điểm đó và không muốn đoán. Trong phạm
> vi prototype, team đang kiểm soát bằng **[cơ chế hiện có]**; em xin ghi nhận
> đây là giả thuyết cần kiểm chứng tiếp.”

## 2. Ba câu phải nhớ

- **Pain:** Trong 1.261 câu hỏi được mining, 358 câu (28,4%) là yêu cầu giải
  thích thụ động; khảo sát 40 học viên cho thấy 64% gần như chỉ xem bài giảng.
- **Lát cắt:** Bôi đen đoạn khó → Pet hỏi xác nhận → AI sinh quiz từ đúng đoạn
  đó → backend chấm và cộng EXP → log được tổng hợp thành Heatmap.
- **Giới hạn:** Đây là prototype kiểm chứng flow và tính khả thi kỹ thuật, chưa
  phải bằng chứng rằng kết quả học tập đã tăng.

## 3. Câu hỏi tấn công vào ý tưởng

### Q1. Pet có phải chỉ là gimmick, bỏ Pet đi vẫn làm quiz được?

**Trả lời 20 giây:**

> “Đúng, quiz vẫn chạy nếu bỏ Pet. Pet không phải bộ não AI mà là lớp tương tác:
> nó xin xác nhận trước khi gọi AI, báo trạng thái, hiển thị EXP và tạo phản hồi
> cảm xúc. Giả thuyết của team là lớp đồng hành này làm người học chủ động làm
> quiz hơn chatbot thuần; giả thuyết đó cần A/B test Pet và không Pet để kết
> luận.”

Không nói Pet đã làm tăng retention nếu chưa có A/B test.

### Q2. Vì sao cần AI, sao không dùng ngân hàng câu hỏi?

> “Ngân hàng câu hỏi tốt khi nội dung cố định, nhưng chi phí soạn tăng theo số
> slide. AI ở đây xử lý phần biến thiên: sinh một câu hỏi từ đúng đoạn người học
> vừa chọn và có thể dùng lịch sử đúng/sai để điều chỉnh mức khó. Backend vẫn
> giữ phần cần chắc chắn như chấm đáp án, chống nộp trùng và cộng EXP.”

Nếu bị hỏi sâu: production nên cache câu hỏi theo `slide + page + text hash`,
review các câu phổ biến và chỉ gọi model khi cache miss.

### Q3. Tại sao không cho AI giải thích luôn mà lại bắt học viên làm quiz?

> “Pain team chọn là hành vi học thụ động. Nếu giải thích ngay, hệ thống tiếp tục
> làm thay việc tư duy. Quiz ngắn buộc người học truy hồi kiến thức trước; sau
> khi nộp, hệ thống mới đưa đáp án và giải thích. Người học vẫn có quyền từ chối
> ngay ở speech bubble của Pet.”

### Q4. EXP có chứng minh người học hiểu bài không?

> “Không. EXP chỉ là tín hiệu khuyến khích hành vi, không phải thước đo năng lực.
> Chỉ số học tập phải đo riêng bằng tỷ lệ đúng ở câu mới, pre-test/post-test và
> khả năng nhớ lại sau một khoảng thời gian.”

### Q5. Các mục tiêu giảm 50%, tăng 30% lấy ở đâu?

> “Đó là mục tiêu validation, không phải kết quả đã đạt. Baseline hiện có là
> 28,4% câu hỏi thụ động và 64% học viên ít tương tác. Team chỉ công bố mức cải
> thiện sau khi A/B test với nhóm đối chứng.”

### Q6. 40 người khảo sát có đủ đại diện không?

> “N=40 đủ cho discovery ban đầu của hackathon, chưa đủ để suy rộng cho toàn bộ
> học viên. Team dùng thêm mining 1.261 câu hỏi để kiểm tra pain từ một nguồn
> hành vi khác. Bước tiếp theo là mở rộng mẫu và phân tầng theo cohort, môn học
> và mức độ sử dụng VLearn.”

### Q7. Khác gì Duolingo hoặc Khanmigo?

> “Team không tuyên bố phát minh gamification hay AI tutor. Lát cắt khác biệt là
> gắn ba phía trong cùng một vòng lặp: đoạn PDF người học đang vướng → quiz động
> có Pet khuyến khích → dữ liệu khó được trả lại cho giảng viên dưới dạng
> Heatmap. Giá trị nằm ở vòng phản hồi trên chính tài liệu của lớp.”

### Q8. Nếu người học bôi đen linh tinh hoặc đoạn quá ngắn?

> “Request hiện bị giới hạn độ dài; prompt yêu cầu từ chối nội dung mơ hồ, ngoài
> phạm vi hoặc có ý định gian lận. UI giữ quyền kiểm soát ở người học: Pet hỏi
> xác nhận trước khi gọi AI. Production sẽ thêm bộ lọc deterministic và thông
> báo yêu cầu chọn lại đoạn có đủ ngữ nghĩa.”

## 4. Câu hỏi tấn công vào AI và đo lường

### Q9. Làm sao dám khẳng định LLM tạo câu hỏi chính xác?

> “Team không khẳng định LLM đúng 100%. Hiện có grounding vào đoạn bôi đen,
> structured output, validation schema và bộ eval cho routing/định dạng. Báo cáo
> 20/20 trước đây được chạy trên Gemini và không nên được diễn giải thành 100%
> chính xác ngữ nghĩa của model DeepSeek hiện tại. Trước production cần bộ câu
> hỏi được giảng viên chấm và đo factual accuracy riêng.”

Điểm quan trọng: bộ 20 case hiện chủ yếu kiểm tra `generate/reject`, đủ bốn lựa
chọn và định dạng đáp án; nó chưa thay thế đánh giá chuyên môn.

### Q10. Model hiện tại là Gemini hay DeepSeek?

> “Bản code hiện tại dùng DeepSeek; nếu không có API key thì chạy mock để flow
> không bị vỡ. Báo cáo 20/20 trong tài liệu cũ là lần eval trên Gemini. Team
> không dùng kết quả của Gemini để khẳng định chất lượng DeepSeek.”

### Q11. AI tự chấm thì có thiên vị hoặc chấm sai không?

> “Model không tham gia lúc nộp bài. Khi sinh quiz, đáp án đúng được giữ ở
> backend và không gửi xuống frontend. Lúc nộp, backend so sánh lựa chọn với đáp
> án đã lưu. Rủi ro còn lại là model sinh đáp án gốc sai kiến thức; rủi ro đó
> phải kiểm soát bằng grounding và eval có giảng viên duyệt.”

### Q12. Adaptive ở đâu, hay chỉ là từ marketing?

> “Prototype gửi lịch sử câu đúng/sai của phiên vào prompt và yêu cầu model tăng
> hoặc hạ độ khó. Đây là adaptive ở mức MVP, chưa phải mô hình năng lực người
> học. Production cần luật chuyển level kiểm chứng được hoặc mô hình như IRT,
> kèm metric xem độ khó thực tế có thay đổi đúng không.”

### Q13. Heatmap có thật không hay toàn dữ liệu fake?

> “Pipeline thật: highlight và kết quả quiz được ghi telemetry, backend tổng hợp
> số lượt bôi đen và tỷ lệ sai. Vì lượng người dùng demo còn ít, dashboard có
> thêm một bộ dữ liệu mô phỏng được gắn nhãn DEMO rõ ràng; file demo tách khỏi
> log thật và có thể tắt bằng `enabled=false`. Team không dùng số demo làm bằng
> chứng tác động.”

### Q14. Heatmap dùng AI ở đâu?

> “Heatmap hiện không cần AI; backend tổng hợp telemetry bằng logic xác định để
> dễ kiểm tra và tránh tốn chi phí. AI được dùng ở quyết định sinh nội dung và
> độ khó quiz. Đây là lựa chọn có chủ ý: không dùng AI ở nơi một phép tổng hợp
> deterministic đã giải quyết tốt.”

### Q15. Highlight nhiều có chắc là đoạn khó không?

> “Không chắc nếu chỉ nhìn highlight count. Vì vậy heatmap kết hợp thêm tỷ lệ
> trả lời sai. Ngay cả vậy, đây vẫn là tín hiệu ưu tiên để giảng viên xem lại,
> không phải kết luận tự động rằng slide dạy kém.”

## 5. Câu hỏi tấn công vào kỹ thuật và kinh doanh

### Q16. Người dùng có thể hack EXP không?

> “Client không được gửi số EXP hoặc `is_correct`. Đáp án đúng lưu phía server,
> backend tự chấm, và quiz bị pop atomically sau lần nộp đầu nên double-click
> hoặc request đồng thời không thể cộng EXP hai lần. Đây là các case đã có smoke
> test.”

### Q17. Restart server thì có mất dữ liệu không?

> “Có hai loại state. Telemetry và hotspot của demo hiện ghi file JSON; session
> Pet và quiz đang làm dở lưu RAM nên sẽ mất khi restart. Đây là giới hạn MVP đã
> biết. Production sẽ dùng Redis cho quiz/session ngắn hạn và PostgreSQL cho
> tiến trình, telemetry.”

### Q18. Nếu nhiều người dùng cùng lúc thì sao?

> “Kiến trúc MVP chưa được load test và file JSON không phù hợp cho tải lớn.
> Hướng mở rộng là API stateless, Redis/PostgreSQL, queue cho telemetry, cache
> quiz theo đoạn và rate limit model. Team chưa tuyên bố hệ thống hiện tại sẵn
> sàng production.”

### Q19. Chi phí gọi LLM có quá cao không?

> “Pet chỉ gọi AI sau khi người học xác nhận, không gọi ngay khi vừa bôi đen.
> Production sẽ hash đoạn chọn để tái sử dụng câu hỏi đã kiểm duyệt, cache các
> hotspot phổ biến và giới hạn tần suất. Cần đo token/request và cache-hit rate
> trước khi chốt unit economics.”

### Q20. Quyền riêng tư dữ liệu học viên xử lý thế nào?

> “Prototype dùng session ID ẩn danh và log đoạn được bôi đen cùng kết quả quiz,
> chưa thu tên thật. Tuy nhiên production vẫn cần consent, chính sách retention,
> quyền xóa dữ liệu, mã hóa và không gửi PII lên model. Đây là yêu cầu bắt buộc,
> không phải phần có thể để sau vô thời hạn.”

### Q21. Giảng viên được lợi gì ngoài một dashboard đẹp?

> “Dashboard ưu tiên những đoạn vừa được chọn nhiều vừa có tỷ lệ sai cao, giúp
> giảng viên biết nên xem lại trang nào trước thay vì đọc toàn bộ phản hồi rời
> rạc. Giá trị kinh doanh cần đo bằng thời gian giảng viên tiết kiệm và số chỉnh
> sửa giáo trình hữu ích sau mỗi cohort.”

### Q22. Tại sao đây là sản phẩm chứ không chỉ là một feature?

> “Ở MVP, đây đúng là một lát cắt tính năng trên VLearn. Tiềm năng sản phẩm đến
> từ vòng dữ liệu: càng nhiều phiên học thì thư viện câu hỏi được kiểm duyệt và
> insight giáo trình càng tốt. Team ưu tiên chứng minh một lát cắt chạy trọn vẹn
> trước, chưa tuyên bố đã có product-market fit.”

## 6. Trạng thái kỹ thuật hiện tại — nói đúng, không dùng thông tin cũ

Các lỗi được ghi trong phiên bản cũ của file này đã được cập nhật:

- EXP trả về và EXP thực cộng đã thống nhất: sai nhận +2.
- Quiz được xóa atomically sau lần nộp đầu để chống cộng điểm hai lần.
- CORS không còn dùng wildcard; origin lấy từ cấu hình.
- EXP được chặn ở trần level hiện tại.
- Session store đã tách khỏi AI service, không còn circular import cũ.
- Root endpoint không còn liệt kê `/pet/update`.

Giới hạn còn thật:

- Quiz và trạng thái Pet vẫn lưu RAM.
- Chưa có auth, database, rate limit và load test production.
- Demo Heatmap có dữ liệu mô phỏng nhưng được gắn nhãn và lưu tách biệt.
- Eval 20/20 cũ thuộc Gemini; model chạy hiện tại là DeepSeek.
- Chưa có A/B test chứng minh Pet cải thiện retention hoặc learning outcome.

## 7. Những câu tuyệt đối không nói

- “AI của team chính xác 100%.”
- “Pet chắc chắn tăng retention.”
- “Heatmap là 100% dữ liệu người dùng thật.”
- “Team đã giảm 50% thời gian hoặc tăng 30% năng suất.”
- “20/20 nghĩa là mọi câu hỏi AI đều đúng kiến thức.”
- “Hệ thống đã sẵn sàng production.”
- “Dữ liệu demo cũng là evidence.”

## 8. Câu kết khi bị dí liên tục

> “Team xin tách rõ ba lớp: pain đã có evidence, flow đã có prototype chạy được,
> còn impact vẫn là giả thuyết cần validation. Chúng em sẵn sàng mở code, log và
> demo từng bước; điều chưa đo được, team sẽ không khẳng định quá dữ liệu.”



chưa đến nhóm tôi có mấy nhóm trước tôi họ còn bị hỏi là nhóm bạn có gì hot, search agnet của bạn chưa có gì nổi bật thì cần dùng gì thich hợp vào thay vif dùng perplexity, hay nhóm khác bị hỏi là cái ai tóm tắt slide ai của em có tóm tắt được, và để llm nó quyết định hết, là sai khi app dụng kiến thưcs chuyen môn, và không thể llm có thể quêts đinihj tất cả. sự liên kết giữa các slide giữa các phần, nhóm hỏi về 