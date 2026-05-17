# Fellow4U Backend API

Hệ thống Backend cho ứng dụng Fellow4U được xây dựng bằng Node.js, Express và MongoDB.

## Tính năng chính
- Xác thực người dùng (JWT)
- Quản lý hồ sơ Fellow
- Đặt lịch chuyến đi (Trip)
- Phân quyền người dùng (User/Fellow)
- Xử lý lỗi tập trung

## Cấu trúc thư mục
```
backend_api/
├── server.js           # Entry point
├── src/
│   ├── app.js          # Express config
│   ├── config/         # Database & system config
│   ├── controllers/    # Business logic
│   ├── models/         # Database schemas
│   ├── routes/         # API endpoints
│   ├── middlewares/    # Custom middlewares (Auth, Error)
│   └── utils/          # Helper functions
└── .env.example        # Environment variables template
```

## Hướng dẫn cài đặt

1. Cài đặt dependencies:
   ```bash
   npm install
   ```

2. Cấu hình biến môi trường:
   - Sao chép `.env.example` thành `.env`
   - Cập nhật các giá trị trong `.env` (MONGODB_URI, JWT_SECRET, v.v.)

3. Chạy ứng dụng:
   - Chế độ phát triển (với nodemon): `npm run dev`
   - Chế độ production: `npm start`

## API Endpoints chính
- `POST /api/v1/auth/register`: Đăng ký tài khoản
- `POST /api/v1/auth/login`: Đăng nhập
- `GET /api/v1/fellows`: Lấy danh sách Fellow
- `POST /api/v1/trips`: Tạo yêu cầu chuyến đi
