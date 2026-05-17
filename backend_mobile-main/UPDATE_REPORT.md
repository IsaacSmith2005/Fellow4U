# Báo cáo Cập nhật Backend VIU

Dựa trên tài liệu phân tích thiết kế cơ sở dữ liệu, tôi đã thực hiện các thay đổi và bổ sung sau đây cho dự án backend:

## 1. Cập nhật và Chuẩn hóa Models
Tôi đã cập nhật các model hiện có và tạo mới các model còn thiếu để đảm bảo đầy đủ tính năng theo thiết kế:

| Nhóm tính năng | Các Models đã thực hiện | Ghi chú |
| :--- | :--- | :--- |
| **Người dùng** | `User`, `GuideProfile` | Đổi role sang `traveler`/`guide`, thêm các trường thông tin cá nhân. |
| **Tour & Địa điểm** | `Tour`, `Place`, `TourSchedule` | Tách biệt Tour và Địa điểm, hỗ trợ lịch trình chi tiết. |
| **Chuyến đi & Đấu thầu** | `Trip`, `TripOffer`, `TripDestination` | Hỗ trợ luồng khách tạo yêu cầu và hướng dẫn viên gửi báo giá. |
| **Tương tác** | `Conversation`, `Message`, `Blog`, `Comment`, `Review` | Hệ thống chat, blog cộng đồng và đánh giá dịch vụ. |
| **Tiện ích** | `Notification`, `Payment`, `Wishlist` | Thông báo đẩy, lịch sử thanh toán và danh sách yêu thích. |

## 2. Cập nhật Controllers & Routes
- **Auth Controller**: Cập nhật logic đăng ký để hỗ trợ các trường mới và mặc định role là `traveler`.
- **Controllers mới**: Đã tạo các controller cơ bản cho `Place`, `Tour`, `Trip`, và `Blog`.
- **Routes mới**: Đã đăng ký các endpoint tương ứng trong `src/app.js`.

## 3. Cấu trúc Thư mục
- Đã dọn dẹp các file cũ (`FellowProfile`, `Package`) và thay thế bằng các tên gọi chuẩn theo thiết kế (`GuideProfile`, `Tour`).
- Cập nhật `src/app.js` để tích hợp toàn bộ hệ thống route mới.

## 4. Hướng dẫn tiếp theo
- **Biến môi trường**: Đảm bảo file `.env` của bạn có đầy đủ `MONGO_URI`, `JWT_SECRET`, và `JWT_EXPIRE`.
- **Database**: Do có sự thay đổi về cấu trúc model (đặc biệt là Role), bạn nên clear database cũ hoặc cập nhật lại các bản ghi hiện có để tránh lỗi logic.
