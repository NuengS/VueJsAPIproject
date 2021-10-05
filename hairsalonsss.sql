-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 05, 2021 at 06:48 PM
-- Server version: 10.4.20-MariaDB
-- PHP Version: 7.3.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hairsalonsss`
--

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `booking_id` int(10) NOT NULL,
  `booking_day` date NOT NULL,
  `booking_time` time NOT NULL,
  `booking_dayuse` date NOT NULL,
  `booking_timeuse` time NOT NULL,
  `booking_status` int(50) NOT NULL,
  `booking_point` int(10) NOT NULL,
  `service_id` int(10) NOT NULL,
  `hsalon_id` int(10) NOT NULL,
  `hairdresser_id` int(10) NOT NULL,
  `customer_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`booking_id`, `booking_day`, `booking_time`, `booking_dayuse`, `booking_timeuse`, `booking_status`, `booking_point`, `service_id`, `hsalon_id`, `hairdresser_id`, `customer_id`) VALUES
(3, '2021-08-05', '15:01:06', '2021-08-07', '19:01:06', 0, 5, 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `hair_salon`
--

CREATE TABLE `hair_salon` (
  `hsalon_id` int(10) NOT NULL,
  `hsalon_name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `hsalon_detail` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `hsalon_time` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `hsalon_pic` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `hsalon_address` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `hsalon_lat` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `hsalon_lng` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `status` int(10) NOT NULL DEFAULT 0,
  `status_OF` int(10) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `hair_salon`
--

INSERT INTO `hair_salon` (`hsalon_id`, `hsalon_name`, `hsalon_detail`, `hsalon_time`, `hsalon_pic`, `hsalon_address`, `hsalon_lat`, `hsalon_lng`, `status`, `status_OF`) VALUES
(1, 'เอก BB', 'ร้านตัดผม สระผม ย้อมสีผมน่าจะคุ้นเคยกันดี ด้วยประสบการณ์กว่า 20 ปี และความเป็นกันเองกับลูกค้า เพียงเท่านี้ก็การันตรีฝีมือของช่างแจ็คได้เป็นอย่างดี', '19.00-19.00', 'unavailable.jpg', 'test', 'testlat', 'testlng', 1, 0),
(3, 'บีบี', 'ร้านที่เด็กแนว หลาย ๆ คน น่าจะคุ้นเคยกันดี  ด้วยประสบการณ์กว่า 8 ปี และความเป็นกันเองกับลูกค้า  ', '09.00-19.00', 'unavailable.jpg', 'test1', '5418101', '4546848', 0, 0),
(12, ' lllllllllll', ' llllllllllllllll', '1', 'unavailable.jpg', ' lllllllllllllllllllllllllll', '187687', '15648654', 1, 0),
(20, 'await', 'await', '1', 'thumb-1920-1154327.jpg', 'await', '1', '1', 1, 0),
(116, 'ggg', ' ggg', '1', 'unavailable.jpg', ' ggg', '1', '1', 0, 1),
(136, 'DDD', ' DDD', '1', 'unavailable.jpg', ' DDD', '1', '1', 0, 1),
(137, 'DDD', ' DDD', '1', 'unavailable.jpg', ' DDD', '1', '1', 0, 1),
(138, 'DDD', 'DDD', '1', 'unavailable.jpg', ' DDD', '1', '1', 0, 1),
(139, ' FFF', ' DDD', '1', 'unavailable.jpg', ' DDD', '1', '1', 0, 1),
(140, 'CCC', ' CCC', '1', 'unavailable.jpg', ' CCC', '1', '1', 0, 1),
(141, 'CCC', ' CCC', '1', 'unavailable.jpg', ' CCC', '1', '1', 0, 1),
(142, 'VVV', ' VVV', '1', 'unavailable.jpg', ' VVV', '1', '1', 0, 1),
(143, 'VVV', ' VVV', '1', 'unavailable.jpg', ' VVV', '1', '1', 0, 1),
(144, 'asdsad', 'asdasdas', '1', 'unavailable.jpg', ' VVVasdsdasd', '1', '1', 0, 1),
(145, 'asdsad', 'asdasdas', '1', 'unavailable.jpg', ' VVVasdsdasd', '1', '1', 0, 1),
(146, ' GHH', '  GHH', '1', 'unavailable.jpg', '  GHH', '1', '1', 0, 1),
(147, ' GHH', '  GHH', '1', 'unavailable.jpg', '  GHH', '1', '1', 0, 1),
(148, ' HHH', '  GHH', '1', 'unavailable.jpg', '  GHH', '1', '1', 0, 1),
(149, ' HHH', ' HHH', '1', 'unavailable.jpg', '  HHH', '1', '1', 0, 1),
(150, 'MMM', 'MMM', '1', 'unavailable.jpg', ' MMM', '1', '1', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `notification_id` int(10) NOT NULL,
  `notification_text` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  `hsalon_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`notification_id`, `notification_text`, `user_id`, `hsalon_id`) VALUES
(1, 5, 1, 1),
(2, 4, 2, 1),
(3, 3, 6, 1),
(4, 2, 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `service`
--

CREATE TABLE `service` (
  `service_id` int(10) NOT NULL,
  `service_name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `service_pic` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `service_price` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `service_time` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `hsalon_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `service`
--

INSERT INTO `service` (`service_id`, `service_name`, `service_pic`, `service_price`, `service_time`, `hsalon_id`) VALUES
(1, 'รองทรงสูง', '194565740_310980660515981_1204651401669805519_n.jpg', '160', '30', 1),
(2, 'รองทรงต่ำ', 'unavailable.jpg', '160', '30', 1),
(3, 'รองทรงสูง', 'unavailable.jpg', '140', '60', 3),
(4, 'รองทรงต่ำ', 'unavailable.jpg', '140', '60', 1),
(7, ' 1589', '218185807_381451400320406_185861360068434325_n.jpg', '159', ' 30', 1);

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE `status` (
  `status_id` int(10) NOT NULL,
  `status_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `status`
--

INSERT INTO `status` (`status_id`, `status_name`) VALUES
(1, 'ลูกค้า'),
(2, 'ช่างทำผม'),
(3, 'เจ้าของร้าน'),
(4, 'แอดมิน');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `username` varchar(150) COLLATE utf8_thai_520_w2 NOT NULL,
  `password` varchar(200) COLLATE utf8_thai_520_w2 NOT NULL,
  `status_id` int(10) NOT NULL,
  `user_name` varchar(50) COLLATE utf8_thai_520_w2 NOT NULL,
  `user_lastname` varchar(50) COLLATE utf8_thai_520_w2 NOT NULL,
  `user_number` int(10) NOT NULL,
  `user_pic` varchar(255) COLLATE utf8_thai_520_w2 NOT NULL DEFAULT 'unavailable.jpg',
  `hsalon_id` int(10) NOT NULL,
  `status_OF` int(10) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_thai_520_w2;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `username`, `password`, `status_id`, `user_name`, `user_lastname`, `user_number`, `user_pic`, `hsalon_id`, `status_OF`) VALUES
(1, 'AAA', '$2a$10$OC0U5Kn/O3qc19Y/ZY8GIOyd8z7U998O9RtqD1edWVxwFZ9pqHNC6', 4, 'เอ', 'สมมาตร', 990724761, 'unavailable.jpg', 0, 1),
(2, 'gusso', '$2a$10$WzcrCqpswARCd3LuTD5pl.tZaPgbl0ziNhiSQ/4vyiSpAz.RTzKQC', 1, 'กัสโซ', 'โมมาย', 885241236, 'unavailable.jpg', 108, 1),
(3, 'nasa', '$2a$10$jiNLoxG9HfG2pQycer/Nn.4u779GKyRXBot.PEIu8fn0WJ0apZG3G', 2, 'นาซา', 'มิมิ', 885241237, 'unavailable.jpg', 12, 1),
(7, 'test', '$2a$10$B1.leZojqze674zDWT/wy.ZpedNpXCGIN8TQCF/Ol34QWQJdm4apm', 1, 'บี', 'บีรอง', 885241240, 'unavailable.jpg', 12, 1),
(95, 'qwe', '$2a$10$bjoSk1Jyk2g/UqFRlr9Vbuf2ZlMAsF3tyHI32wBiNLrs0LBNFjtcO', 3, 'เอฟ', 'เอฟรอง1', 885241244, 'unavailable.jpg', 0, 1),
(96, 'jjj', '$2a$10$k7tRjBZmaX5QCi3.lRXQKOmQZlVs1KTvCY3dlMBGH2ARlv7XRvO4i', 3, 'เอฟ1', 'เอฟรอง2', 885241245, 'unavailable.jpg', 0, 1),
(97, '657567', '$2a$10$cEPpW/ptMPCTi1duDNd2Q.NbPx3UH6misI9kCscq6wRoXCpnxQ/YC', 3, 'เอฟ2', 'เอฟรอง3', 885241246, 'unavailable.jpg', 0, 1),
(98, 'asdsad', '$2a$10$4NHdPWhshobQdAGbVxMBkuOw/6CUBMIiar7yunDEY1eijURDVYW4a', 3, 'เอฟ3', 'เอฟรอง4', 885241247, 'unavailable.jpg', 0, 1),
(100, 'dasdas', '$2a$10$A0TlFUou10/gRvwtSSDxlOWiw5u6OmOiE9eplRRyyuDwzC6hMb/cm', 3, 'เอฟ5', 'เอฟรอง6', 885241249, 'unavailable.jpg', 0, 1),
(101, 'dasdass', '$2a$10$SzSwLU7Ea40Ptq5Kjn43dOkKAnIEAg6v9LAFKDO1MH8LS9/D9xDp6', 3, 'เอฟ6', 'เอฟรอง7', 885241250, 'unavailable.jpg', 0, 1),
(102, 'ghj', '$2a$10$F8NHQDxpzDuYyi1t2lnWzuv.LXLdGolD7/M5b8QWHCZtFldzX9eQO', 3, 'เอฟ7', 'เอฟรอง8', 885241251, 'unavailable.jpg', 0, 1),
(113, 'DDD', '$2a$10$zJqKjVnK6NkkDQzdve/YqO6uG0ghCDdzbDCzSdtWTiVaA5rKH8F3S', 3, ' DDD', ' DDD', 2147483647, 'unavailable.jpg', 0, 1),
(114, 'DDD', '$2a$10$qYEo05Kkk0gWV3PhmLlLM.SxNxArfNYNijIjnpAPp.G7clkuA6WdS', 3, ' DDD', ' DDD', 2147483647, 'unavailable.jpg', 0, 1),
(115, 'DDD', '$2a$10$bRtnlW5zU/H.ZUMYO4eUV.UksuZ..ENuDXc8FUKNUMFVS1ZpETMeC', 3, ' DDD', ' DDD', 32432423, 'unavailable.jpg', 0, 1),
(116, 'DDD', '$2a$10$sxsQLZyAxdhkuet54F.2z.352p5CkgZ8e.1CLFJ.WpHfgbiPrasQq', 3, ' DDD', ' DDD', 32423432, 'unavailable.jpg', 0, 1),
(117, 'CCC', '$2a$10$vzIsCNzZ693DB8WSFOhVEuTD5rapIS0EwPoBDM5RMRO1kemx1P4Iy', 3, ' CCC', ' CCC', 231432432, 'unavailable.jpg', 0, 1),
(118, 'CCC', '$2a$10$YMidgvjeMqeBYq/jp58uXensMmBNjBphMpKTzEPQ13.Yo0oJntPDa', 3, ' CCC', ' CCC', 231432432, 'unavailable.jpg', 0, 1),
(119, 'VVV', '$2a$10$S0IpPqKhleNzmCusB/J/W.0mUwwQgY8gNIBPn0eDjwzZoPHaX2xKW', 3, ' VVV', ' VVV', 43543543, 'unavailable.jpg', 0, 1),
(120, 'VVV', '$2a$10$E3hlqW57Fsloz1rOX6NUROAiWogRxLOTTTK5K/3dmVC4ZD8GvyUdK', 3, ' VVV', ' VVV', 43543543, 'unavailable.jpg', 0, 1),
(121, 'VVVasdas', '$2a$10$bxah4V3/iS5JpDoDhf7SIe.2qOZTfXiDoUntj/ojey4emCD3fvIU6', 3, ' VVVasdasd', ' VVVasdas', 43543543, 'unavailable.jpg', 0, 1),
(122, 'VVVasdas', '$2a$10$HphUGArWOZnK2TxotwPdWONNZonpmKems6HTTRq1jUH1x8M6kOT3K', 3, ' VVVasdasd', ' VVVasdas', 43543543, 'unavailable.jpg', 0, 1),
(123, ' HHH', '$2a$10$wR1QdcyCaeZIazRh6Y8FIuJdmAfkamMoixdVw5PIiMwImMrfEmIi2', 3, '  HHH', '  HHH', 32432423, 'unavailable.jpg', 149, 1),
(124, 'MMM', '$2a$10$BEI.juEFn0EMy1LTsQxHJuZpjthg4rZOpjgJV6w17rqQK3wZjXvpa', 3, ' MMM', ' MMM', 21312312, 'unavailable.jpg', 150, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `service_id` (`service_id`,`hsalon_id`,`hairdresser_id`,`customer_id`);

--
-- Indexes for table `hair_salon`
--
ALTER TABLE `hair_salon`
  ADD PRIMARY KEY (`hsalon_id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `customer_id` (`user_id`),
  ADD KEY `hsalon_id` (`hsalon_id`);

--
-- Indexes for table `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`service_id`),
  ADD KEY `hsalon_id` (`hsalon_id`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`status_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`),
  ADD KEY `status_id` (`status_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `booking_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `hair_salon`
--
ALTER TABLE `hair_salon`
  MODIFY `hsalon_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=151;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `notification_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `service`
--
ALTER TABLE `service`
  MODIFY `service_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `service`
--
ALTER TABLE `service`
  ADD CONSTRAINT `service` FOREIGN KEY (`hsalon_id`) REFERENCES `hair_salon` (`hsalon_id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `status` FOREIGN KEY (`status_id`) REFERENCES `status` (`status_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
