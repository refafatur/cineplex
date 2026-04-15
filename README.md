# Cineplex - Premium Cinema Booking System

![Cineplex Logo](ui/public/logo.png) (Jika file logo ada di path ini)

Cineplex adalah platform pemesanan tiket bioskop modern yang dibangun menggunakan **Laravel** sebagai API Backend dan **Next.js** sebagai Frontend. Aplikasi ini dirancang untuk memberikan pengalaman pemesanan tiket yang mulus bagi pelanggan dan sistem manajemen yang kuat bagi admin bioskop.

## 🚀 Fitur Utama

### 👤 Untuk Pelanggan
- **Katalog Film**: Menjelajahi film 'Now Showing' dan 'Coming Soon'.
- **Pemesanan Kursi**: Antarmuka interaktif untuk memilih kursi bioskop secara real-time.
- **My Bookings**: Riwayat pemesanan tiket dan status pembayaran.

### 🛡️ Untuk Admin & Kasir
- **Dashboard Analytics**: Statistik visual tren pendapatan per bulan (Jan-Des), total film, dan pengguna.
- **Manajemen Pengguna**: CRUD lengkap untuk mengelola Admin, Kasir, dan Pelanggan.
- **Manajemen Film & Jadwal**: Mengelola katalog film dan jadwal tayang di setiap studio.
- **Konfirmasi Pembayaran**: Kasir dapat memvalidasi pembayaran tiket pelanggan.

## 🛠️ Tech Stack

### Backend (API)
- **Framework**: Laravel 11+
- **Database**: MySQL
- **Authentication**: Laravel Sanctum (Token based)
- **Architecture**: RESTful API

### Frontend (UI)
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4.0
- **Icons**: Lucide React
- **Fonts**: Geist Sans (Premium Look)

## 📦 Instalasi

### 1. Prasyarat
- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL

### 2. Setup Backend (API)
```bash
cd api
composer install
cp .env.example .env
php artisan key:generate
# Sesuaikan pengaturan DB di .env
php artisan migrate --seed
php artisan serve
```

### 3. Setup Frontend (UI)
```bash
cd ui
npm install
# Buat file .env.local dan isi: NEXT_PUBLIC_API_URL=http://localhost:8000/api
npm run dev
```

## 🎨 Design Aesthetics
Project ini menggunakan tema **Dark Cinematic** dengan sentuhan warna merah khas bioskop mewah. UI dilengkapi dengan:
- **Custom Pop-ups**: Untuk konfirmasi hapus dan interaksi formulir.
- **Toast Notifications**: Notifikasi sukses yang elegan dan non-intrusif.
- **Sticky Sidebar**: Navigasi admin yang tetap (fix) untuk akses cepat.

## 📄 Lisensi
[MIT License](LICENSE)
