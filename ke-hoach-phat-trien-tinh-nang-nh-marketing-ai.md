# Kế Hoạch Phát Triển Tính Năng - NH Marketing AI

> Ngày lập kế hoạch: 18/05/2026  
> Phạm vi: Web app `Product-MKT-NH/web` và hệ thống 30 marketing skills  
> Mục tiêu: Biến NH Marketing AI từ công cụ hỗ trợ nội bộ thành hệ điều hành marketing có dữ liệu, tự động hóa và khả năng vận hành ổn định.

---

## 1. Định Hướng Sản Phẩm

NH Marketing AI hiện đã có nền tảng tốt: thư viện 30 skill, chat AI theo skill, Facebook Insights, AI Design Studio, Radar xu hướng, Messenger Inbox và Auto-Reply. Giai đoạn tiếp theo không nên chỉ thêm tính năng rời rạc, mà cần phát triển theo hướng:

1. **Ổn định lõi hệ thống**: bảo mật, database, logging, kiểm soát lỗi.
2. **Chuẩn hóa quy trình marketing**: từ brief -> content -> ads -> inbox -> báo cáo.
3. **Biến dữ liệu thành hành động**: lấy dữ liệu Facebook/Messenger/chiến dịch để AI đề xuất việc cần làm.
4. **Tự động hóa có kiểm soát**: AI hỗ trợ nhưng có cơ chế duyệt, phân quyền và lịch sử.
5. **Mở rộng đa kênh**: Facebook trước, sau đó Zalo, website chat, Google Sheets/CRM.

---

## 2. Hiện Trạng Dự Án

### Đã có

| Nhóm | Hiện trạng |
|---|---|
| Skill AI | 30 skill marketing, gồm chiến lược, content, ads, performance, personal brand, export B2B |
| Chat AI | Chat theo skill, đọc product context, streaming, upload ảnh, so sánh A/B, lịch sử localStorage, xuất PDF |
| Facebook | Facebook Insights đã đọc được dữ liệu Fanpage khi có token |
| Messenger | Có inbox, gửi tin nhắn, pause/resume AI, auto-reply polling |
| AI Studio | Upload ảnh, tách nền, chọn nền, thêm text, tải banner |
| Radar xu hướng | Gợi ý trend theo ngày, chuyển trend thành script video |
| UI | Sidebar, dark/pink theme, dashboard, các trang lọc theo nhóm công việc |

### Điểm cần cải thiện

| Vấn đề | Ảnh hưởng |
|---|---|
| Chưa có đăng nhập/phân quyền | Ai có URL local/deploy đều có thể vào hệ thống nếu public |
| Lịch sử chat chủ yếu ở localStorage | Mất dữ liệu khi đổi máy/trình duyệt; khó quản trị team |
| Messenger state còn dùng memory/local file | Không ổn định khi deploy serverless hoặc nhiều người dùng |
| Auto-reply cần cơ chế kiểm duyệt tốt hơn | Rủi ro AI trả lời sai về giá, cam kết, chính sách |
| Chưa có CRM/lead pipeline | Lead từ inbox chưa chuyển thành cơ hội bán hàng có trạng thái |
| Chưa có lịch đăng bài thật | Content tạo ra chưa đi đến bước xuất bản/lên lịch |
| Chưa có audit/logging tập trung | Khó debug khi Facebook/Gemini/token lỗi |
| Chưa có test/lint sạch toàn dự án | Tăng rủi ro khi mở rộng nhanh |

---

## 3. Mục Tiêu 90 Ngày

Trong 90 ngày tới, nên tập trung vào 4 kết quả:

1. **Marketer dùng được hằng ngày**: đăng nhập, lưu lịch sử, quản lý output và tìm lại được.
2. **Inbox trở thành nguồn lead có cấu trúc**: mỗi khách hàng có trạng thái, tag, điểm tiềm năng và ghi chú.
3. **AI hỗ trợ quyết định marketing**: từ dữ liệu Facebook/Inbox, AI đề xuất content, ads, follow-up, báo cáo.
4. **Có quy trình xuất bản**: từ skill tạo nội dung -> duyệt -> lên lịch -> đo kết quả.

Chỉ số đo:

| Chỉ số | Mục tiêu |
|---|---|
| Thời gian tạo campaign brief | Giảm còn dưới 30 phút |
| Thời gian phản hồi inbox ngoài giờ | Dưới 2 phút với Auto-Reply hoặc Co-pilot |
| Tỷ lệ output AI được dùng lại | Trên 50% output có lưu/xuất bản/chỉnh sửa |
| Tỷ lệ lead có tag/trạng thái | Trên 80% hội thoại mới |
| Báo cáo marketing tuần | Tự động tạo bản nháp hằng tuần |

---

## 4. Thứ Tự Ưu Tiên Tổng Thể

| Ưu tiên | Tính năng | Lý do |
|---|---|---|
| P0 | Đăng nhập + phân quyền | Bảo vệ token, dữ liệu khách hàng và hệ thống nội bộ |
| P0 | Database cho chat, inbox, config | Nền tảng để app chạy ổn định khi deploy |
| P0 | Logging + trang kiểm tra kết nối | Giảm thời gian debug Facebook/Gemini |
| P1 | CRM mini + lead scoring | Biến inbox thành pipeline bán hàng |
| P1 | Content workflow: tạo -> duyệt -> lên lịch | Biến skill thành quy trình marketing thật |
| P1 | Auto-report hằng tuần | Tự động hóa báo cáo và đề xuất hành động |
| P2 | Zalo OA integration | Mở rộng kênh chăm sóc khách hàng |
| P2 | AI Creative Studio 2.0 | Tăng năng lực sản xuất visual/video |
| P3 | ERP/Báo giá tự động | Giá trị lớn nhưng cần dữ liệu vận hành chính xác |

---

## 5. Roadmap 12 Tuần

### Giai đoạn 1: Ổn Định Nền Tảng (Tuần 1-2)

Mục tiêu: làm cho hệ thống an toàn, có dữ liệu bền vững và dễ debug.

| Mã | Tính năng | Mô tả | Kết quả cần có |
|---|---|---|---|
| F1.1 | Đăng nhập nội bộ | Dùng NextAuth, Google OAuth hoặc mã PIN nội bộ | Chỉ người được cấp quyền vào được app |
| F1.2 | Phân quyền cơ bản | Admin, Marketing, Sales, Viewer | Mỗi vai trò thấy đúng chức năng |
| F1.3 | Database | Supabase/PostgreSQL hoặc SQLite local cho MVP | Lưu user, chat sessions, conversations, settings |
| F1.4 | Migration dữ liệu | Chuyển localStorage/file JSON quan trọng sang DB | Lịch sử không mất khi đổi máy |
| F1.5 | Health Check Page | Trang kiểm tra Gemini, Facebook token, Page ID, quyền API | Biết lỗi do token, API key hay network |
| F1.6 | Error logging | Ghi lỗi API vào DB/log file | Có log để debug thay vì chỉ nhìn console |

Tiêu chí hoàn thành:

- Người dùng phải đăng nhập trước khi dùng.
- Chat session và cấu hình Auto-Reply lưu trong DB.
- Có trang `/settings/integrations` hiển thị trạng thái Gemini/Facebook.
- Khi thiếu token/API key, UI báo rõ biến nào thiếu.

---

### Giai đoạn 2: Nâng Cấp Chat AI & Skill Workflow (Tuần 3-4)

Mục tiêu: biến Chat AI từ nơi hỏi đáp thành nơi quản lý output marketing.

| Mã | Tính năng | Mô tả | Kết quả cần có |
|---|---|---|---|
| F2.1 | Lưu output AI | Mỗi câu trả lời có thể lưu thành tài sản marketing | Có thư viện output đã lưu |
| F2.2 | Đặt tên và tag output | Tag: ads, content, brief, report, script, export | Tìm lại nhanh theo chiến dịch |
| F2.3 | Version history | Khi chỉnh sửa output, lưu phiên bản cũ | Không mất nội dung tốt |
| F2.4 | Template form theo skill | Một số skill quan trọng có form đầu vào thay vì chỉ chat | Brief đầu vào chuẩn hơn |
| F2.5 | Skill chaining | Sau khi chạy skill, gợi ý bước tiếp theo | Ví dụ: brief -> copy -> script -> A/B test |
| F2.6 | Export tốt hơn | Xuất PDF/Markdown/Docx với template Nhật Hàn | Dễ gửi nội bộ hoặc khách hàng |

Skill nên ưu tiên form hóa trước:

1. `00-ke-hoach-mkt`
2. `02-brief-chien-dich`
3. `04-script-video`
4. `05-copy-quang-cao`
5. `07-bao-cao-marketing`
6. `20-brief-client-intake`
7. `29-xuat-khau-b2b`

Tiêu chí hoàn thành:

- Mỗi output AI có thể lưu, đặt tên, tag và mở lại.
- Ít nhất 5 skill có form nhập liệu riêng.
- Người dùng có thể xuất một kế hoạch/copy/script thành file chuyên nghiệp.

---

### Giai đoạn 3: CRM Mini & Messenger Intelligence (Tuần 5-6)

Mục tiêu: biến Messenger thành nguồn lead có thể theo dõi và chuyển đổi.

| Mã | Tính năng | Mô tả | Kết quả cần có |
|---|---|---|---|
| F3.1 | Hồ sơ khách hàng | Tạo customer profile từ hội thoại Facebook | Có tên, kênh, ghi chú, lịch sử |
| F3.2 | Tag tự động | AI gắn tag: hỏi giá, cần tư vấn, khách cũ, phàn nàn, tiềm năng cao | Sales ưu tiên đúng người |
| F3.3 | Lead scoring | Chấm điểm 0-100 theo nhu cầu, ngân sách, thời gian mua | Ưu tiên chăm sóc lead nóng |
| F3.4 | Pipeline trạng thái | Mới -> Đang tư vấn -> Chờ báo giá -> Đã gửi báo giá -> Chốt/Không chốt | Theo dõi tiến độ rõ ràng |
| F3.5 | AI summary hội thoại | Tóm tắt nhu cầu, thông số in, câu hỏi còn thiếu | Admin đọc nhanh trước khi phản hồi |
| F3.6 | Co-pilot nâng cao | AI đề xuất 2-3 câu trả lời theo tone khác nhau | Người dùng duyệt nhanh hơn |

Tiêu chí hoàn thành:

- Mỗi hội thoại mới tạo/cập nhật customer profile.
- AI tự gợi ý tag và lead score.
- Admin có thể lọc lead theo trạng thái và điểm tiềm năng.

---

### Giai đoạn 4: Content Planning & Publishing (Tuần 7-8)

Mục tiêu: nối output AI với lịch nội dung và xuất bản thực tế.

| Mã | Tính năng | Mô tả | Kết quả cần có |
|---|---|---|---|
| F4.1 | Content Calendar | Lịch tuần/tháng cho Facebook, TikTok, Zalo, LinkedIn | Xem nội dung theo ngày/kênh |
| F4.2 | Duyệt nội dung | Draft -> Review -> Approved -> Scheduled -> Published | Có workflow rõ |
| F4.3 | Lên lịch Facebook post | Đăng/hẹn giờ bài lên Fanpage qua Graph API | Giảm thao tác thủ công |
| F4.4 | Thư viện asset | Lưu ảnh, banner, script, caption theo chiến dịch | Quản lý tài sản marketing |
| F4.5 | Tái sử dụng nội dung | 1 bài dài -> 5 post ngắn -> 3 script video -> email | Tăng hiệu suất sản xuất |
| F4.6 | Radar -> Calendar | Trend được chọn có thể đưa thẳng vào lịch nội dung | Trend có điểm đến rõ ràng |

Tiêu chí hoàn thành:

- Người dùng tạo nội dung từ skill và đưa vào calendar.
- Có trạng thái duyệt nội dung.
- Có thể đăng hoặc hẹn giờ ít nhất lên Facebook.

---

### Giai đoạn 5: Reporting & Marketing Intelligence (Tuần 9-10)

Mục tiêu: biến dữ liệu thành báo cáo và đề xuất hành động.

| Mã | Tính năng | Mô tả | Kết quả cần có |
|---|---|---|---|
| F5.1 | Báo cáo tuần tự động | Tổng hợp Facebook, content, inbox, lead | Tạo draft báo cáo mỗi tuần |
| F5.2 | AI Insight Engine | AI giải thích vì sao chỉ số tăng/giảm | Không chỉ hiển thị số liệu |
| F5.3 | Action Plan Generator | Từ dữ liệu -> đề xuất việc làm tuần tới | Có owner, deadline, KPI |
| F5.4 | Content performance | Bài nào tốt, hook nào hiệu quả, khung giờ nào tốt | Tối ưu lịch nội dung |
| F5.5 | Export report | PDF/Markdown báo cáo gửi sếp | Báo cáo dùng được ngay |
| F5.6 | Benchmark nội bộ | Lưu benchmark theo tháng/quý của Nhật Hàn | So sánh theo lịch sử thật |

Tiêu chí hoàn thành:

- Có báo cáo tuần tự động sinh bản nháp.
- Mỗi báo cáo có insight và action plan.
- Có thể xem lại lịch sử báo cáo.

---

### Giai đoạn 6: Mở Rộng Đa Kênh & Tự Động Hóa (Tuần 11-12)

Mục tiêu: mở rộng hệ thống ngoài Facebook và tăng tự động hóa có kiểm soát.

| Mã | Tính năng | Mô tả | Kết quả cần có |
|---|---|---|---|
| F6.1 | Zalo OA Integration | Đồng bộ tin nhắn, gửi phản hồi, lưu lead | Không phụ thuộc riêng Facebook |
| F6.2 | Website chat widget | Chat box trên website, lưu vào unified inbox | Thu lead từ website |
| F6.3 | Google Sheets sync | Đồng bộ lead, content calendar, report | Dễ chia sẻ với team |
| F6.4 | Email follow-up | Gửi email chăm sóc lead hoặc buyer export | Tự động hóa nurture |
| F6.5 | Export B2B workflow | Từ skill 29 -> CRM buyer -> email follow-up -> pipeline | Phục vụ hướng xuất khẩu |
| F6.6 | Notification | Thông báo lead nóng, inbox chưa phản hồi, báo cáo tuần | Không bỏ sót việc quan trọng |

Tiêu chí hoàn thành:

- Unified inbox có ít nhất 2 nguồn: Facebook + Website/Zalo.
- Lead có thể đồng bộ ra Google Sheets.
- Workflow export B2B có pipeline riêng.

---

## 6. Backlog Tính Năng Theo Giá Trị

### Nhóm P0 - Bắt buộc trước khi mở rộng

| Tính năng | Giá trị | Độ khó | Ghi chú |
|---|---:|---:|---|
| Đăng nhập/phân quyền | Rất cao | Trung bình | Bảo mật dữ liệu và token |
| Database | Rất cao | Trung bình | Nền móng cho mọi tính năng |
| Health check integrations | Cao | Thấp | Giảm lỗi khi thiếu env/token |
| Logging lỗi API | Cao | Thấp | Dễ debug production |
| Dọn lint lỗi nghiêm trọng | Trung bình | Trung bình | Giảm rủi ro khi build/deploy |

### Nhóm P1 - Tạo giá trị kinh doanh rõ

| Tính năng | Giá trị | Độ khó | Ghi chú |
|---|---:|---:|---|
| CRM mini | Rất cao | Trung bình | Biến inbox thành pipeline |
| Lead scoring | Cao | Trung bình | Ưu tiên lead nóng |
| Content calendar | Cao | Trung bình | Nối skill với xuất bản |
| Auto-report tuần | Cao | Trung bình | Tiết kiệm thời gian quản lý |
| Lưu output AI | Cao | Thấp | Tăng khả năng dùng lại |

### Nhóm P2 - Tăng năng lực sáng tạo và tự động hóa

| Tính năng | Giá trị | Độ khó | Ghi chú |
|---|---:|---:|---|
| AI Studio 2.0 | Trung bình-cao | Trung bình | Mockup, video, template |
| Zalo OA | Cao | Cao | Cần API và điều kiện Zalo |
| Website chat widget | Cao | Trung bình | Tạo thêm nguồn lead |
| Google Sheets sync | Trung bình | Trung bình | Dễ vận hành cho team |
| Multi-language output | Trung bình | Thấp | Hữu ích cho export B2B |

### Nhóm P3 - Dài hạn

| Tính năng | Giá trị | Độ khó | Ghi chú |
|---|---:|---:|---|
| Báo giá tự động | Rất cao | Cao | Cần bảng giá/chất liệu/quy cách chuẩn |
| ERP integration | Rất cao | Rất cao | Phụ thuộc hệ thống nội bộ |
| AI video ads tự động | Cao | Cao | Chi phí model/video cần kiểm soát |
| TikTok/Marketplace spy | Trung bình | Cao | Có rủi ro scraping/policy |

---

## 7. Kiến Trúc Kỹ Thuật Đề Xuất

### 7.1. Database

Nên dùng Supabase/PostgreSQL nếu mục tiêu deploy thật. Nếu chỉ local/MVP, có thể dùng SQLite trước nhưng nên thiết kế schema dễ chuyển đổi.

Bảng đề xuất:

| Bảng | Dùng để lưu |
|---|---|
| `users` | Tài khoản, vai trò |
| `skills` | Metadata skill, category, version |
| `chat_sessions` | Phiên chat theo user/skill |
| `chat_messages` | Tin nhắn user/AI |
| `saved_outputs` | Kế hoạch, copy, script, báo cáo đã lưu |
| `customers` | Hồ sơ khách hàng |
| `conversations` | Hội thoại theo kênh |
| `conversation_messages` | Tin nhắn inbox |
| `lead_scores` | Điểm lead và lý do |
| `content_items` | Nội dung trong calendar |
| `assets` | Ảnh, banner, file xuất |
| `reports` | Báo cáo tuần/tháng |
| `integration_logs` | Log Facebook/Gemini/Zalo |
| `settings` | Cấu hình Auto-Reply, brand, tích hợp |

### 7.2. AI Layer

Nên tách AI thành service/helper thay vì để logic trực tiếp trong route:

- `src/lib/ai/client.ts`: chọn model, fallback, timeout.
- `src/lib/ai/prompts.ts`: build system prompt theo skill/context.
- `src/lib/ai/tools.ts`: phân loại lead, tóm tắt hội thoại, tạo action plan.
- `src/lib/ai/guardrails.ts`: kiểm tra nội dung nhạy cảm như giá, cam kết, pháp lý.

Lợi ích:

- Dễ đổi model.
- Dễ thêm guardrails.
- Dễ test.
- Không lặp logic Gemini ở nhiều route.

### 7.3. Integration Layer

Nên gom các API bên ngoài vào `src/lib/integrations`:

- `facebook.ts`
- `zalo.ts`
- `google-sheets.ts`
- `email.ts`

Mỗi integration cần có:

- Hàm `healthCheck`.
- Hàm gọi API chính.
- Chuẩn hóa lỗi.
- Log request/response quan trọng nhưng không lưu token.

---

## 8. Quy Trình Duyệt Nội Dung Và AI Safety

Vì hệ thống có AI trả lời khách hàng và tạo nội dung marketing, cần có cơ chế kiểm soát:

| Trường hợp | Quy tắc |
|---|---|
| Báo giá | AI chỉ hỏi thêm thông số hoặc báo "cần nhân viên xác nhận", không tự cam kết giá nếu chưa có bảng giá chuẩn |
| Tiến độ | AI được nêu năng lực chung nhưng không cam kết ngày giao cụ thể nếu chưa có đơn hàng |
| Chính sách | AI phải dùng template đã duyệt |
| Khiếu nại | AI không tranh luận, chuyển người thật xử lý |
| Nội dung ads | Cần checklist trước khi xuất bản |
| Auto-Reply | Giai đoạn đầu ưu tiên Co-pilot; Full-Auto chỉ dùng với câu hỏi đơn giản |

Nên có danh sách "câu trả lời được duyệt" cho các nhóm:

- Hỏi giá.
- Hỏi chất liệu.
- Hỏi thời gian in.
- Hỏi thiết kế.
- Hỏi giao hàng.
- Khiếu nại.
- Xin báo giá số lượng lớn.

---

## 9. Kế Hoạch Triển Khai Theo Sprint

### Sprint 1: Nền tảng an toàn

Thời gian: 1 tuần

- Thêm đăng nhập.
- Thêm database.
- Lưu chat sessions vào DB.
- Trang kiểm tra kết nối Gemini/Facebook.
- Log lỗi API.

### Sprint 2: Quản lý output AI

Thời gian: 1 tuần

- Lưu output.
- Tag/version output.
- Form đầu vào cho 3 skill quan trọng.
- Xuất Markdown/PDF tốt hơn.

### Sprint 3: CRM Messenger

Thời gian: 1 tuần

- Customer profile.
- Lead pipeline.
- AI summary hội thoại.
- Tag tự động.

### Sprint 4: Lead scoring và Co-pilot

Thời gian: 1 tuần

- Lead scoring.
- 2-3 phương án trả lời AI.
- Guardrails cho báo giá/khiếu nại.
- Dashboard lead nóng.

### Sprint 5: Content Calendar

Thời gian: 1 tuần

- Calendar UI.
- Draft/review/approved.
- Đưa output từ skill vào calendar.
- Lưu asset theo chiến dịch.

### Sprint 6: Facebook publishing

Thời gian: 1 tuần

- Đăng bài Facebook.
- Hẹn giờ cơ bản.
- Theo dõi trạng thái publish.
- Liên kết bài đã đăng với performance.

### Sprint 7: Reporting

Thời gian: 1 tuần

- Báo cáo tuần tự động.
- AI insight.
- Action plan tuần tới.
- Export report.

### Sprint 8: Mở rộng kênh

Thời gian: 1 tuần

- Google Sheets sync.
- Website chat widget hoặc Zalo OA thử nghiệm.
- Notification lead nóng.

---

## 10. Kế Hoạch MVP Nhanh Nhất

Nếu muốn làm phiên bản có giá trị nhất trong 2 tuần, nên chọn 5 việc:

1. **Đăng nhập nội bộ**.
2. **Database lưu chat và inbox**.
3. **Trang kiểm tra kết nối Facebook/Gemini**.
4. **CRM mini cho Messenger**.
5. **Lưu output AI thành tài sản marketing**.

Lý do: 5 việc này không làm app "đẹp hơn" nhiều, nhưng làm app chuyển từ demo thành công cụ có thể dùng hằng ngày.

---

## 11. Rủi Ro Và Cách Giảm Rủi Ro

| Rủi ro | Mức độ | Cách xử lý |
|---|---|---|
| Token Facebook hết hạn/thiếu quyền | Cao | Trang health check, hướng dẫn refresh token, log lỗi rõ |
| AI trả lời sai về giá/chính sách | Cao | Co-pilot mặc định, guardrails, template được duyệt |
| Dữ liệu mất khi deploy/server restart | Cao | Chuyển memory/localStorage sang DB |
| Chi phí AI tăng | Trung bình | Rate limit, cache context, chọn model theo tác vụ |
| UI nhiều tính năng khó dùng | Trung bình | Gom theo workflow, ẩn tính năng nâng cao |
| Build/lint lỗi khi mở rộng | Trung bình | Dọn lint theo module, thêm test API quan trọng |
| Facebook/Zalo thay đổi API | Trung bình | Tách integration layer, log version API |

---

## 12. Đề Xuất Thứ Tự Làm Ngay

Nếu bắt đầu từ ngày 18/05/2026, thứ tự thực tế nên là:

Trạng thái cập nhật ngày 18/05/2026:

1. [x] **Tạo trang `/settings/integrations`** để kiểm tra Gemini/Facebook/Page ID/token.
2. [x] **Thêm đăng nhập đơn giản** bằng PIN hoặc Google OAuth.
3. [x] **Thêm database** và chuyển chat sessions từ localStorage sang DB.
4. [x] **Tạo bảng `customers` và `conversations`** cho Messenger.
5. [x] **Thêm AI summary + tag hội thoại**.
6. [x] **Lưu output AI** thành tài sản marketing.
7. [x] **Tạo Content Calendar**.
8. [x] **Tạo báo cáo tuần tự động**.

Ghi chú: các mục trên đã được triển khai ở mức MVP để dùng nội bộ local. Khi đưa lên production, nên thay file database cục bộ bằng database thật như Supabase/PostgreSQL và cấu hình `APP_LOGIN_PIN` riêng trong môi trường deploy.

Đây là thứ tự có ít phụ thuộc nhất và đem lại giá trị rõ nhất cho team marketing.

---

## 13. Kết Luận

Giai đoạn tiếp theo của NH Marketing AI nên ưu tiên **nền tảng dữ liệu, bảo mật và quy trình vận hành** trước khi thêm quá nhiều tính năng mới. Khi app đã có đăng nhập, database, CRM mini, lưu output và health check, các tính năng như Zalo, lịch đăng bài, báo cáo tự động hay báo giá AI sẽ dễ phát triển hơn và ít rủi ro hơn.

Trọng tâm không phải là "thêm thật nhiều AI", mà là biến AI thành một phần của quy trình marketing thật:

- Có dữ liệu đầu vào.
- Có người chịu trách nhiệm.
- Có output lưu lại.
- Có trạng thái duyệt.
- Có kết quả đo lường.
- Có cải tiến theo vòng lặp.

Nếu làm đúng thứ tự, dự án có thể trở thành hệ điều hành marketing nội bộ giúp Nhật Hàn tăng tốc sản xuất nội dung, phản hồi khách nhanh hơn, quản lý lead tốt hơn và ra quyết định marketing dựa trên dữ liệu thay vì cảm tính.
