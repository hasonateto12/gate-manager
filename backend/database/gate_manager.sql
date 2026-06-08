-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: יוני 08, 2026 בזמן 02:18 AM
-- גרסת שרת: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gate_manager`
--

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `department` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- הוצאת מידע עבור טבלה `employees`
--

INSERT INTO `employees` (`id`, `full_name`, `department`, `phone`, `created_at`) VALUES
(1, 'עלי חסון', 'אבטחה', '0501234567', '2026-05-24 14:44:56'),
(2, 'סמי אחמד', 'מחסן אחורי', '0507654321', '2026-05-24 14:44:56'),
(3, 'ווסים חסונה', 'xzxzx', '0521111111', '2026-05-24 14:44:56');

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `entry_logs`
--

CREATE TABLE `entry_logs` (
  `id` int(11) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `guard_id` int(11) DEFAULT NULL,
  `entry_time` datetime DEFAULT current_timestamp(),
  `exit_time` datetime DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `current_status` enum('inside','outside') DEFAULT 'inside',
  `result` varchar(50) DEFAULT 'Approved',
  `action_type` enum('Entry','Exit') DEFAULT 'Entry',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- הוצאת מידע עבור טבלה `entry_logs`
--

INSERT INTO `entry_logs` (`id`, `vehicle_id`, `employee_id`, `guard_id`, `entry_time`, `exit_time`, `notes`, `current_status`, `result`, `action_type`, `created_at`) VALUES
(1, 1, NULL, 1, '2026-05-27 05:15:51', '2026-05-27 06:18:14', 'bfgsffgsdf', 'outside', 'Approved', 'Entry', '2026-05-27 05:15:51'),
(2, 1, NULL, 1, '2026-05-27 05:15:54', '2026-05-27 06:18:16', 'bfgsffgsdf', 'outside', 'Approved', 'Entry', '2026-05-27 05:15:54'),
(3, 1, NULL, 1, '2026-05-27 05:17:45', '2026-05-27 06:18:09', 'bfgsffgsdf', 'outside', 'Approved', 'Entry', '2026-05-27 05:17:45'),
(4, 1, NULL, 1, '2026-05-27 05:18:14', '2026-05-27 06:18:10', 'bfgsffgsdfדגעדגדגה', 'outside', 'Approved', 'Entry', '2026-05-27 05:18:14'),
(5, 1, NULL, 1, '2026-05-27 05:18:17', '2026-05-27 06:18:12', 'bfgsffgsdfדגעדגדגה', 'outside', 'Approved', 'Entry', '2026-05-27 05:18:17'),
(6, 1, NULL, 1, '2026-05-27 05:29:35', '2026-05-27 06:18:11', '', 'outside', 'Approved', 'Entry', '2026-05-27 05:29:35'),
(7, 1, NULL, 1, '2026-05-27 05:32:08', '2026-05-27 06:18:08', '', 'outside', 'Approved', 'Entry', '2026-05-27 05:32:08'),
(8, 1, NULL, 1, '2026-05-27 06:05:42', '2026-05-27 06:18:07', 'למטבח', 'outside', 'Approved', 'Entry', '2026-05-27 06:05:42'),
(9, 3, NULL, 1, '2026-05-27 06:10:19', '2026-05-27 06:18:06', 'adsasdsd', 'outside', 'Approved', 'Entry', '2026-05-27 06:10:19'),
(10, 1, NULL, 1, '2026-05-27 06:15:29', '2026-05-27 06:16:06', 'iutyityity', 'outside', 'Approved', 'Entry', '2026-05-27 06:15:29'),
(11, 2, NULL, 1, '2026-05-27 06:16:23', '2026-05-27 06:16:59', 'wererewrwerewrewrwer', 'outside', 'Approved', 'Entry', '2026-05-27 06:16:23'),
(12, 1, NULL, 1, '2026-05-27 06:18:45', '2026-05-27 06:19:01', '', 'outside', 'Approved', 'Entry', '2026-05-27 06:18:45'),
(13, 1, NULL, 1, '2026-05-27 06:28:03', '2026-05-27 06:28:21', 'bcxvbcxcxvcx', 'outside', 'Approved', 'Entry', '2026-05-27 06:28:03'),
(14, 1, NULL, 1, '2026-05-27 06:29:51', '2026-05-27 06:29:58', '', 'outside', 'Approved', 'Entry', '2026-05-27 06:29:51'),
(15, 1, NULL, 1, '2026-05-27 06:32:02', '2026-05-27 06:32:49', '', 'outside', 'Approved', 'Exit', '2026-05-27 06:32:02'),
(16, 1, NULL, 1, '2026-05-27 06:35:06', '2026-05-27 06:36:33', '', 'outside', 'Approved', 'Exit', '2026-05-27 06:35:06'),
(17, 2, NULL, 1, '2026-05-27 06:35:47', '2026-05-27 06:36:24', '', 'outside', 'Approved', 'Exit', '2026-05-27 06:35:47'),
(18, 2, NULL, 1, '2026-05-27 06:36:16', '2026-05-27 06:36:21', '', 'outside', 'Approved', 'Exit', '2026-05-27 06:36:16'),
(19, 1, NULL, 1, '2026-05-27 06:36:46', '2026-05-27 06:36:53', '', 'outside', 'Approved', 'Exit', '2026-05-27 06:36:46'),
(20, 1, NULL, 1, '2026-05-27 06:38:55', '2026-05-27 06:39:12', '', 'outside', 'Approved', 'Exit', '2026-05-27 06:38:55'),
(21, 2, NULL, 1, '2026-05-27 06:39:05', '2026-05-27 06:39:11', '', 'outside', 'Approved', 'Exit', '2026-05-27 06:39:05'),
(22, 3, NULL, 1, '2026-05-27 06:42:11', '2026-05-27 06:43:00', '', 'outside', 'Approved', 'Exit', '2026-05-27 06:42:11'),
(23, 1, NULL, 1, '2026-05-28 11:12:37', '2026-05-28 11:12:43', 'למטבח', 'outside', 'Approved', 'Exit', '2026-05-28 11:12:37'),
(24, 5, NULL, 2, '2026-05-28 14:12:57', '2026-05-28 14:27:44', 'למחסן', 'outside', 'Approved', 'Exit', '2026-05-28 14:12:57'),
(25, 6, NULL, 2, '2026-05-28 14:24:03', '2026-05-28 14:27:42', 'asdasdasdasd', 'outside', 'Approved', 'Exit', '2026-05-28 14:24:03'),
(26, 18, NULL, 1, '2026-06-03 04:26:34', '2026-06-03 04:27:53', 'vcxvcxvxcvxcvxcv', 'outside', 'Approved', 'Exit', '2026-06-03 04:26:34'),
(27, 18, NULL, 2, '2026-06-03 04:27:47', '2026-06-03 04:27:52', 'csadasdasd', 'outside', 'Approved', 'Exit', '2026-06-03 04:27:47'),
(28, 19, NULL, 1, '2026-06-03 04:30:46', '2026-06-03 04:31:44', 'vcxvxcvxcvxcvc', 'outside', 'Rejected', 'Exit', '2026-06-03 04:30:46'),
(29, 19, NULL, 2, '2026-06-03 04:31:41', '2026-06-03 04:31:43', 'ghdfgfdgdssd', 'outside', 'Approved', 'Exit', '2026-06-03 04:31:41'),
(30, 20, NULL, 1, '2026-06-03 04:42:13', '2026-06-03 04:57:43', 'gttrr', 'outside', 'Approved', 'Exit', '2026-06-03 04:42:13'),
(31, 3, NULL, 1, '2026-06-07 03:46:06', '2026-06-07 03:46:09', 'khkjhkhhgjghj', 'outside', 'Approved', 'Exit', '2026-06-07 03:46:06'),
(32, 22, NULL, 1, '2026-06-07 03:52:49', '2026-06-07 04:01:22', 'AAsasa', 'outside', 'Approved', 'Exit', '2026-06-07 03:52:49'),
(33, 23, NULL, 1, '2026-06-07 04:06:29', '2026-06-07 04:06:33', 'rtterterterter', 'outside', 'Approved', 'Exit', '2026-06-07 04:06:29'),
(34, 24, NULL, 1, '2026-06-07 05:26:08', '2026-06-07 05:27:00', 'sdfsdf', 'outside', 'Approved', 'Exit', '2026-06-07 05:26:08'),
(35, 1, NULL, 2, '2026-06-07 05:28:24', '2026-06-07 05:52:19', 'DSADADASDASD', 'outside', 'Approved', 'Exit', '2026-06-07 05:28:24'),
(36, 25, NULL, 2, '2026-06-07 05:30:00', '2026-06-07 05:52:18', 'סשדסשדסשדסשססשסשסשסש', 'outside', 'Pending', 'Exit', '2026-06-07 05:30:00'),
(37, 1, NULL, 1, '2026-06-07 05:52:35', '2026-06-07 05:52:39', 'xzczxczxc', 'outside', 'Approved', 'Exit', '2026-06-07 05:52:35');

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `entry_requests`
--

CREATE TABLE `entry_requests` (
  `id` int(11) NOT NULL,
  `plate_number` varchar(20) NOT NULL,
  `driver_name` varchar(255) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `request_time` datetime DEFAULT current_timestamp(),
  `handled_by` int(11) DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `vehicle_type` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- הוצאת מידע עבור טבלה `entry_requests`
--

INSERT INTO `entry_requests` (`id`, `plate_number`, `driver_name`, `company_name`, `notes`, `status`, `request_time`, `handled_by`, `rejection_reason`, `created_at`, `vehicle_type`) VALUES
(1, 'מוחמד חס', 'בדשבש', 'בדשדבשד', 'למטבחבשדבשדבד', 'approved', '2026-05-27 05:07:47', 2, NULL, '2026-05-27 05:07:47', NULL),
(2, '14588897', 'נזאר', 'רא', 'מכולה להעמיס', 'approved', '2026-05-28 14:00:01', 2, NULL, '2026-05-28 14:00:01', NULL),
(3, '123654', 'תיתו', 'רא', 'למחסן', 'approved', '2026-05-28 14:12:57', 2, NULL, '2026-05-28 14:12:57', NULL),
(4, '32146', 'csdasd', 'dasdasd', 'asdasdasdasd', 'approved', '2026-05-28 14:24:03', 2, NULL, '2026-05-28 14:24:03', NULL),
(5, '123333', 'vxvxcv', 'dsdsd', 'vcxvcxvxcvxcvxcv', 'approved', '2026-06-03 04:26:34', 2, NULL, '2026-06-03 04:26:34', NULL),
(6, '1145', 'asdet', 'teto', 'vcxvxcvxcvxcvc', 'rejected', '2026-06-03 04:30:46', 2, NULL, '2026-06-03 04:30:46', NULL),
(7, '987', 'aqw', 'asxz', 'gttrr', 'approved', '2026-06-03 04:42:13', 2, NULL, '2026-06-03 04:42:13', NULL),
(8, '99999999999999', 'asdet', 'ssadA', 'AAsasa', 'approved', '2026-06-07 03:52:49', 2, NULL, '2026-06-07 03:52:49', NULL),
(9, '4444', 'tertert', 'terterterte', 'rtterterterter', 'approved', '2026-06-07 04:06:29', 2, NULL, '2026-06-07 04:06:29', NULL),
(10, '222', 'teto', 'בדשבש', 'asasa', 'approved', '2026-06-07 05:21:32', 2, NULL, '2026-06-07 05:21:32', 'משאית'),
(11, '222', 'teto', 'בדשבש', 'asasa', 'approved', '2026-06-07 05:21:39', 2, NULL, '2026-06-07 05:21:39', 'משאית'),
(12, '222', 'sdas', 'asdasda', 'sdasdasd', 'approved', '2026-06-07 05:22:08', 2, NULL, '2026-06-07 05:22:08', 'משאית'),
(13, '222', 'sdas', 'asdasda', 'sdasdasd', 'approved', '2026-06-07 05:22:33', 2, NULL, '2026-06-07 05:22:33', 'משאית'),
(14, '222', 'fsdf', 'sdfdsfsdf', 'sdfsdf', 'approved', '2026-06-07 05:26:08', 2, NULL, '2026-06-07 05:26:08', 'רכב פרטי'),
(15, '1', 'ZXZסXסשסש', 'שדסשדסשד', 'סשדסשדסשדסשססשסשסשסש', 'pending', '2026-06-07 05:30:00', NULL, NULL, '2026-06-07 05:30:00', 'רכב פרטי');

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','guard') DEFAULT 'guard',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- הוצאת מידע עבור טבלה `users`
--

INSERT INTO `users` (`id`, `full_name`, `username`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'תיתו חסונה', 'guard1', 'guard1@test.com', '$2b$10$Z2f7TkJOPknD2KI.Z7/xd.szilhr.W6A7AjG2/zoMeVjYlmTpHckq', 'guard', '2026-05-24 14:23:10'),
(2, 'אייל', 'admin1', 'admin1@test.com', '$2b$10$8cZilSK.F0z9HT0e8Ud6Kunjx/LdRymWJnrJ7VX.t/fCVi6W5frT.', 'admin', '2026-05-24 14:25:20');

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `vehicles`
--

CREATE TABLE `vehicles` (
  `id` int(11) NOT NULL,
  `plate_number` varchar(50) NOT NULL,
  `vehicle_type` varchar(100) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('approved','pending','rejected') DEFAULT 'approved',
  `driver_name` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- הוצאת מידע עבור טבלה `vehicles`
--

INSERT INTO `vehicles` (`id`, `plate_number`, `vehicle_type`, `employee_id`, `created_at`, `status`, `driver_name`, `company_name`) VALUES
(1, '123-45-678', 'רכב פרטי', 1, '2026-05-24 14:44:56', 'approved', 'עלי חסון', 'תנובה'),
(2, '987-65-432', 'משאית', 2, '2026-05-24 14:44:56', 'approved', 'מוחמד חסונה', 'אסם'),
(3, '555-22-999', 'רכב חברה', 3, '2026-05-24 14:44:56', 'rejected', NULL, NULL),
(5, '123654', NULL, NULL, '2026-05-28 11:12:57', 'approved', 'תיתו', 'רא'),
(6, '32146', NULL, NULL, '2026-05-28 11:24:03', 'approved', 'csdasd', 'dasdasd'),
(9, '14588897', NULL, NULL, '2026-05-28 11:30:05', 'approved', 'נזאר', 'רא'),
(18, '123333', NULL, NULL, '2026-06-03 01:26:34', 'approved', 'vxvxcv', 'dsdsd'),
(19, '1145', '', 2, '2026-06-03 01:30:46', 'approved', NULL, NULL),
(20, '987', 'מכולה ', 2, '2026-06-03 01:42:13', 'approved', NULL, NULL),
(21, '3435546757', 'מכולה', NULL, '2026-06-03 04:10:28', 'approved', 'פאלח', 'רא'),
(22, '99999999999999', NULL, NULL, '2026-06-07 00:52:49', 'approved', 'asdet', 'ssadA'),
(23, '4444', 'מכולה ', NULL, '2026-06-07 01:06:29', 'approved', 'tertert', 'terterterte'),
(24, '222', 'רכב פרטי', NULL, '2026-06-07 02:26:08', 'approved', 'fsdf', 'sdfdsfsdf'),
(25, '1', 'רכב פרטי', NULL, '2026-06-07 02:30:00', 'pending', 'ZXZסXסשסש', 'שדסשדסשד');

--
-- Indexes for dumped tables
--

--
-- אינדקסים לטבלה `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`);

--
-- אינדקסים לטבלה `entry_logs`
--
ALTER TABLE `entry_logs`
  ADD PRIMARY KEY (`id`);

--
-- אינדקסים לטבלה `entry_requests`
--
ALTER TABLE `entry_requests`
  ADD PRIMARY KEY (`id`);

--
-- אינדקסים לטבלה `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- אינדקסים לטבלה `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `vehicle_number` (`plate_number`),
  ADD UNIQUE KEY `plate_number` (`plate_number`),
  ADD KEY `employee_id` (`employee_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `entry_logs`
--
ALTER TABLE `entry_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `entry_requests`
--
ALTER TABLE `entry_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- הגבלות לטבלאות שהוצאו
--

--
-- הגבלות לטבלה `vehicles`
--
ALTER TABLE `vehicles`
  ADD CONSTRAINT `vehicles_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
