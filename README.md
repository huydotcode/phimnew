# 🎬 PhimNew - Website Xem Phim Trực Tuyến

Chào mừng bạn đến với **PhimNew** - nền tảng xem phim trực tuyến miễn phí với giao diện hiện đại, tốc độ tải nhanh và trải nghiệm người dùng mượt mà.

🌐 **Truy cập ngay**: [https://phimnew.vercel.app](https://phimnew.vercel.app)

---

## 📋 Mục Lục

- [Tính Năng](#-tính-năng)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Cài Đặt](#-cài-đặt)
- [Cấu Hình](#-cấu-hình)
- [Scripts](#-scripts)
- [Tính Năng Chi Tiết](#-tính-năng-chi-tiết)
- [Kiến Trúc](#-kiến-trúc)

---

## 🚀 Tính Năng

### 👤 Dành cho Người Dùng

- 🎥 **Xem Phim Trực Tuyến**

  - Xem phim lẻ và phim bộ
  - Video player với iframe embed
  - Chọn tập phim dễ dàng
  - Lưu lịch sử xem tự động

- 🔍 **Tìm Kiếm & Lọc Nâng Cao**

  - Tìm kiếm phim theo tên
  - Lọc theo thể loại, quốc gia, năm phát hành, loại phim
  - Sắp xếp theo lượt xem, năm, mới nhất
  - Pagination với infinite scroll

- 📚 **Quản Lý Phim Cá Nhân**

  - Danh sách phim yêu thích
  - Phim đã lưu để xem sau
  - Lịch sử xem phim
  - Dashboard cá nhân

- 💬 **Tương Tác & Đánh Giá**

  - Bình luận và đánh giá phim
  - Like/Unlike bình luận
  - Gợi ý phim thông minh dựa trên lịch sử xem

- 🏠 **Trang Chủ Phong Phú**
  - Banner phim nổi bật
  - Phim thịnh hành, mới nhất
  - Phim theo quốc gia (Việt Nam, Hàn Quốc, Mỹ)
  - Phim lẻ/bộ mới ra
  - Thể loại phim phổ biến

### 👨‍💼 Dành cho Admin

- 📊 **Dashboard Thống Kê**

  - Tổng quan số liệu (phim, người dùng, lượt xem)
  - Biểu đồ thống kê với Recharts
  - Phân tích phim theo thể loại, quốc gia, năm
  - Quản lý phản hồi người dùng

- 🎬 **Quản Lý Nội Dung**
  - CRUD phim (thêm, sửa, xóa, xem)
  - Quản lý thể loại phim
  - Quản lý quốc gia
  - Quản lý người dùng

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend

- **React 19** - UI framework
- **Vite 6** - Build tool và dev server
- **React Router 7** - Routing
- **Redux Toolkit** - State management
- **React Query (TanStack Query)** - Data fetching & caching
- **TailwindCSS 4** - Styling
- **Ant Design** - UI component library
- **Framer Motion** - Animations
- **Sonner** - Toast notifications
- **Recharts** - Data visualization (Admin)
- **React Hook Form** - Form handling
- **Swiper** - Carousel/Slider

### Backend & Services

- **Firebase Authentication** - Xác thực người dùng (Email/Password, Google)
- **Cloud Firestore** - NoSQL database
- **Firebase Storage** - File storage
- **Firebase Remote Config** - Remote configuration

### API Bên Ngoài

- **OPhim API** - Lấy thông tin phim và tập phim

### Deployment

- **Vercel** - Hosting và CI/CD

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 📁 Cấu Trúc Dự Án

```
phimnew/
├── public/                 # Static assets
├── src/
│   ├── app/               # Firebase config, Redux store
│   │   ├── firebase.js
│   │   ├── firebase_upload.js
│   │   └── store.js
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Base UI components
│   │   └── ...
│   ├── constants/         # Constants (nav links, filters)
│   ├── context/          # React Context providers
│   │   └── AuthProvider.jsx
│   ├── data/             # Static data
│   ├── features/         # Redux slices & thunks
│   │   └── movies/
│   ├── hooks/            # Custom React hooks
│   ├── layouts/          # Layout components
│   ├── pages/            # Page components
│   │   ├── admin/       # Admin pages
│   │   └── ...          # User pages
│   ├── routes/           # Route configuration
│   ├── services/         # API service functions
│   ├── styles/           # CSS files
│   └── utils/            # Utility functions
├── dist/                  # Build output
├── package.json
├── vite.config.js
├── eslint.config.js
└── vercel.json
```

---

## ⚙️ Cài Đặt

### Yêu Cầu

- Node.js >= 18.x
- npm hoặc yarn

### Các Bước Cài Đặt

1. **Clone repository**

```bash
git clone https://github.com/huydotcode/phimnew
cd phimnew
```

2. **Cài đặt dependencies**

```bash
npm install
```

3. **Cấu hình biến môi trường**

Tạo file `.env` từ `example.env` và điền thông tin Firebase của bạn:

```bash
cp example.env .env
```

4. **Chạy project**

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

---

## 🔧 Cấu Hình

### Firebase Setup

1. Tạo project mới trên [Firebase Console](https://console.firebase.google.com/)
2. Bật các services:
   - Authentication (Email/Password, Google)
   - Firestore Database
   - Storage
   - Remote Config
3. Copy thông tin config vào file `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Firestore Collections

Dự án sử dụng các collections sau:

- `movies` - Danh sách phim
- `users` - Thông tin người dùng
- `comments` - Bình luận phim
- `categories` - Thể loại phim
- `countries` - Quốc gia
- `watched_movies` - Lịch sử xem
- `feedback` - Phản hồi người dùng

---

## 📜 Scripts

```bash
# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview production build
npm run preview

# Chạy linter
npm run lint

# Chạy Firebase emulators (nếu có)
npm run emulators
```

---

## 🎯 Tính Năng Chi Tiết

### Xác Thực Người Dùng

- Đăng ký/Đăng nhập với Email & Password
- Đăng nhập với Google
- Quên mật khẩu
- Protected routes (yêu cầu đăng nhập)
- Role-based access (User/Admin)

### Quản Lý Phim

- Lưu phim vào danh sách yêu thích
- Lưu phim để xem sau
- Tự động lưu lịch sử xem
- Gợi ý phim dựa trên thể loại đã xem

### Tìm Kiếm & Lọc

- Tìm kiếm real-time
- Lọc kết hợp nhiều tiêu chí
- Sắp xếp linh hoạt
- Pagination hiệu quả

### Admin Dashboard

- Thống kê tổng quan với biểu đồ
- Phân tích xu hướng xem phim
- Quản lý nội dung tập trung
- Xem và xử lý phản hồi

---

## 🏗️ Kiến Trúc

### State Management

- **Redux Toolkit**: Quản lý state cho saved/favorite/watched movies
- **React Query**: Data fetching, caching, và synchronization
- **React Context**: Authentication state

### Routing

- **Public Routes**: Trang chủ, xem phim, tìm kiếm
- **Protected Routes**: Dashboard, quản lý phim cá nhân
- **Admin Routes**: Quản lý admin (yêu cầu role admin)

### Performance Optimization

- Lazy loading components
- Code splitting với Vite
- Intersection Observer cho lazy loading
- React Query caching
- Optimistic updates

### UI/UX

- Responsive design (Mobile-first)
- Dark theme
- Smooth animations với Framer Motion
- Loading states và error handling
- Toast notifications

---

## 📝 Ghi Chú

- Dự án sử dụng API từ OPhim để lấy thông tin phim
- Firebase Remote Config được sử dụng để điều khiển app từ xa (có thể tắt app để bảo trì)
- Tất cả routes đều yêu cầu đăng nhập (trừ `/login`)

---

## 👨‍💻 Tác Giả

**Huy Do** - [ngonhuthuy1234@gmail.com](mailto:ngonhuthuy1234@gmail.com)

---

## 📄 License

Dự án này là mã nguồn mở và có sẵn dưới [MIT License](LICENSE).

---

## 🙏 Cảm Ơn

Cảm ơn bạn đã quan tâm đến dự án PhimNew! Nếu có bất kỳ câu hỏi hoặc đề xuất nào, vui lòng tạo issue trên GitHub.
