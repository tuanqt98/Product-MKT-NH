# HƯỚNG DẪN DEPLOY NH MARKETING AI LÊN VERCEL

Để đưa hệ thống lên mạng cho nhiều người dùng, bạn hãy làm theo các bước sau:

## 1. Chuẩn bị Tài khoản
- Đảm bảo bạn đã có tài khoản [Vercel](https://vercel.com) (nên kết nối với GitHub/GitLab/Bitbucket).
- Đẩy toàn bộ mã nguồn hiện tại lên một Repository (kho lưu trữ) trên GitHub.

## 2. Cấu hình trên giao diện Vercel
Khi chọn "Import" project trên Vercel, hãy thiết lập các thông số sau:

- **Framework Preset:** Next.js
- **Root Directory:** `./` (Để trống hoặc chọn thư mục gốc của toàn bộ dự án, không phải chỉ thư mục `web`)
- **Build Command:** `cd web && npm install && npm run build`
- **Output Directory:** `web/.next`
- **Install Command:** `cd web && npm install`

## 3. Cấu hình biến môi trường (Environment Variables)
Đây là phần QUAN TRỌNG NHẤT. Bạn cần thêm biến sau vào mục **Environment Variables** trên Vercel:

| Key | Value |
|:---|:---|
| `GOOGLE_GENERATIVE_AI_API_KEY` | `AIzaSyDp_dLf3CR9ySFADw8gd_qfxRnJrqpiAVg` |

## 4. Lưu ý về cấu trúc tệp
Hệ thống AI của chúng ta cần đọc dữ liệu từ thư mục `.agents` và `skills`. Do cấu trúc hiện tại nằm ngoài thư mục code web, Vercel cần được cấu hình để "đóng gói" cả các thư mục này.

Tôi đã tạo sẵn file `vercel.json` ở thư mục gốc để xử lý việc này tự động cho bạn.

## 5. Các bước thực hiện cụ thể
1. Mở Terminal tại thư mục dự án.
2. Nếu bạn dùng Vercel CLI, chỉ cần gõ: `vercel`.
3. Nếu dùng giao diện Web, hãy kết nối GitHub và chọn repo này.
4. Điền các thông số ở Bước 2 và Bước 3.
5. Nhấn **Deploy**.

Sau khi hoàn tất, bạn sẽ nhận được một đường dẫn (ví dụ: `nh-marketing-ai.vercel.app`) để gửi cho sếp và đồng nghiệp sử dụng!
