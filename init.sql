-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： db
-- 產生時間： 2023 年 06 月 15 日 07:30
-- 伺服器版本： 8.0.33
-- PHP 版本： 8.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `transition`
--

-- --------------------------------------------------------

--
-- 資料表結構 `users`
--

CREATE DATABASE transition;
USE transition;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL,
  `email` text COLLATE utf8mb3_unicode_ci NOT NULL,
  `nickname` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  `password` text COLLATE utf8mb3_unicode_ci NOT NULL,
  `salt` text COLLATE utf8mb3_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- 傾印資料表的資料 `users`
--

INSERT INTO `users` (`id`, `email`, `nickname`, `password`, `salt`, `created_at`) VALUES
(1, 'test@gmail.com', 'test_name', '$2y$10$XjrZlF34nmf2XhZCIo6T5Oj9iupw7louIYGNhVlIGSKATNj8/AuWm', '', '0000-00-00 00:00:00'),
(2, 'test@gmail.com', 'test_name', '$2y$10$yQUWH8Eu.4D.fV1KTrizTeBZG35GUl8Sx9GLzyvhYb88LEfkHVXe2', '', '0000-00-00 00:00:00'),
(4, 'tiffany12334@gmail.com', 'test', '123', '123', '2023-06-11 05:20:09'),
(5, 'test', '1', '11', '1', '2023-06-11 05:22:41'),
(29, 'tiffany831101@gmail.com', 'tiffany', '$2a$10$e4X1LLB2Ps/Y4vffsNMNLupf5pwjcqCvl2Y/t/CzX.fbmdr0.o69e', '$2a$10$e4X1LLB2Ps/Y4vffsNMNLu', '2023-06-11 08:36:57'),
(31, 'tiffany831101@gmail.com', 'tiffany', '$2a$10$TC61e1SgpOTA9VpzMXThFO74N9tNg1D7Xtc8RE22rJjF62zsifix6', '$2a$10$TC61e1SgpOTA9VpzMXThFO', '2023-06-11 09:40:49'),
(32, 'tiffany831101@gmail.com', 'tiffany', '$2a$10$oC48f5Q9Aj9BrSxQhbDW..G6oH.tX0japiG.8gNFyqe4HNUvTq9sa', '$2a$10$oC48f5Q9Aj9BrSxQhbDW..', '2023-06-11 09:42:15'),
(33, 'tiffany831101@gmail.com', 'tiffany', '$2a$10$8KyIrTofezI9tjtwqLIip.3Qql60OLi4/U.zHVY7CKX2ssfU9tJcC', '$2a$10$8KyIrTofezI9tjtwqLIip.', '2023-06-11 09:42:28'),
(34, 'tiffany831101@gmail.com', 'tiffany', '$2a$10$9xDR3wENIrCo.rygfaNbr.8J69825eCoyY3VUbGT7bnEfOzTgHwgO', '$2a$10$9xDR3wENIrCo.rygfaNbr.', '2023-06-11 09:43:22'),
(35, 'tiffany831121@gmail.com', 'tiffany', '$2a$10$WNU69vSIZASIkrmQzW1rFuVogQuZ8ziIMBuz6RzBbeWHFaBRervVO', '$2a$10$WNU69vSIZASIkrmQzW1rFu', '2023-06-11 09:45:28');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `users`
--
ALTER TABLE `users`
  ADD KEY `id` (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
