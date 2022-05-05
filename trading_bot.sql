-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 02, 2022 at 10:22 AM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `trading_bot`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `order_id` varchar(500) DEFAULT NULL,
  `side` varchar(256) DEFAULT NULL,
  `fee_amount` float DEFAULT NULL,
  `quantity` float DEFAULT NULL,
  `price` float DEFAULT NULL,
  `symbol` varchar(256) DEFAULT NULL,
  `timestamp` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_id`, `side`, `fee_amount`, `quantity`, `price`, `symbol`, `timestamp`) VALUES
(1, 'acnajcnjlacbdalc', 'buy', 0.991, 3.245, 0.881, 'matic', 12),
(3, '41f74e24-b0fb-11ec-8e2f-1b98e6d5b6d9', 'buy', 0, 9, 1.671, 'MATICUSDT', 2147483647),
(4, '41f74e24-b0fb-11ec-8e2f-1b98e6d5b6d9', 'buy', 0, 9, 1.671, 'MATICUSDT', 2147483647),
(5, '495e0c16-b0fb-11ec-beef-23856932a931', 'sell', 0, 9, 0, 'MATICUSDT', 2147483647);

-- --------------------------------------------------------

--
-- Table structure for table `pairs`
--

CREATE TABLE `pairs` (
  `id` int(11) NOT NULL,
  `pairs` text DEFAULT NULL,
  `name` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `pairs`
--

INSERT INTO `pairs` (`id`, `pairs`, `name`) VALUES
(1, '{\"name\":\"matic\",\"pair\":\"B-MATIC_USDT\",\"symbol\":\"MATICUSDT\",\"target_currency_precision\":1,\"tradingUnit\":15,\"levels\":[[1.721,\"filled\"],[1.692,\"empty\"],[1.67,\"empty\"],[1.647,\"empty\"],[1.623,\"empty\"]]}', 'matic'),
(2, '{\"name\":\"chainlink\",\"pair\":\"B-LINK_USDT\",\"symbol\":\"LINKUSDT\",\"target_currency_precision\":2,\"tradingUnit\":15,\"levels\":[[17.98,\"empty\"],[17.61,\"empty\"],[17.2,\"filled\"],[16.93,\"empty\"]]}', 'chainlink');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pairs`
--
ALTER TABLE `pairs`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `pairs`
--
ALTER TABLE `pairs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
