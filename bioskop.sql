-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 15 Apr 2026 pada 13.35
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bioskop`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `bookings`
--

CREATE TABLE `bookings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `booking_code` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `schedule_id` bigint(20) UNSIGNED NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('pending','paid','cancelled') NOT NULL DEFAULT 'pending',
  `payment_method` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `bookings`
--

INSERT INTO `bookings` (`id`, `booking_code`, `user_id`, `schedule_id`, `total_price`, `status`, `payment_method`, `created_at`, `updated_at`) VALUES
(2, NULL, 1, 1, 200000.00, 'paid', 'online', '2026-04-07 06:35:17', '2026-04-07 06:35:17'),
(3, NULL, 2, 2, 140000.00, 'paid', 'cash', '2026-04-09 08:14:49', '2026-04-09 08:14:49'),
(4, NULL, 2, 1, 100000.00, 'paid', 'cash', '2026-04-09 08:23:47', '2026-04-09 08:23:47'),
(5, NULL, 2, 1, 100000.00, 'paid', 'cash', '2026-04-09 08:27:57', '2026-04-09 08:27:57'),
(9, 'CPX-04FA1654', 2, 2, 105000.00, 'paid', 'cash', '2026-04-11 11:44:55', '2026-04-11 11:44:55');

-- --------------------------------------------------------

--
-- Struktur dari tabel `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_04_06_141922_create_movies_table', 1),
(5, '2026_04_06_141923_create_studios_table', 1),
(6, '2026_04_06_141924_create_schedules_table', 1),
(7, '2026_04_06_141925_create_seats_table', 1),
(8, '2026_04_06_141927_create_bookings_table', 1),
(9, '2026_04_06_141928_create_tickets_table', 1),
(10, '2026_04_06_143438_create_personal_access_tokens_table', 1),
(11, '2026_04_06_161155_add_thumbnail_to_movies_table', 2),
(12, '2026_04_06_171254_add_trailer_to_movies_table', 3),
(13, '2026_04_09_153044_add_booking_code_to_bookings_table', 4);

-- --------------------------------------------------------

--
-- Struktur dari tabel `movies`
--

CREATE TABLE `movies` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `poster` varchar(255) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `trailer` varchar(255) DEFAULT NULL,
  `duration_minutes` int(11) NOT NULL,
  `status` enum('showing','coming_soon') NOT NULL DEFAULT 'showing',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `movies`
--

INSERT INTO `movies` (`id`, `title`, `description`, `poster`, `thumbnail`, `trailer`, `duration_minutes`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Jujutsu Kaisen Calling Game Part 1', 'Di tengah keramaian Halloween, sebuah tirai misterius tiba-tiba menutup kawasan Stasiun Shibuya, menjebak banyak warga sipil. Penyihir terkuat era modern, Gojo Satoru, memasuki lokasi seorang diri, tapi para pengguna kutukan dan roh terkutuk telah menunggu untuk menyegelnya. Sementara Itadori Yuji dan para penyihir jujutsu lainnya berkumpul di Shibuya, bentrokan kutukan terbesar sepanjang sejarah pun pecah: Insiden Shibuya. Pasca tragedi tersebut, kekacauan berlanjut ke permainan saling membunuh yang dirancang oleh penyihir terburuk dalam sejarah, Kamo Kenjaku, Culling Game. Sepuluh koloni penghalang berubah menjadi medan neraka, dan di tengahnya, penyihir kelas khusus Okkotsu Yuta muncul sebagai algojo hukuman mati Itadori. Kutukan kian menggila. Dua murid dari guru yang sama pun berhadapan dalam pertarungan maut.', 'http://localhost:8000/storage/posters/pCWR7N7nbb8cTSYSS6B7xQK1JCGlX2XLi1g0f01u.jpg', 'http://localhost:8000/storage/thumbnails/CZ36HJ19BJFfj8ybH6IgDUigjoQrs6Ru1iEuoKKO.jpg', 'http://localhost:8000/storage/trailers/baZH8HGBCdOhehWBx0AWE7XtfqAQiRxjy5AzkcAB.mp4', 120, 'showing', NULL, '2026-04-06 10:55:14'),
(2, 'Demon Slayer: Kimetsu no Yaiba Infinity Castle', NULL, 'http://localhost:8000/storage/posters/lBS0oYbp9mdokGVwdndhE0qz4h1yqvd74g4yEiMm.jpg', 'http://localhost:8000/storage/thumbnails/PHCR9TvsbtjbIyMuv23vOHYyZJAyGJjXtW0rVrgJ.jpg', 'http://localhost:8000/storage/trailers/wh11qXHiYpGnYMSmO0OZxW3yDlOGR1ztLyna2CRb.mp4', 120, 'showing', NULL, '2026-04-07 06:26:03'),
(3, 'Attack On Titan', NULL, 'http://localhost:8000/storage/posters/4ZkU9hcSiD4BVJfbEA2hfKH4eDp6YnMLtzYkUm1c.jpg', NULL, NULL, 94, 'coming_soon', NULL, '2026-04-14 00:43:23'),
(4, 'One Piece', 'One Piece menceritakan tentang petualangan seorang anak bernama Monkey D. Luffy yang bercita-cita menjadi raja bajak laut dan menemukan \"One Piece\" setelah terinspirasi oleh Shanks. Sekitar 22 tahun sebelum cerita dimulai, seorang bajak laut bernama Gol D. Roger, atau lebih dikenal sebagai raja bajak laut dieksekusi mati di depan publik. Tepat sebelum kematiannya, ia mengumumkan kepada orang banyak tentang harta miliknya, One Piece, yang diklaim sebagai harta terbesar yang pernah ada.  Kematian Roger memicu dimulainya era \"Zaman Keemasan Bajak Laut\", ditandai turunnya banyak bajak laut hingga tak terhitung jumlahnya mencari harta karun. Luffy termasuk salah satu yang berniat menemukan One Piece dan menjadi raja bajak laut berikutnya, turun ke laut untuk memulai petualangannya serta mulai mengumpulkan beberapa kru sebagai teman seperjalanan.  Setelah perjalanan panjang, Monkey D. Luffy dan kru Topi Jerami akhirnya tiba di Elbaf, negeri para raksasa yang selama ini mereka tuju. Di balik kedamaian dan kejayaannya, pulau ini menyimpan sejarah besar serta misteri yang berkaitan dengan masa lalu dunia. Ketika ancaman baru mulai muncul dan keseimbangan Elbaf terguncang, kru Topi Jerami terlibat dalam konflik yang jauh lebih besar dari sekadar petualangan biasa. Di tengah benturan kekuatan dan terungkapnya rahasia kuno, perjalanan mereka pun makin mendekati kebenaran dunia.', 'http://localhost:8000/storage/posters/ERq1gNFD0G3bp2nR7GuNbC0qFAumbo5576IXLwkj.jpg', 'http://localhost:8000/storage/thumbnails/zc5UOgQSD7YI6U0VUzZS34mcveJI79N0FO8KyhcM.jpg', 'http://localhost:8000/storage/trailers/gYazHgn8ykfinDfDI9v138sn5SMBqRGpigTbbLtO.mp4', 120, 'showing', '2026-04-06 08:38:56', '2026-04-06 10:32:41');

-- --------------------------------------------------------

--
-- Struktur dari tabel `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 4, 'auth_token', '59e903939fe3a525355672136a630275057593b5fb4ca82b0ec0d1cf62104558', '[\"*\"]', NULL, NULL, '2026-04-06 08:14:06', '2026-04-06 08:14:06'),
(10, 'App\\Models\\User', 5, 'auth_token', 'b1bf62ed107db9c490998f3af6c8415365ca992de94c48397b6748a1e76fc502', '[\"*\"]', '2026-04-06 10:02:22', NULL, '2026-04-06 10:00:38', '2026-04-06 10:02:22'),
(25, 'App\\Models\\User', 5, 'auth_token', 'cc1d0f7c425c7bad65da10a52f0886b2e3ad03d2a90db1736e3ca05fceb1384c', '[\"*\"]', '2026-04-15 04:25:03', NULL, '2026-04-15 04:18:33', '2026-04-15 04:25:03');

-- --------------------------------------------------------

--
-- Struktur dari tabel `schedules`
--

CREATE TABLE `schedules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `movie_id` bigint(20) UNSIGNED NOT NULL,
  `studio_id` bigint(20) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `schedules`
--

INSERT INTO `schedules` (`id`, `movie_id`, `studio_id`, `date`, `start_time`, `end_time`, `price`, `created_at`, `updated_at`) VALUES
(1, 4, 2, '2026-04-25', '11:00:00', '13:00:00', 50000.00, '2026-04-06 08:42:02', '2026-04-06 08:42:02'),
(2, 1, 3, '2026-04-09', '13:00:00', '15:00:00', 35000.00, '2026-04-06 09:50:53', '2026-04-06 09:50:53');

-- --------------------------------------------------------

--
-- Struktur dari tabel `seats`
--

CREATE TABLE `seats` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `studio_id` bigint(20) UNSIGNED NOT NULL,
  `row` varchar(255) NOT NULL,
  `number` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `seats`
--

INSERT INTO `seats` (`id`, `studio_id`, `row`, `number`, `created_at`, `updated_at`) VALUES
(1, 2, 'A', 1, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(2, 2, 'A', 2, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(3, 2, 'A', 3, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(4, 2, 'A', 4, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(5, 2, 'A', 5, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(6, 2, 'A', 6, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(7, 2, 'A', 7, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(8, 2, 'A', 8, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(9, 2, 'A', 9, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(10, 2, 'A', 10, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(11, 2, 'B', 1, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(12, 2, 'B', 2, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(13, 2, 'B', 3, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(14, 2, 'B', 4, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(15, 2, 'B', 5, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(16, 2, 'B', 6, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(17, 2, 'B', 7, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(18, 2, 'B', 8, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(19, 2, 'B', 9, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(20, 2, 'B', 10, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(21, 2, 'C', 1, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(22, 2, 'C', 2, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(23, 2, 'C', 3, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(24, 2, 'C', 4, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(25, 2, 'C', 5, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(26, 2, 'C', 6, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(27, 2, 'C', 7, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(28, 2, 'C', 8, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(29, 2, 'C', 9, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(30, 2, 'C', 10, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(31, 2, 'D', 1, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(32, 2, 'D', 2, '2026-04-06 08:39:30', '2026-04-06 08:39:30'),
(33, 2, 'D', 3, '2026-04-06 08:39:31', '2026-04-06 08:39:31'),
(34, 2, 'D', 4, '2026-04-06 08:39:31', '2026-04-06 08:39:31'),
(35, 2, 'D', 5, '2026-04-06 08:39:31', '2026-04-06 08:39:31'),
(36, 2, 'D', 6, '2026-04-06 08:39:31', '2026-04-06 08:39:31'),
(37, 2, 'D', 7, '2026-04-06 08:39:31', '2026-04-06 08:39:31'),
(38, 2, 'D', 8, '2026-04-06 08:39:31', '2026-04-06 08:39:31'),
(39, 2, 'D', 9, '2026-04-06 08:39:31', '2026-04-06 08:39:31'),
(40, 2, 'D', 10, '2026-04-06 08:39:31', '2026-04-06 08:39:31'),
(41, 2, 'E', 1, '2026-04-06 08:39:31', '2026-04-06 08:39:31'),
(42, 2, 'E', 2, '2026-04-06 08:39:31', '2026-04-06 08:39:31'),
(43, 2, 'E', 3, '2026-04-06 08:39:31', '2026-04-06 08:39:31'),
(44, 2, 'E', 4, '2026-04-06 08:39:31', '2026-04-06 08:39:31'),
(45, 2, 'E', 5, '2026-04-06 08:39:31', '2026-04-06 08:39:31'),
(46, 2, 'E', 6, '2026-04-06 08:39:31', '2026-04-06 08:39:31'),
(47, 2, 'E', 7, '2026-04-06 08:39:31', '2026-04-06 08:39:31'),
(48, 2, 'E', 8, '2026-04-06 08:39:31', '2026-04-06 08:39:31'),
(49, 2, 'E', 9, '2026-04-06 08:39:31', '2026-04-06 08:39:31'),
(50, 2, 'E', 10, '2026-04-06 08:39:31', '2026-04-06 08:39:31'),
(51, 3, 'A', 1, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(52, 3, 'A', 2, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(53, 3, 'A', 3, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(54, 3, 'A', 4, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(55, 3, 'A', 5, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(56, 3, 'A', 6, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(57, 3, 'A', 7, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(58, 3, 'A', 8, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(59, 3, 'A', 9, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(60, 3, 'A', 10, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(61, 3, 'B', 1, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(62, 3, 'B', 2, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(63, 3, 'B', 3, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(64, 3, 'B', 4, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(65, 3, 'B', 5, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(66, 3, 'B', 6, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(67, 3, 'B', 7, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(68, 3, 'B', 8, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(69, 3, 'B', 9, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(70, 3, 'B', 10, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(71, 3, 'C', 1, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(72, 3, 'C', 2, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(73, 3, 'C', 3, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(74, 3, 'C', 4, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(75, 3, 'C', 5, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(76, 3, 'C', 6, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(77, 3, 'C', 7, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(78, 3, 'C', 8, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(79, 3, 'C', 9, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(80, 3, 'C', 10, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(81, 3, 'D', 1, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(82, 3, 'D', 2, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(83, 3, 'D', 3, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(84, 3, 'D', 4, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(85, 3, 'D', 5, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(86, 3, 'D', 6, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(87, 3, 'D', 7, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(88, 3, 'D', 8, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(89, 3, 'D', 9, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(90, 3, 'D', 10, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(91, 3, 'E', 1, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(92, 3, 'E', 2, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(93, 3, 'E', 3, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(94, 3, 'E', 4, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(95, 3, 'E', 5, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(96, 3, 'E', 6, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(97, 3, 'E', 7, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(98, 3, 'E', 8, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(99, 3, 'E', 9, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(100, 3, 'E', 10, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(101, 3, 'F', 1, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(102, 3, 'F', 2, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(103, 3, 'F', 3, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(104, 3, 'F', 4, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(105, 3, 'F', 5, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(106, 3, 'F', 6, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(107, 3, 'F', 7, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(108, 3, 'F', 8, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(109, 3, 'F', 9, '2026-04-06 08:39:51', '2026-04-06 08:39:51'),
(110, 3, 'F', 10, '2026-04-06 08:39:51', '2026-04-06 08:39:51');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('3HiUi0hTseVjJh355q30DIv6qxcV63TVptZfFDW3', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiMkVxQkVaNDQyNWlaN1UxdE84WWwxejdnc2FDd2FyWWd5NDFQUmtBdSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1775489476),
('9nlBADITaX6H5jCv6Yo2kKMjYuWtB0aURHg1Q12j', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS3E5Y0tjWW01Znk5cEVCQTV1MFlKc3JLTHhmVXp1NFNNc3gzTGE0aCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbW92aWVzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1775489572),
('c6aMk5yDj3gJpGMJk06tztuFBt9mpVfInSP6qaWf', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTHgwZ0dKOXZ1S3V5YVVNcTVGMkVsdmFBeHM0dkxYTXdyUWtFSG01bCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbW92aWVzLzEiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1775489544),
('CxPeZxNXZ0mLMKJGrXLv5wHCAM3wnHp5Jr1spOHt', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiNTJPeEFSVFFhd2NWdzVDWTd2ODBxWldDMllKZVJDQmVPTVN3VUhENSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1775489290),
('E5X8tYAv55Ool5qsN7Sw9xiM6Xi0nq6iFqQ1ohAv', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiczhlNnc5SGEybnV4aXJqR2V1cjVJR256ek4xbThFU3BQNG8zcmd5RSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbW92aWVzLzEiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1775489543),
('ECY6pXKQIkD8RziW5KZnE1lULBDOA3tscbj6Ejnk', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaDJ0bE1hWTgwZFUyZ3dWTHlQa1dBd2JndlRCcTlCTW5DWHhlSUdoYyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbW92aWVzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1775489555),
('fxFF0KZ9fNWaIgxvsH26EXDL4ms6mSee5QLRpDU4', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZHd3a1BjQ0Ixazl3clVzUVVNR3hOeUFPTTNhcTJ4N0lLU0sxNnhDTCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbW92aWVzLzIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1775489564),
('h7loYu3bcltLXJG0HzfjSayT3AfIFu2jJ4Zqomvl', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicW5yUk14ZmdJSFlrN2ZvY1dIZ295dlNiSWNyOXpXRHdMblNYSkh1WiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbW92aWVzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1775489078),
('levVkjKceScCr8DULK61Ydpsom2Ao8lUBpNUuKPC', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSDJlY3RxRkh2R3Q1dm9va2hPeWRzRmlEdmZiRFowU1dsMjNhNFNybyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbW92aWVzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1775489554),
('mBBDEnJn0wAcouk6xecW2VqVcVkxfQV8pmBkGsz3', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicm1kRzExdnVTaVRRb1pvN2diNGJtTTlzTmV6UWFoVnJHWEd0Vm5ldCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1775489420),
('mfBsOlTrg4j6tdOq4HqoVvnnpVUGCDjggEVrS7LH', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ2E2YmVJRXZLWDdOdFQ3NkU2T3ZHWldSZlVxY1BWMGM5V3IweDVuUCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbW92aWVzLzIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1775489561),
('mfqSEsv2mWP3sXFBQbJPIrsPPq4wypcqcuMrNoZ9', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidFBDWmNER3U4bVUyQ292TDBvNXBDenphTmV6TU1pOUViRndXZHlrdiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbW92aWVzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1775489505),
('P1y3iTvqRJT6GVFwjDx9YSPwE4yeJn0LIQi4CAeE', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYThHWHNlUEZ6QzVhN2thN2hNRlYxYUdwRFZETHRXTEhBYWFhM3doNyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1775487324),
('qN4PVe8UmJoSgbg4AC832IW0Gei81tgqlze1BeHS', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiRDV1dVdRZ2NKemNmeDBZMVdhUGpJQ2ZLdDVMbnhhVm5LV291WEo3QyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1775489595),
('U12cPOM4jo335E2A3IC5AtmgYNQq5wptuGb51hE7', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiSG5jQnpOcjVuVTJVSmJ6b29YV2VlUlNNN21wSkpkNEFUejFrNmk3TyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1775489364),
('uaMFmxBYBhjzvj4Dr8w1j0oG96mr4A0mrnPFd9oH', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYXJJV01UWG1ha1ZYdjhCYTBKcGxla0FQZzlLazJSdDhzRktMcGh5OCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbW92aWVzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1775489074),
('VsyyE2M9LWDeYmIKXu4DdcXpD2JphgO4dEuvTqRp', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZDh0SEZPOEQwTDcwZ3k0RWdlZjhKZHBFaURpc2pCR2RXNGZlMEFuZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvbW92aWVzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1775489571);

-- --------------------------------------------------------

--
-- Struktur dari tabel `studios`
--

CREATE TABLE `studios` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `capacity` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `studios`
--

INSERT INTO `studios` (`id`, `name`, `capacity`, `created_at`, `updated_at`) VALUES
(1, 'Studio 1', 20, NULL, NULL),
(2, 'Studio 2', 50, '2026-04-06 08:39:30', '2026-04-15 03:50:35'),
(3, 'Studio 3', 60, '2026-04-06 08:39:51', '2026-04-15 03:50:48');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tickets`
--

CREATE TABLE `tickets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `booking_id` bigint(20) UNSIGNED NOT NULL,
  `seat_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `tickets`
--

INSERT INTO `tickets` (`id`, `booking_id`, `seat_id`, `created_at`, `updated_at`) VALUES
(5, 2, 25, '2026-04-07 06:35:17', '2026-04-07 06:35:17'),
(6, 2, 26, '2026-04-07 06:35:17', '2026-04-07 06:35:17'),
(7, 2, 27, '2026-04-07 06:35:17', '2026-04-07 06:35:17'),
(8, 2, 28, '2026-04-07 06:35:17', '2026-04-07 06:35:17'),
(9, 3, 66, '2026-04-09 08:14:49', '2026-04-09 08:14:49'),
(10, 3, 77, '2026-04-09 08:14:49', '2026-04-09 08:14:49'),
(11, 3, 76, '2026-04-09 08:14:49', '2026-04-09 08:14:49'),
(12, 3, 75, '2026-04-09 08:14:49', '2026-04-09 08:14:49'),
(13, 4, 22, '2026-04-09 08:23:47', '2026-04-09 08:23:47'),
(14, 4, 21, '2026-04-09 08:23:47', '2026-04-09 08:23:47'),
(15, 5, 24, '2026-04-09 08:27:57', '2026-04-09 08:27:57'),
(16, 5, 23, '2026-04-09 08:27:57', '2026-04-09 08:27:57'),
(23, 9, 69, '2026-04-11 11:44:55', '2026-04-11 11:44:55'),
(24, 9, 70, '2026-04-11 11:44:55', '2026-04-11 11:44:55'),
(25, 9, 80, '2026-04-11 11:44:55', '2026-04-11 11:44:55');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','kasir','pelanggan') NOT NULL DEFAULT 'pelanggan',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin Cinema', 'admin@cineplex.com', '2026-04-06 07:36:34', '$2y$12$OvW9mmxkWjXHu6Cmc01L4O/BXlKNH7KBFDk2njaLaN7Pep0DI72lK', 'admin', 'Iko7FBVisg', '2026-04-06 07:36:35', '2026-04-06 07:36:35'),
(2, 'Kasir Cinema', 'kasir@cineplex.com', '2026-04-06 07:36:35', '$2y$12$RPmpgIBxQW47yZFcj1WGBuIzyNFXy0saHTQctjPMfeptvL0scsdKW', 'kasir', 'azxe3U1bMf', '2026-04-06 07:36:35', '2026-04-06 07:36:35');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `bookings_booking_code_unique` (`booking_code`),
  ADD KEY `bookings_user_id_foreign` (`user_id`),
  ADD KEY `bookings_schedule_id_foreign` (`schedule_id`);

--
-- Indeks untuk tabel `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indeks untuk tabel `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indeks untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indeks untuk tabel `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indeks untuk tabel `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indeks untuk tabel `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indeks untuk tabel `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `schedules_movie_id_foreign` (`movie_id`),
  ADD KEY `schedules_studio_id_foreign` (`studio_id`);

--
-- Indeks untuk tabel `seats`
--
ALTER TABLE `seats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `seats_studio_id_foreign` (`studio_id`);

--
-- Indeks untuk tabel `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indeks untuk tabel `studios`
--
ALTER TABLE `studios`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tickets_booking_id_foreign` (`booking_id`),
  ADD KEY `tickets_seat_id_foreign` (`seat_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT untuk tabel `movies`
--
ALTER TABLE `movies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT untuk tabel `schedules`
--
ALTER TABLE `schedules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `seats`
--
ALTER TABLE `seats`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- AUTO_INCREMENT untuk tabel `studios`
--
ALTER TABLE `studios`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_schedule_id_foreign` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `schedules`
--
ALTER TABLE `schedules`
  ADD CONSTRAINT `schedules_movie_id_foreign` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `schedules_studio_id_foreign` FOREIGN KEY (`studio_id`) REFERENCES `studios` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `seats`
--
ALTER TABLE `seats`
  ADD CONSTRAINT `seats_studio_id_foreign` FOREIGN KEY (`studio_id`) REFERENCES `studios` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tickets_seat_id_foreign` FOREIGN KEY (`seat_id`) REFERENCES `seats` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
