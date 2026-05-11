# Kế hoạch phát triển Hệ thống "NH Marketing AI"

> Dự án: Chuyển đổi bộ Framework Marketing Skills thành ứng dụng Web chuyên dụng cho Nhật Hàn.
> Mục tiêu: Tự động hóa quy trình Marketing, tối ưu hóa thời gian và quản lý tri thức doanh nghiệp.

---

## 1. Kiến trúc hệ thống (System Architecture)

### 1.1. Tầng Giao diện (Frontend)
- **Framework:** Next.js 14+ (App Router) để tối ưu tốc độ và SEO.
- **Styling:** Tailwind CSS + Shadcn/UI (Giao diện hiện đại, tối giản, chuyên nghiệp).
- **State Management:** React Query (để quản lý dữ liệu từ AI API).

### 1.2. Tầng Xử lý (Backend & AI)
- **Backend:** Node.js (tích hợp trực tiếp trong Next.js).
- **AI Orchestration:** LangChain hoặc Vercel AI SDK để quản lý luồng hội thoại và tích hợp các kỹ năng (Skills).
- **AI Models:** 
    - Chính: Claude 3.5 Sonnet (Dành cho lập kế hoạch và viết nội dung chất lượng cao).
    - Phụ: GPT-4o (Dành cho phân tích dữ liệu và tính toán số liệu).

### 1.3. Tầng Dữ liệu (Data)
- **Database:** PostgreSQL (Supabase) để lưu trữ hồ sơ thương hiệu, lịch sử kế hoạch và người dùng.
- **File Storage:** Lưu trữ các mẫu thiết kế bao bì, logo công ty.

---

## 2. Các module chức năng chính

### Module 1: Dashboard "Marketing Command Center"
- Hiển thị tổng quan các chiến dịch đang chạy.
- Truy cập nhanh vào 5 nhóm kỹ năng: Chiến lược, Nội dung, Quảng cáo, Vận hành, Thương hiệu cá nhân.

### Module 2: Brand Context Manager (Hồ sơ thương hiệu)
- Giao diện trực quan để cập nhật thông tin xưởng in, sản phẩm, đối thủ (thay thế việc sửa file Markdown thủ công).
- AI tự động gợi ý cập nhật hồ sơ dựa trên các tin nhắn mới của người dùng.

### Module 3: Skill Executor (Bộ máy thực thi kỹ năng)
- Người dùng chọn một Skill (ví dụ: Viết kịch bản video).
- Web hiện ra các Form nhập liệu thông minh (không cần chat dài dòng).
- AI trả về kết quả định dạng Markdown, Bảng biểu, hoặc biểu đồ.

### Module 4: Output & Integration
- Xuất bản kế hoạch ra file PDF chuyên nghiệp để trình ký.
- Kết nối Facebook API để lên lịch bài đăng trực tiếp từ Web.
- Gửi báo cáo báo giá tự động qua Zalo cho khách hàng.

---

## 3. Lộ trình phát triển (8 tuần)

### Giai đoạn 1: MVP (Tuần 1-3) - "Lõi AI"
- Thiết lập dự án, kết nối API AI.
- Xây dựng module đọc 29 kỹ năng từ hệ thống Markdown hiện có.
- Hoàn thiện trang quản lý Ngữ cảnh sản phẩm Nhật Hàn.

### Giai đoạn 2: UI/UX (Tuần 4-6) - "Trải nghiệm người dùng"
- Xây dựng Dashboard và các Form nhập liệu cho từng nhóm kỹ năng.
- Triển khai giao diện Chat thông minh tích hợp sẵn ngữ cảnh công ty.
- Thử nghiệm thực tế với 5 kỹ năng quan trọng nhất (Kế hoạch, Nội dung, Ads).

### Giai đoạn 3: Scale & Automate (Tuần 7-8) - "Tự động hóa"
- Tích hợp tính năng xuất file PDF.
- Kết nối thử nghiệm với Facebook/Zalo API.
- Đào tạo nhân viên marketing Nhật Hàn sử dụng hệ thống.

---

## 4. Ngân sách dự kiến (Vận hành)

- **API Costs:** Ước tính 50$ - 200$/tháng (Nếu dùng Claude/GPT bản trả phí).
- **Server Hosting:** 20$ - 50$/tháng (Vercel/AWS).
- **Maintenance:** Cập nhật kỹ năng mới theo biến động thị trường Việt Nam.

---

## 5. Phương án tối ưu chi phí (Low-cost & Free)

Để tiết kiệm ngân sách trong giai đoạn đầu, dự án có thể áp dụng các phương án sau:

### 5.1. Sử dụng Google Gemini API (Gói Free)
- **Cơ chế:** Dùng bản Free của Gemini 1.5 Flash.
- **Chi phí:** 0đ.
- **Phù hợp:** Giai đoạn phát triển (Development) và thử nghiệm tính năng.

### 5.2. Sử dụng DeepSeek API (Gói siêu rẻ)
- **Cơ chế:** Model DeepSeek-V3 có chi phí thấp hơn 10-20 lần so với GPT-4o.
- **Đặc điểm:** Tư duy logic cực tốt, hỗ trợ tiếng Việt mạnh mẽ.
- **Chi phí:** Khoảng 1-2$/tháng cho nhu cầu trung bình.

### 5.3. Chiến lược Hybrid (Kết hợp)
- Dùng **Gemini Flash (Free)** cho các task đơn giản (viết bài social, trả lời bình luận).
- Dùng **Claude 3.5 (Paid)** cho các task quan trọng (lập chiến lược, viết kế hoạch kinh doanh).
- => Cách này giúp giảm 70% chi phí API mà vẫn đảm bảo chất lượng cao nhất.

---
*Bản kế hoạch được lập bởi AI Assistant (Antigravity) dựa trên thực trạng dự án Nhật Hàn.*
