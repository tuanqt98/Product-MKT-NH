# 🚀 Lộ trình Phát triển Dự án Đời Buồn JQK - Hệ thống Marketing AI NH

> Cập nhật lần cuối: 12/05/2026 (Kích hoạt Hệ thống Tự động hóa)

---

## ✅ ĐÃ HOÀN THÀNH

### Giai đoạn 0 — Nền tảng
- [x] Hệ thống AI Chat tích hợp 29 Marketing Skills
- [x] Giao diện Dark Mode cao cấp (Glassmorphism, Tailwind 4)
- [x] Tích hợp Google Gemini 2.5 Flash (model mới nhất)
- [x] Cơ chế fallback tự động giữa các model AI
- [x] Deploy thành công trên Vercel (product-mkt-nh.vercel.app)
- [x] Đồng bộ GitHub (tuanqt98/Product-MKT-NH)

### Giai đoạn 1 — Tối ưu trải nghiệm
- [x] Markdown Renderer (bảng, heading, code block, danh sách)
- [x] Xuất PDF với format chuyên nghiệp (logo NH, timestamp)
- [x] Copy từng tin nhắn (hover to reveal)
- [x] Lưu lịch sử chat tự động (localStorage)
- [x] Nút xóa lịch sử
- [x] Upload hình ảnh + AI phân tích (multimodal Gemini)

---

## 🔜 CHƯA THỰC HIỆN

### Giai đoạn 2 — Nâng cao UX (Độ khó: ⭐⭐)

| # | Tính năng | Mô tả | Công nghệ |
|---|-----------|-------|-----------|
| 2.1 | **Đăng nhập / Phân quyền** | Bảo vệ hệ thống, chỉ nhân viên NH truy cập | NextAuth.js + Google OAuth hoặc PIN đơn giản |
| 2.2 | ~~**Quản lý cuộc hội thoại**~~ | ✅ Đã hoàn thành — Sidebar lịch sử, nhiều session, đổi tên | localStorage → Multiple Sessions |
| 2.3 | **Multi-language output** | AI trả kết quả song ngữ Việt-Anh cho khách quốc tế | Prompt engineering |
| 2.4 | ~~**Gợi ý prompt thông minh**~~ | ✅ Đã hoàn thành — 20+ skills có gợi ý riêng | Đọc SKILL.md + parse |
| 2.5 | ~~**Chế độ so sánh**~~ | ✅ Đã hoàn thành — Split-view A/B testing nội dung | UI split-view + Variation API |

---

### Giai đoạn 3 — Tích hợp kênh Social (Độ khó: ⭐⭐⭐)

| # | Tính năng | Mô tả | Công nghệ |
|---|-----------|-------|-----------|
| 3.1 | ~~**Kết nối Facebook Graph API**~~ | ✅ Đã cấu hình Page ID & Token chuẩn — Nút đăng bài trực tiếp | Facebook Graph API v19 |
| 3.2 | ~~**Dashboard chỉ số Facebook**~~ | ✅ Đã cấu hình dữ liệu thật từ Fanpage Nhật Hàn | Chart.js/Recharts + Facebook Insights API |
| 3.3 | **Kết nối Zalo OA** | Gửi tin nhắn ZNS tự động cho khách hàng | Zalo OA API |
| 3.4 | **Lập lịch đăng bài** | Hẹn giờ đăng nội dung lên Facebook/Zalo | Cron job (Vercel Cron) |
| 3.5 | **Quản lý tin nhắn Messenger** | Đọc/trả lời tin nhắn Fanpage ngay trên NH AI | Facebook Webhook |

---

### Giai đoạn 4 — AI nâng cao (Độ khó: ⭐⭐⭐⭐)

| # | Tính năng | Mô tả | Công nghệ |
|---|-----------|-------|-----------|
| 4.1 | **Chatbot tự động Fanpage** | AI trả lời tin nhắn khách hàng 24/7 trên Messenger | Facebook Webhook + Gemini |
| 4.2 | **Tạo ảnh bằng AI** | AI sinh hình banner, poster quảng cáo | Google Imagen / DALL-E |
| 4.3 | **Voice-to-text** | Nhân viên nói → AI chuyển thành nội dung marketing | Web Speech API |
| 4.4 | **AI đề xuất chiến lược** | Dựa trên dữ liệu bán hàng, AI tự đề xuất chiến dịch | RAG + Vector DB |
| 4.5 | **Phân tích video TikTok** | Upload video → AI phân tích hiệu quả & đề xuất cải thiện | Gemini multimodal |

---

### Giai đoạn 5 — Hệ sinh thái (Độ khó: ⭐⭐⭐⭐⭐)

| # | Tính năng | Mô tả | Công nghệ |
|---|-----------|-------|-----------|
| 5.1 | **CRM Mini** | Quản lý khách hàng + lịch sử đơn hàng | Supabase / PostgreSQL |
| 5.2 | **Báo cáo tự động hàng tuần** | AI tổng hợp số liệu và gửi email báo cáo | Resend + Cron |
| 5.3 | **Tích hợp Google Sheets** | Đồng bộ dữ liệu chiến dịch vào bảng tính | Google Sheets API |
| 5.4 | **Landing Page Builder** | AI tạo landing page từ brief (drag & drop) | React DnD + Gemini |
| 5.5 | **Mobile App (PWA)** | Biến web thành ứng dụng cài trên điện thoại | Next.js PWA |
| 5.6 | **Tích hợp ERP Nhật Hàn** | Kết nối với hệ thống quản lý sản xuất hiện tại | REST API bridge |

---

### Giai đoạn 6 — Marketing Intelligence (Mới cập nhật 🚀)

| # | Tính năng | Mô tả | Công nghệ |
|---|-----------|-------|-----------|
| 6.1 | **Viral Trend Spy** | AI quét xu hướng thiết kế & content ngành In (Pinterest, FB) | Web Search + LLM |
| 6.2 | **AI Design Insight** | Phân tích lý do mẫu thiết kế thành công và gợi ý áp dụng | Gemini Vision |
| 6.3 | **Daily Trend Alert** | Thông báo xu hướng mới mỗi sáng trên Dashboard | Cron + Dashboard |

---

## 🚀 GIAI ĐOẠN 2: HỆ SINH THÁI MARKETING THÔNG MINH (VISION 2025)

*Phần này tập trung vào việc biến dữ liệu thành doanh thu và tự động hóa toàn diện quy trình bán hàng.*

### 7. AI CRM & Lead Scoring (Quản trị khách hàng thông minh)
| ID | Tính năng | Mô tả chi tiết | Công nghệ |
|:---:|:---:|:---:|:---:|
| 7.1 | **Auto-Labeling** | AI tự động gắn thẻ khách hàng (VIP, Hỏi giá, Đang phàn nàn, Khách cũ) dựa trên hội thoại | NLP Classifier |
| 7.2 | **Lead Scoring** | Chấm điểm tiềm năng mua hàng của khách để ưu tiên Admin tư vấn trước | AI Analysis |
| 7.3 | **Customer Persona** | Tự động xây dựng hồ sơ sở thích khách hàng để gợi ý mẫu in phù hợp | Big Data |

### 8. AI Commerce Automation (Tự động hóa bán hàng)
| ID | Tính năng | Mô tả chi tiết | Công nghệ |
|:---:|:---:|:---:|:---:|
| 8.1 | **Smart Order Extraction** | AI tự bóc tách Tên, SĐT, Địa chỉ, Loại sản phẩm in từ tin nhắn để tạo đơn hàng nháp | Gemini Extraction |
| 8.2 | **AI Price Advisor** | AI tự tính toán báo giá dựa trên kích thước, số lượng và chất liệu khách yêu cầu | Logic Engine |
| 8.3 | **Inventory Sync** | Tự động kiểm tra tồn kho vật liệu in khi khách hỏi đặt hàng | ERP Integration |

### 9. Multi-Platform Growth (Mở rộng đa kênh)
| ID | Tính năng | Mô tả chi tiết | Công nghệ |
|:---:|:---:|:---:|:---:|
| 9.1 | **Zalo OA Integration** | Đồng bộ tin nhắn và AI Auto-reply sang cả Zalo Official Account | Zalo API |
| 9.2 | **TikTok Shop Spy** | Theo dõi các sản phẩm in ấn đang bán chạy nhất trên TikTok Shop | Web Scraper |
| 9.3 | **Unified Inbox** | Một hộp thư duy nhất quản lý cả FB, Zalo, Web Chat | WebSocket |

### 10. AI Creative Studio 2.0 (Nâng cấp sáng tạo)
| ID | Tính năng | Mô tả chi tiết | Công nghệ |
|:---:|:---:|:---:|:---:|
| 10.1| **Mockup Generator** | Tự động áp ảnh thiết kế lên các phối cảnh thật (Cốc, Áo, Túi bóng, Hộp cứng) | AI Image Gen |
| 10.2| **AI Video Ads** | Tự tạo video ngắn giới thiệu sản phẩm in ấn từ 1 tấm ảnh duy nhất | Video AI |

---

## 📋 THỨ TỰ ƯU TIÊN ĐỀ XUẤT

```
Tiếp theo nên làm:
┌─────────────────────────────────────────────────┐
│ 1. [2.4] Gợi ý prompt thông minh               │ ← Nhanh, tác động lớn
│ 2. [2.1] Đăng nhập / Phân quyền                │ ← Bảo mật
│ 3. [2.2] Quản lý cuộc hội thoại                │ ← Tiện dụng
│ 4. [3.2] Dashboard chỉ số Facebook             │ ← Wow factor
│ 5. [3.1] Kết nối Facebook đăng bài             │ ← Tự động hóa
│ 6. [5.5] Mobile App (PWA)                       │ ← Dùng trên điện thoại
└─────────────────────────────────────────────────┘
```

---

## 🛠️ HƯỚNG DẪN SỬ DỤNG FILE NÀY

Khi bạn muốn bắt đầu một tính năng mới, chỉ cần nói:
> "Làm tính năng 2.4" hoặc "Làm gợi ý prompt thông minh"

Tôi sẽ tự động:
1. Đọc mô tả từ file này
2. Nghiên cứu codebase hiện tại
3. Viết code
4. Build + Test
5. Push lên GitHub → Vercel tự deploy

---

*Được tạo bởi NH Marketing AI Development Team*
