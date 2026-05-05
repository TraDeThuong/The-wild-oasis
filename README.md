# The Wild Oasis

Link: https://tra-the-wild-oasis.netlify.app


## Mô tả dự án

The Wild Oasis là một ứng dụng web quản lý resort/khách sạn được xây dựng bằng React.js. Ứng dụng cho phép quản lý đặt phòng, cabin, khách hàng, và các chức năng quản trị khác. Đây là dự án học tập từ khóa học React trên Udemy.

## Tính năng chính

- **Xác thực người dùng**: Đăng nhập, đăng ký, cập nhật thông tin cá nhân
- **Quản lý cabin**: Thêm, sửa, xóa cabin; xem danh sách cabin
- **Quản lý đặt phòng**: Xem danh sách booking, chi tiết booking, check-in/check-out
- **Dashboard**: Thống kê tổng quan về doanh thu, khách hàng, v.v.
- **Cài đặt**: Cấu hình ứng dụng
- **Giao diện tối/sáng**: Chế độ dark mode
- **Responsive**: Tương thích với các thiết bị

## Công nghệ sử dụng

- **Frontend**: React.js, Vite
- **Styling**: Styled Components
- **State Management**: React Query (TanStack Query)
- **Backend/Database**: Supabase
- **Authentication**: Supabase Auth
- **UI Components**: Custom UI components
- **Routing**: React Router
- **Linting**: ESLint
- **Build Tool**: Vite

## Cài đặt

1. Clone repository:

   ```bash
   git clone <repository-url>
   cd the-wild-oasis
   ```

2. Cài đặt dependencies:

   ```bash
   npm install
   ```

3. Thiết lập biến môi trường:
   Tạo file `.env.local` và thêm các biến môi trường cần thiết cho Supabase.

4. Chạy ứng dụng:

   ```bash
   npm run dev
   ```

5. Mở trình duyệt và truy cập `http://localhost:5173`

## Cấu trúc dự án

```
src/
├── assets/          # Tài nguyên tĩnh
├── context/         # React Context (Dark Mode)
├── data/            # Dữ liệu mẫu và uploader
├── features/        # Các tính năng chính (auth, bookings, cabins, etc.)
├── hooks/           # Custom hooks
├── pages/           # Các trang chính
├── services/        # API services (Supabase)
├── styles/          # Global styles
├── ui/              # UI components
└── utils/           # Helper functions và constants
```

