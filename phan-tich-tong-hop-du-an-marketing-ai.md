# Phân Tích Tổng Hợp Dự Án - NH Marketing AI

> Ngày tổng hợp: 18/05/2026  
> Dự án: NH Marketing AI / Marketing OS cho In Ấn Nhật Hàn  
> Mục tiêu file: Tóm tắt tính năng, giá trị cho người làm marketing, ưu điểm và cách ứng dụng thực tế.

---

## 1. Tóm Tắt Ngắn Gọn

NH Marketing AI là một hệ thống web app dùng AI để hỗ trợ đội ngũ marketing của Nhật Hàn trong các việc: lập chiến lược, viết nội dung, tạo kịch bản video, viết copy quảng cáo, phân tích hiệu suất, quản lý inbox Facebook, theo dõi insight Fanpage, phát hiện xu hướng và tạo tài sản thiết kế nhanh.

Khác với việc dùng ChatGPT/Gemini theo cách hỏi đáp tự do, dự án này đóng gói tri thức marketing thành các **skill chuyên môn**. Mỗi skill là một quy trình làm việc rõ ràng, có đầu vào, cấu trúc đầu ra, checklist chất lượng và ngữ cảnh riêng của Nhật Hàn. Nhờ vậy AI không chỉ "trả lời hay" mà có thể đóng vai trò như một trợ lý marketing nội bộ biết làm việc theo quy trình.

Tính đến hiện tại, hệ thống có **30 skill marketing** và nhiều module vận hành quanh chúng:

- Thư viện skill AI cho chiến lược, nội dung, ads, performance, personal brand và export B2B.
- Chat AI theo từng skill, có streaming, có so sánh A/B và có xuất PDF.
- Product Marketing Context giúp AI luôn hiểu sản phẩm, khách hàng, USP và brand voice của Nhật Hàn.
- Dashboard tổng quan, Facebook Insights, Radar xu hướng, AI Design Studio.
- Hộp thư Messenger và Smart AI Auto-Reply cho chăm sóc khách hàng.

---

## 2. Định Vị Dự Án

Có thể hiểu dự án như một **Marketing Operating System** nội bộ:

| Góc nhìn | Ý nghĩa |
|---|---|
| Với marketer | Trợ lý thực thi công việc marketing hằng ngày |
| Với trưởng phòng marketing | Hệ thống chuẩn hóa quy trình, giảm phụ thuộc vào kinh nghiệm cá nhân |
| Với doanh nghiệp | Tài sản tri thức nội bộ: mỗi lần làm marketing đều dựa trên cùng một context và framework |
| Với sale/chăm sóc khách hàng | Công cụ trả lời inbox, lấy insight và tạo nội dung bán hàng nhanh hơn |

Dự án phù hợp với doanh nghiệp vừa và nhỏ có đội ngũ marketing gọn, cần sản xuất nhiều đầu việc nhưng chưa muốn phụ thuộc hoàn toàn vào agency bên ngoài.

---

## 3. Các Nhóm Tính Năng Chính

### 3.1. Dashboard Marketing

Dashboard là màn hình tổng quan khi đăng nhập vào hệ thống.

Tính năng chính:

- Hiển thị các chỉ số nhanh từ Facebook Insights: lượt tiếp cận, tương tác, lượt xem trang, follower mới.
- Gợi ý các skill nên dùng trong ngày.
- Điều hướng nhanh đến thư viện AI, tài liệu hướng dẫn và các module quan trọng.
- Hiển thị trạng thái AI đang sẵn sàng.

Giá trị cho marketer:

- Không cần mở nhiều công cụ riêng lẻ để xem tổng quan.
- Biết nhanh kênh Facebook đang có tín hiệu gì.
- Có điểm bắt đầu rõ ràng mỗi khi vào làm việc.

---

### 3.2. Thư Viện 30 Skill AI

Đây là phần quan trọng nhất của dự án. Mỗi skill là một quy trình marketing được viết thành file `SKILL.md`, để AI đọc và làm đúng theo chuẩn.

Bảng nhóm skill:

| Nhóm | Skill tiêu biểu | Việc giải quyết |
|---|---|---|
| Chiến lược | 00 Kế hoạch MKT, 02 Brief chiến dịch, 08 Nghiên cứu đối thủ, 09 Insight khách hàng, 16 Tâm lý marketing, 17 Pricing, 29 Xuất khẩu B2B | Định hướng thị trường, kế hoạch, định vị, go-to-market |
| Nội dung | 01 Lịch nội dung, 04 Script video, 05 Copy quảng cáo, 06 Brief UGC/EGC, 12 Brief landing page, 24 AI Avatar, 25 Voice Clone, 26 Thought Leadership | Sản xuất nội dung đa định dạng |
| Hiệu suất | 03 Đánh giá hiệu suất, 07 Báo cáo marketing, 10 KPI ngược, 13 Phân tích dữ liệu, 19 A/B test, 21 Audit ads | Đo lường, chẩn đoán, tối ưu |
| Vận hành | 11 Thiết lập kênh, 14 Email marketing, 18 Referral program, 20 Brief client intake, 28 Community building | Xây quy trình và kênh marketing |
| Personal Brand | 22 Context, 23 Strategy, 24 Avatar, 25 Voice, 26 Thought Leadership, 27 Monetize, 28 Community | Xây thương hiệu cá nhân cho founder/leader |
| Export B2B | 29 Xuất khẩu B2B | Hồ sơ nhà xuất khẩu, email buyer quốc tế, hội chợ, phân tích giá cạnh tranh |

Giá trị cho marketer:

- Không phải bắt đầu từ trang trắng.
- Có sẵn khung làm việc cho các nhiệm vụ thường gặp.
- Kết quả đầu ra có format rõ: bảng, checklist, action plan, timeline, KPI.
- Marketer mới vào team vẫn có thể làm theo quy trình như người có kinh nghiệm.

---

### 3.3. Chat AI Theo Skill

Khi chọn một skill, người dùng vào màn chat riêng của skill đó.

Tính năng chính:

- AI tự đọc `Product Marketing Context` của Nhật Hàn.
- AI tự đọc nội dung skill đang chọn.
- Trả lời dạng streaming, thấy kết quả hiện ra từng phần.
- Hỗ trợ upload hình ảnh để AI phân tích ảnh và đưa góp ý marketing.
- Cơ chế so sánh A/B: cùng một yêu cầu, AI tạo hai phương án khác nhau để marketer chọn.
- Lưu lịch sử hội thoại bằng localStorage theo từng skill.
- Xuất PDF từ nội dung AI tạo ra.

Giá trị cho marketer:

- Tạo được sản phẩm đầu ra ngay trong một màn hình: plan, script, copy, báo cáo, brief.
- Dễ so sánh nhiều hướng sáng tạo thay vì chỉ nhận một đáp án.
- Giảm thời gian chuyển qua lại giữa prompt, tài liệu và file mẫu.

---

### 3.4. Product Marketing Context

Product Marketing Context là file nền tảng lưu thông tin của Nhật Hàn:

- Sản phẩm/dịch vụ.
- Khách hàng mục tiêu.
- Persona.
- Nỗi đau, nhu cầu, hành vi.
- Đối thủ.
- USP và điểm khác biệt.
- Brand voice.
- Thông điệp và góc nội dung nên dùng.

Giá trị cho marketer:

- AI không bị trả lời chung chung.
- Mọi output đều gắn với ngành in ấn, bao bì và tình huống kinh doanh của Nhật Hàn.
- Giảm việc phải nhắc lại thông tin công ty mỗi lần dùng AI.
- Giúp thông điệp marketing nhất quán hơn giữa các kênh.

---

### 3.5. Facebook Insights

Module Facebook Insights lấy dữ liệu từ Facebook Graph API nếu đã cấu hình token.

Tính năng chính:

- Hiển thị reach, engagement, page views, new fans.
- Biểu đồ tăng trưởng theo thời gian.
- Phân tích nhóm khách hàng theo tuổi/giới tính.
- Xem khu vực trọng điểm.
- Gợi ý thời điểm đăng bài.
- Hiển thị phân tích nội dung Fanpage.

Giá trị cho marketer:

- Biết Fanpage đang tăng hay giảm.
- Nhận diện thời điểm đăng bài tốt.
- Có cơ sở để tối ưu lịch nội dung và góc nội dung.
- Giảm việc xem thủ công trên Meta Business Suite.

---

### 3.6. Radar Xu Hướng

Radar xu hướng là module gợi ý các trend về thiết kế, bao bì, ấn phẩm marketing và công nghệ in.

Tính năng chính:

- Mỗi ngày chọn ra nhóm trend từ pool có sẵn.
- Mỗi trend có ảnh minh họa, điểm nóng, lý do hot và gợi ý ứng dụng cho Nhật Hàn.
- Có nút chuyển nhanh sang skill `04-script-video` để biến trend thành kịch bản video.
- Có modal chi tiết kỹ thuật: vật liệu, gia công, màu sắc CMYK, gợi ý ứng dụng.

Giá trị cho marketer:

- Có nguồn ý tưởng nhanh cho content và video.
- Biến xu hướng thiết kế thành góc bán hàng cụ thể.
- Rút ngắn khoảng cách từ "thấy trend" đến "có kịch bản triển khai".

---

### 3.7. AI Design Studio

AI Design Studio hỗ trợ tạo tài sản hình ảnh marketing nhanh.

Tính năng chính:

- Upload ảnh sản phẩm.
- Tách nền bằng background removal.
- Chọn template nền: trong suốt, studio, luxury, neon, clean.
- Thêm text marketing lên banner.
- Điều chỉnh vị trí, tỷ lệ sản phẩm.
- Tải ảnh kết quả về máy.

Giá trị cho marketer:

- Tạo banner demo nhanh mà không cần mở Photoshop.
- Phù hợp để làm concept, post social, thumbnail, mockup ý tưởng.
- Giảm thời gian chuẩn bị visual nhập liệu cho các chiến dịch nhỏ.

---

### 3.8. Smart AI Messenger / Auto-Reply

Đây là module hỗ trợ quản lý inbox Facebook Messenger.

Tính năng chính:

- Đồng bộ danh sách hội thoại từ Facebook Page.
- Xem chi tiết tin nhắn khách hàng.
- Gửi tin nhắn từ giao diện nội bộ.
- AI tự tạo phản hồi ngắn gọn theo context của Nhật Hàn.
- Có hai chế độ:
  - Full-Auto: AI tự gửi phản hồi.
  - Co-pilot: AI chỉ gợi ý, nhân sự duyệt trước khi gửi.
- Có cơ chế tạm dừng AI khi admin/người thật can thiệp.
- Cấu hình thời gian tạm dừng, khung giờ hoạt động và lời chào.

Giá trị cho marketer:

- Phản hồi khách hàng nhanh hơn, nhất là ngoài giờ hành chính.
- Giảm bỏ sót inbox.
- Giữ chất lượng câu trả lời nhất quán.
- Phù hợp cho giai đoạn có nhiều lead hỏi giá, hỏi sản phẩm, hỏi tiến độ.

Lưu ý vận hành:

- Cần cấu hình `FACEBOOK_PAGE_ACCESS_TOKEN`, `FACEBOOK_PAGE_ID` và `GOOGLE_GENERATIVE_AI_API_KEY`.
- Nên dùng chế độ Co-pilot trong giai đoạn đầu để kiểm soát chất lượng.
- Dữ liệu hội thoại trong MVP đang dựa nhiều vào state/local file, khi lên production nên chuyển sang database.

---

### 3.9. Các Trang Theo Chuyên Môn

Hệ thống tách các trang theo việc marketer hay làm:

| Trang | Vai trò |
|---|---|
| `/skills` | Thư viện tất cả skill |
| `/content` | Lọc các skill về nội dung |
| `/video` | Lọc skill video/script |
| `/ads` | Lọc skill quảng cáo/brief/audit |
| `/personal-brand` | Lọc skill thương hiệu cá nhân |
| `/strategy/facebook-insights` | Theo dõi Fanpage |
| `/strategy/trend-spy` | Tìm ý tưởng và xu hướng |
| `/content/ai-studio` | Tạo visual/banner nhanh |
| `/messaging` | Quản lý inbox |
| `/settings/messaging` | Cấu hình AI Auto-Reply |

Giá trị cho marketer:

- Không cần nhớ tên skill.
- Vào đúng nhóm công việc là có công cụ liên quan.
- Phù hợp cho người không có nền tảng kỹ thuật.

---

## 4. Dự Án Giúp Gì Cho Một Người Làm Marketing?

### 4.1. Giúp lập kế hoạch nhanh hơn

Marketer có thể dùng skill `00-ke-hoach-mkt`, `02-brief-chien-dich`, `10-tinh-kpi-nguoc` để tạo:

- Kế hoạch marketing tổng thể.
- Kế hoạch campaign.
- KPI theo doanh thu mục tiêu.
- Phân bổ ngân sách.
- Timeline thực thi.
- RACI và risk matrix.

Thay vì mất nhiều giờ lập khung, marketer có sẵn một bản nháp có cấu trúc để sửa và triển khai.

### 4.2. Giúp sản xuất nội dung đều hơn

Hệ thống hỗ trợ:

- Lịch nội dung hằng tháng.
- Script TikTok/Reels/Shorts.
- Copy quảng cáo theo phễu TOFU/MOFU/BOFU.
- Brief UGC/EGC cho creator, nhân viên, khách hàng.
- Bài thought leadership cho founder/leader.

Kết quả là team có thể tạo content liên tục mà vẫn giữ chất lượng và đúng brand voice.

### 4.3. Giúp tối ưu quảng cáo có hệ thống

Thay vì nhìn số liệu rồi cảm tính, marketer có các skill:

- Đánh giá hiệu suất chiến dịch.
- Audit ads 84 checkpoints.
- A/B test setup.
- Phân tích dữ liệu.
- Báo cáo marketing đọc trong 5 phút.

AI không chỉ nói "nên tối ưu" mà đưa ra việc cần làm, mức độ ưu tiên, thời hạn và cách đo kết quả.

### 4.4. Giúp chăm sóc khách hàng nhanh hơn

Smart AI Messenger giúp marketer và CSKH:

- Trả lời tin nhắn nhanh.
- Gợi ý câu trả lời đúng tone.
- Tự động hỏi thêm thông số khi khách hỏi giá.
- Tạm dừng AI khi nhân sự đã vào chat.

Điều này đặc biệt hữu ích với doanh nghiệp in ấn, nơi khách thường hỏi nhanh về giá, chất liệu, kích thước, số lượng và tiến độ.

### 4.5. Giúp tìm ý tưởng và biến trend thành hành động

Radar xu hướng giúp marketer:

- Lấy ý tưởng content mới.
- Tìm góc khai thác cho bao bì, thiết kế, kỹ thuật in.
- Tạo script video từ trend chỉ trong một luồng thao tác.

Đây là điểm mạnh với ngành cần visual và case study như in ấn, bao bì.

### 4.6. Giúp xây thương hiệu cá nhân

Cụm skill personal brand giúp founder/leader:

- Định vị thương hiệu cá nhân.
- Xây lịch nội dung chuyên gia.
- Tạo AI avatar, voice clone, podcast.
- Chuyển đổi ảnh hưởng thành lead, doanh thu hoặc cộng đồng.

Với B2B, personal brand của founder/leader có thể giúp tăng trust và rút ngắn chu kỳ bán hàng.

### 4.7. Giúp mở rộng sang B2B xuất khẩu

Skill `29-xuat-khau-b2b` hỗ trợ:

- Tạo export context.
- Viết company profile tiếng Anh.
- Viết cold email, warm email, follow-up email cho buyer quốc tế.
- Lập kế hoạch hội chợ.
- Phân tích giá cạnh tranh theo thị trường.

Giá trị là marketer có thể chuẩn bị tài liệu và gói tiếp cận thị trường quốc tế có cấu trúc, thay vì viết từ đầu.

---

## 5. Ưu Điểm Nổi Bật Của Dự Án

### 5.1. Có ngữ cảnh riêng của doanh nghiệp

Phần lớn công cụ AI trả lời tốt nhưng thiếu ngữ cảnh. Dự án này có Product Marketing Context, nên AI luôn biết mình đang làm cho Nhật Hàn, ngành in ấn/bao bì, khách hàng B2B và brand voice cụ thể.

### 5.2. Chuẩn hóa quy trình marketing

Skill không chỉ là prompt. Mỗi skill là một framework làm việc:

- Cần hỏi thông tin gì.
- Cần phân tích gì.
- Output phải có cấu trúc nào.
- Checklist chất lượng là gì.
- Liên kết với skill nào tiếp theo.

Điều này biến AI thành công cụ vận hành, không chỉ là công cụ viết chữ.

### 5.3. Bao phủ gần như toàn bộ vòng đời marketing

Hệ thống không chỉ làm một việc đơn lẻ. Nó bao phủ:

1. Nghiên cứu thị trường.
2. Hiểu khách hàng.
3. Lập kế hoạch.
4. Sản xuất nội dung.
5. Chạy ads.
6. Đo lường và báo cáo.
7. Tối ưu.
8. Chăm sóc inbox.
9. Xây thương hiệu cá nhân.
10. Mở rộng export B2B.

### 5.4. Tăng tốc độ thực thi

Những việc mất 2-4 giờ có thể rút xuống 15-30 phút:

- Soạn campaign brief.
- Lên content calendar.
- Viết 6 biến thể ad copy.
- Tạo kịch bản video.
- Lập báo cáo marketing.
- Tạo email chào hàng.
- Tạo banner concept.

### 5.5. Phù hợp cho team marketing nhỏ

Một marketer có thể đóng nhiều vai trò hơn:

- Planner.
- Content writer.
- Ads analyst.
- Social media executive.
- CSKH có AI hỗ trợ.
- Personal brand assistant.

Hệ thống giúp team nhỏ có "bộ não quy trình" như một team lớn.

### 5.6. Có giao diện riêng, dễ dùng hơn file prompt rời rạc

Thay vì copy prompt từ file này sang file khác, người dùng có:

- Sidebar.
- Thư viện skill.
- Trang lọc theo nhóm công việc.
- Chat riêng theo skill.
- Lịch sử hội thoại.
- Nút xuất PDF.
- Trang cài đặt AI Messenger.

Điều này giúp người không kỹ thuật vẫn dùng được.

### 5.7. Có khả năng mở rộng

Cấu trúc skill folder giúp bổ sung tính năng mới khá đơn giản:

- Thêm skill mới bằng folder `web/skills/[so]-[ten]/SKILL.md`.
- Thêm reference file dùng chung.
- Thêm UI card nếu cần hiển thị đẹp hơn.
- Thêm API/chat logic nếu skill cần công cụ riêng.

Việc vừa thêm `29-xuat-khau-b2b` cho thấy dự án có thể mở rộng theo nhu cầu kinh doanh mới.

---

## 6. Ví Dụ Luồng Làm Việc Thực Tế

### Luồng 1: Tạo chiến dịch quảng cáo mới

1. Dùng `08-nghien-cuu-doi-thu` để xem đối thủ đang nói gì.
2. Dùng `09-insight-khach-hang` để xác định persona và pain point.
3. Dùng `02-brief-chien-dich` để tạo brief.
4. Dùng `05-copy-quang-cao` để tạo copy theo funnel.
5. Dùng `04-script-video` để tạo video ads.
6. Dùng `19-ab-test-setup` để lập test.
7. Dùng `03-danh-gia-hieu-suat` hoặc `21-audit-ads-performance` để tối ưu sau khi chạy.

### Luồng 2: Tạo content từ xu hướng

1. Vào Radar Xu hướng.
2. Chọn trend phù hợp với in ấn/bao bì.
3. Bấm lên kịch bản video.
4. AI đưa trend sang skill `04-script-video`.
5. Marketer nhận script và quay/dựng video.

### Luồng 3: Chăm sóc lead từ Facebook

1. Khách nhắn tin vào Fanpage.
2. Hộp thư đồng bộ hội thoại.
3. AI gợi ý câu trả lời hoặc tự trả lời nếu bật Full-Auto.
4. Nếu admin vào chat, AI tạm dừng.
5. Marketer theo dõi hội thoại và chốt thông tin báo giá.

### Luồng 4: Chuẩn bị tiếp cận buyer quốc tế

1. Chạy skill `29-xuat-khau-b2b`.
2. Tạo export context cho sản phẩm.
3. Tạo company profile tiếng Anh.
4. Viết cold email và follow-up.
5. Lập danh sách buyer và kế hoạch hội chợ.
6. Theo dõi phản hồi và tiếp tục nurture qua email.

---

## 7. Điểm Cần Lưu Ý Khi Vận Hành

Hệ thống đã có nhiều module hữu ích, nhưng để dùng ổn định trong môi trường thật cần chú ý:

| Hạng mục | Lưu ý |
|---|---|
| API key AI | Cần `GOOGLE_GENERATIVE_AI_API_KEY` để chat AI và auto-reply hoạt động |
| Facebook | Cần `FACEBOOK_PAGE_ACCESS_TOKEN` và `FACEBOOK_PAGE_ID` đúng quyền |
| Auto-reply | Nên bật Co-pilot trước, sau khi kiểm soát chất lượng mới dùng Full-Auto |
| Lưu trữ | Một số phần đang dùng localStorage/memory/file JSON; production nên dùng database |
| Bảo mật | Không để token/API key trong code; dùng environment variables |
| Kiểm thử | Cần test với dữ liệu thật của Fanpage, tin nhắn khách và campaign ads |
| Nội dung AI | AI cần người duyệt với các nội dung liên quan giá, cam kết, chính sách và pháp lý |

---

## 8. Kết Luận

NH Marketing AI là một dự án có giá trị thực dụng cao cho một người làm marketing, vì nó gồm cả **tri thức marketing**, **công cụ thực thi**, **giao diện dùng hằng ngày** và **ngữ cảnh riêng của doanh nghiệp**.

Điểm mạnh lớn nhất của dự án không nằm ở việc "có AI", mà nằm ở việc AI được đặt vào một hệ thống quy trình:

- Marketer biết nên làm gì tiếp.
- AI biết phải làm theo framework nào.
- Output có cấu trúc để dùng ngay.
- Context giúp nội dung không bị chung chung.
- Các module phụ trợ giúp nối liền từ chiến lược đến vận hành.

Nếu tiếp tục hoàn thiện database, phân quyền, kết nối Facebook/Ads/Analytics thực tế và quy trình duyệt nội dung, dự án có thể trở thành hệ điều hành marketing nội bộ giúp Nhật Hàn giảm thời gian sản xuất, tăng tốc độ phản hồi khách hàng và nâng chất lượng ra quyết định marketing.
