# BÁO CÁO TỔNG QUAN DỰ ÁN — NH MARKETING AI

> **Đơn vị:** In Ấn Nhật Hàn
> **Ngày báo cáo:** 11/05/2026
> **Phiên bản:** 1.0
> **Trạng thái:** Đã hoàn thành Giai đoạn 1 — Sẵn sàng vận hành

---

## 1. MỤC TIÊU DỰ ÁN

Xây dựng một **hệ thống Marketing tự động hóa bằng AI** dành riêng cho xưởng In Ấn Nhật Hàn, giúp:

- Tự động hóa việc lập kế hoạch marketing, viết nội dung, kịch bản video, quảng cáo.
- Giảm thiểu sự phụ thuộc vào Agency bên ngoài.
- Đảm bảo mọi sản phẩm AI tạo ra đều **đúng ngữ cảnh** của ngành in ấn và thương hiệu Nhật Hàn.
- Cung cấp giao diện Web trực quan để nhân viên sử dụng mà không cần kiến thức kỹ thuật.

---

## 2. KIẾN TRÚC HỆ THỐNG

```
┌─────────────────────────────────────────────────────┐
│              NH MARKETING AI — WEB APP               │
│         (Next.js 16 + Tailwind CSS 4)                │
├──────────┬──────────┬──────────┬────────────────────┤
│Dashboard │Chiến lược│Thực thi  │ API Server         │
│(Tổng quan)│(29 Skills)│(Chat AI) │ (Google Gemini)    │
└──────────┴──────────┴──────────┴────────────────────┘
         │                              │
         ▼                              ▼
┌─────────────────┐          ┌─────────────────────┐
│  Product Context │          │   29 Marketing      │
│  (.agents/)      │          │   Skills (skills/)  │
│  Ngữ cảnh NH    │          │   Quy trình chuẩn   │
└─────────────────┘          └─────────────────────┘
```

### Công nghệ sử dụng

| Thành phần | Công nghệ | Phiên bản |
|:---|:---|:---|
| Framework Web | Next.js (App Router) | 16.2.6 |
| Ngôn ngữ | TypeScript | 5.x |
| Giao diện | Tailwind CSS | 4.x |
| AI Engine | Google Gemini | 2.5 Flash Lite |
| Icons | Lucide React | 1.14 |
| Animation | Framer Motion | 12.x |

---

## 3. CÁC CHỨC NĂNG CHÍNH

### 3.1. Dashboard — Bảng điều khiển tổng quan

| Tính năng | Mô tả |
|:---|:---|
| Thống kê nhanh | Hiển thị 4 chỉ số: Chiến dịch đang chạy, Năng suất AI, Thời gian tối ưu, Mục tiêu tháng |
| Khởi tạo nhanh | Nút "Bắt đầu ngay" để tạo kế hoạch marketing mới |
| Lịch sử gần đây | Danh sách các phiên làm việc gần nhất |
| Trạng thái AI | Hiển thị trạng thái kết nối với Google Gemini (Online/Offline) |

### 3.2. Thư viện 29 Kỹ năng Marketing (Skills)

Đây là **trái tim** của hệ thống. Mỗi Skill là một quy trình marketing chuyên sâu được AI tuân thủ khi thực thi.

| # | Tên Skill | Mô tả ngắn | Nhóm |
|:---|:---|:---|:---|
| 00 | Kế hoạch Marketing | Lập kế hoạch tổng thể: chiến lược, nội dung, triển khai, timeline | Chiến lược |
| 01 | Lịch nội dung | Lên lịch đăng bài theo tuần/tháng | Nội dung |
| 02 | Brief chiến dịch | Tạo brief cho chiến dịch quảng cáo | Chiến lược |
| 03 | Đánh giá hiệu suất | Phân tích hiệu quả marketing | Hiệu suất |
| 04 | Script Video | Viết kịch bản video TikTok, Reels, YouTube | Nội dung |
| 05 | Copy quảng cáo | Viết bài quảng cáo Facebook, Google Ads | Nội dung |
| 06 | Brief UGC/EGC | Hướng dẫn tạo nội dung từ người dùng/nhân viên | Nội dung |
| 07 | Báo cáo Marketing | Tạo báo cáo định kỳ cho ban lãnh đạo | Hiệu suất |
| 08 | Nghiên cứu đối thủ | Phân tích chiến lược của đối thủ cạnh tranh | Chiến lược |
| 09 | Insight khách hàng | Phân tích hành vi và nhu cầu khách hàng | Chiến lược |
| 10 | Tính KPI ngược | Tính toán KPI cần đạt dựa trên mục tiêu doanh thu | Hiệu suất |
| 11 | Thiết lập kênh | Hướng dẫn setup kênh marketing (Facebook, Zalo, Website) | Vận hành |
| 12 | Brief Landing Page | Tạo brief cho trang đích chuyển đổi | Nội dung |
| 13 | Phân tích dữ liệu | Đọc hiểu data marketing và đề xuất tối ưu | Hiệu suất |
| 14 | Email Marketing | Viết chuỗi email nurture, promo, onboarding | Nội dung |
| 15 | Social Listening | Theo dõi xu hướng và nhận xét trên mạng xã hội | Chiến lược |
| 16 | Tâm lý Marketing | Áp dụng nguyên tắc tâm lý vào chiến lược | Chiến lược |
| 17 | Chiến lược giá | Tư vấn định giá sản phẩm/dịch vụ | Chiến lược |
| 18 | Chương trình giới thiệu | Thiết kế chương trình referral | Vận hành |
| 19 | A/B Test Setup | Thiết lập thử nghiệm A/B cho quảng cáo | Hiệu suất |
| 20 | Brief Client Intake | Thu thập thông tin khách hàng mới (20 ngành) | Vận hành |
| 21 | Audit quảng cáo | Kiểm tra và tối ưu chiến dịch Ads đang chạy | Hiệu suất |
| 22 | Personal Brand Context | Xây dựng ngữ cảnh thương hiệu cá nhân | Cá nhân hóa |
| 23 | Personal Brand Strategy | Chiến lược thương hiệu cá nhân cho lãnh đạo | Cá nhân hóa |
| 24 | AI Avatar Production | Tạo hình ảnh đại diện AI cho thương hiệu | Cá nhân hóa |
| 25 | Voice Clone Podcast | Tạo podcast bằng giọng nói AI | Cá nhân hóa |
| 26 | Thought Leadership | Xây dựng nội dung tư duy lãnh đạo ngành | Cá nhân hóa |
| 27 | Personal Brand Monetize | Chiến lược kiếm tiền từ thương hiệu cá nhân | Cá nhân hóa |
| 28 | Community Building | Xây dựng cộng đồng khách hàng trung thành | Vận hành |

### 3.3. Giao diện Thực thi Skill (Chat AI)

| Tính năng | Mô tả |
|:---|:---|
| Chat thời gian thực | Gõ yêu cầu → AI phản hồi ngay lập tức theo dạng streaming |
| Tự động nạp ngữ cảnh | AI tự đọc file Product Context của Nhật Hàn trước khi trả lời |
| Tự động nạp Skill | AI tuân thủ quy trình chuyên môn của Skill đang chọn |
| Fallback thông minh | Nếu 1 model AI bị quá tải, tự động chuyển sang model khác |
| Thông báo lỗi rõ ràng | Hiển thị lỗi cụ thể thay vì im lặng khi gặp sự cố |
| Sao chép kết quả | Nút copy toàn bộ kết quả AI để dán vào tài liệu khác |

### 3.4. Product Marketing Context (Ngữ cảnh thương hiệu)

File cấu hình trung tâm chứa toàn bộ thông tin về Nhật Hàn để AI luôn "nhớ" mình đang phục vụ ai:

- Tổng quan sản phẩm/dịch vụ
- Tệp khách hàng mục tiêu (B2B: F&B, Mỹ phẩm, Thời trang, Điện tử)
- Chân dung khách hàng (Persona)
- Nỗi đau & Vấn đề của khách
- Đối thủ cạnh tranh
- Điểm khác biệt (USP)
- Brand Voice & Tone

### 3.5. Kế hoạch Fanpage Facebook

Tài liệu chi tiết hướng dẫn thiết lập Fanpage Facebook cho Nhật Hàn, bao gồm:

- Lộ trình 4 giai đoạn (Tạo → Tối ưu → Tích hợp → Nội dung 30 ngày)
- Phân tích lựa chọn tên Page (2 phương án)
- Nội dung Bio, About, bài đăng mẫu
- Checklist chất lượng trước khi Go-live

---

## 4. GIAO DIỆN NGƯỜI DÙNG

### Thiết kế UI/UX

| Đặc điểm | Chi tiết |
|:---|:---|
| Phong cách | Dark Mode cao cấp với hiệu ứng Glassmorphism |
| Sidebar | Điều hướng 6 nhóm chức năng chính |
| Responsive | Tương thích Desktop, Tablet |
| Font chữ | Inter (Google Fonts) — hiện đại, dễ đọc |
| Màu chủ đạo | Gradient xanh dương - tím (chuyên nghiệp, công nghệ) |

### Các trang chính

| Trang | URL | Chức năng |
|:---|:---|:---|
| Dashboard | `/` | Bảng điều khiển tổng quan |
| Chiến lược | `/strategy` | Danh sách 29 Skills, tìm kiếm, lọc |
| Thực thi Skill | `/skills/[id]` | Chat với AI để thực thi từng Skill cụ thể |

---

## 5. LUỒNG HOẠT ĐỘNG

```
Người dùng mở Dashboard
        │
        ▼
Chọn "Chiến lược" trên Sidebar
        │
        ▼
Xem danh sách 29 Skills → Chọn 1 Skill (VD: "04-script-video")
        │
        ▼
Mở giao diện Chat AI
        │
        ▼
Nhập yêu cầu: "Viết kịch bản TikTok 30s về in bao bì chuẩn màu"
        │
        ▼
Hệ thống tự động:
  1. Đọc file Product Context (thông tin Nhật Hàn)
  2. Đọc file SKILL.md (quy trình viết kịch bản)
  3. Gửi tất cả đến Google Gemini AI
        │
        ▼
AI trả về kịch bản chuyên nghiệp, streaming từng chữ trên màn hình
        │
        ▼
Người dùng sao chép kết quả → Sử dụng trong công việc thực tế
```

---

## 6. THÀNH PHẦN DỰ ÁN

| Thành phần | Số lượng | Mô tả |
|:---|:---:|:---|
| Marketing Skills | 29 | Quy trình marketing chuyên sâu |
| Web Pages | 3 | Dashboard, Strategy, Skill Execution |
| API Endpoints | 3 | `/api/chat`, `/api/skills`, `/api/skills/[id]` |
| Components | 3 | Sidebar, SkillCard, Layout |
| Config Files | 2 | Product Context, Brand Voice |
| Tài liệu kế hoạch | 2 | Facebook Page Plan, Web Development Plan |

---

## 7. ĐÁNH GIÁ & HƯỚNG PHÁT TRIỂN

### Đã hoàn thành (Giai đoạn 1)
- ✅ Hệ thống Web App với giao diện chuyên nghiệp
- ✅ Tích hợp AI (Google Gemini) hoạt động ổn định
- ✅ 29 Marketing Skills sẵn sàng sử dụng
- ✅ Cơ chế fallback thông minh (tự chuyển model khi quá tải)
- ✅ Product Context đầy đủ cho ngành In ấn Nhật Hàn
- ✅ Kế hoạch Fanpage Facebook chi tiết

### Đề xuất phát triển tiếp (Giai đoạn 2)
- 🔲 Lưu trữ lịch sử chat (Database)
- 🔲 Xuất kết quả ra PDF/Word
- 🔲 Tích hợp đăng bài trực tiếp lên Facebook
- 🔲 Quản lý nhiều tài khoản người dùng (phân quyền)
- 🔲 Dashboard thống kê thực tế (kết nối Google Analytics, Meta Ads)
- 🔲 Tích hợp Zalo OA API
- 🔲 Mobile App (React Native)

---

> **Người thực hiện:** Bộ phận IT & Marketing — In Ấn Nhật Hàn
> **Công cụ hỗ trợ phát triển:** AI Coding Assistant
> **Thời gian triển khai Giai đoạn 1:** ~2 ngày
