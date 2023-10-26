-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: luonghuy
-- ------------------------------------------------------
-- Server version	5.7.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `BacSi`
--

DROP TABLE IF EXISTS `BacSi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BacSi` (
  `MaBS` int(11) NOT NULL AUTO_INCREMENT,
  `HoBS` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TenBS` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SoDT` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `BangCap` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ChuyenMon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `GioiTinh` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MaNguoiDung` int(11) DEFAULT NULL,
  `GhiChu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaBS`),
  KEY `MaNguoiDung` (`MaNguoiDung`),
  CONSTRAINT `BacSi_ibfk_1` FOREIGN KEY (`MaNguoiDung`) REFERENCES `NguoiDung` (`MaNguoiDung`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BacSi`
--

LOCK TABLES `BacSi` WRITE;
/*!40000 ALTER TABLE `BacSi` DISABLE KEYS */;
INSERT INTO `BacSi` VALUES (1,'Nguyễn','Cao Danh','0328765643','danh2311@gmail.com','Thạc Sĩ (Master\'s Degree) ','Tim mạch','Nam',8,'null'),(2,'Hà','Huy Cận','036 4892020','huycan2@gmail.com','Tiến Sĩ (Doctoral Degree)','Phụ khoa','Nam',9,'null'),(3,'Khúc','Vân Anh','09056738321','vananh21@gmail.com','Bác Sĩ (Doctor)','Nha Khoa','Nữ',10,'null'),(4,'Lê','Bách','09056738322','lebach23@gmail.com','Tiến Sĩ (Doctoral Degree)','Mắt','Nam',17,'null'),(5,'Trần','Huy Hoàng','036 7304512','hoang99@gmail.com','Bác Sĩ (Doctor)','Tai Mũi Họng','Nam',18,'null'),(6,'Cù','Bá Kiến','0398870903','kien231@gmail.com','Thạc Sĩ (Master\'s Degree) ','Tổng Quát','Nam',19,'null'),(7,'Nguyễn','Hạnh','0328765648','huynguyen21@gmail.com','Tiến Sĩ (Doctoral Degree)','Tổng Quát','Nữ',7,'null');
/*!40000 ALTER TABLE `BacSi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BenhNhan`
--

DROP TABLE IF EXISTS `BenhNhan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BenhNhan` (
  `MaBN` int(11) NOT NULL AUTO_INCREMENT,
  `HoBN` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TenBN` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SoDT` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Email` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `NgaySinh` date DEFAULT NULL,
  `GioiTinh` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DiaChi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `GhiChu` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaBN`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BenhNhan`
--

LOCK TABLES `BenhNhan` WRITE;
/*!40000 ALTER TABLE `BenhNhan` DISABLE KEYS */;
INSERT INTO `BenhNhan` VALUES (1,'Nguyễn','Văn Huy','0367304512','huynguyen13@gmail.com','2002-02-22','Nam','Tuy Hòa - Phú Yên','Thấp gầy'),(2,'Lưu','Trọng Nhân','0364892020','nhantrong10@gmail.com','2002-11-03','Nam','Cầu Giấy -Hà Nội','Cao mập'),(3,'Ngô','Thừa Ân','0926530902','thuaanvippro@gmail.com','1992-09-26','Nam','Tây Sơn -Bình Định','Thấp mập'),(4,'Tôn','Ngộ Không','0328765648','ngokhongso1@gmail.com','1990-10-20','Nam','Ngũ Hành Sơn - Đà Nẵng','Cao gầy'),(5,'Doanh','Doanh','0398870903','doanh3421@gmail.com','1998-09-11','Nữ','Dĩ An - Bình Dương','Xinh vãi'),(6,'Lâm','Tâm Như','09056738321','lamtamnhu2@gmail.com','2000-05-04','Nữ','Cao Lãnh - Đồng Tháp','Thấp Gầy'),(7,'Mai','Hà Trang','0935673287','trang3491@gmail.com','2001-05-31','Nữ','Nha Trang- Khánh Hòa','Thấp mập'),(8,'Ngô','Kỳ Ân','0316573821','anky21@gmail.com','2004-09-11','Nam','Quy Nhơn - Bình Định','Cao gầy'),(9,'Ngô','Gia','0346282222','nguyet2221@gmail.com','2000-10-04','Nam','Cầu Manh','da');
/*!40000 ALTER TABLE `BenhNhan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BenhNhan_DichVuYTe`
--

DROP TABLE IF EXISTS `BenhNhan_DichVuYTe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BenhNhan_DichVuYTe` (
  `MaBN` int(11) NOT NULL,
  `MaDV` int(11) NOT NULL,
  `Ngay` date NOT NULL,
  `Buoi` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SoLuong` int(11) DEFAULT NULL,
  `GhiChu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaBN`,`MaDV`,`Ngay`,`Buoi`),
  KEY `MaDV` (`MaDV`),
  CONSTRAINT `BenhNhan_DichVuYTe_ibfk_1` FOREIGN KEY (`MaBN`) REFERENCES `BenhNhan` (`MaBN`),
  CONSTRAINT `BenhNhan_DichVuYTe_ibfk_2` FOREIGN KEY (`MaDV`) REFERENCES `DichVuYTe` (`MaDV`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BenhNhan_DichVuYTe`
--

LOCK TABLES `BenhNhan_DichVuYTe` WRITE;
/*!40000 ALTER TABLE `BenhNhan_DichVuYTe` DISABLE KEYS */;
INSERT INTO `BenhNhan_DichVuYTe` VALUES (4,3,'2023-09-12','Chiều',2,'null'),(5,3,'2023-09-13','Sáng',1,'null'),(7,3,'2023-09-12','Sáng',1,'null');
/*!40000 ALTER TABLE `BenhNhan_DichVuYTe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BuoiTrucCuaBacSi`
--

DROP TABLE IF EXISTS `BuoiTrucCuaBacSi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BuoiTrucCuaBacSi` (
  `Ngay` date NOT NULL,
  `Buoi` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaBS` int(11) NOT NULL,
  `SoLuongBNToiDa` int(11) DEFAULT NULL,
  `GhiChu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`Ngay`,`Buoi`,`MaBS`),
  KEY `MaBS` (`MaBS`),
  CONSTRAINT `BuoiTrucCuaBacSi_ibfk_1` FOREIGN KEY (`MaBS`) REFERENCES `BacSi` (`MaBS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BuoiTrucCuaBacSi`
--

LOCK TABLES `BuoiTrucCuaBacSi` WRITE;
/*!40000 ALTER TABLE `BuoiTrucCuaBacSi` DISABLE KEYS */;
INSERT INTO `BuoiTrucCuaBacSi` VALUES ('2023-09-06','Chiều',5,5,'Về Sớm '),('2023-09-10','Sáng',1,7,'null'),('2023-09-12','Chiều',6,4,'Đi họp ở trên Sài Gòn'),('2023-09-14','Sáng',3,7,'null'),('2023-09-17','Chiều',3,10,'null'),('2023-09-17','Sáng',3,6,'null'),('2023-10-10','Chiều',5,2,'da'),('2023-10-24','Chiều',7,21,'da'),('2023-10-24','Sáng',5,22,'da');
/*!40000 ALTER TABLE `BuoiTrucCuaBacSi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DichVuYTe`
--

DROP TABLE IF EXISTS `DichVuYTe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DichVuYTe` (
  `MaDV` int(11) NOT NULL AUTO_INCREMENT,
  `TenDV` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MoTaDV` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `GiaTien` decimal(10,2) DEFAULT NULL,
  `GhiChu` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaDV`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DichVuYTe`
--

LOCK TABLES `DichVuYTe` WRITE;
/*!40000 ALTER TABLE `DichVuYTe` DISABLE KEYS */;
INSERT INTO `DichVuYTe` VALUES (1,'Khám tổng quát(General Check-up)','Kiểm tra tổng thể sức khỏe, đánh giá các chỉ số cơ bản như huyết áp, nhiệt độ, tim mạch, và thực hiện các xét nghiệm cần thiết.',100.00,'null'),(2,'Khám Tim Mạch(Cardiovascular Examination)','Quy trình khám tim mạch này giúp xác định nguy cơ mắc bệnh tim mạch, đánh giá chức năng tim, và đề xuất phương pháp điều trị và quản lý phù hợp cho bệnh nhân.',150.00,'null'),(3,'Khám Nha Khoa (Dental Examination)',' Kiểm tra và chăm sóc sức khỏe răng miệng, kiểm tra vấn đề răng, nướu và hàm mặt.',300.00,'null\n'),(4,'Khám Mắt (Eye Examination)','Kiểm tra và đánh giá tình trạng mắt, kiểm tra thị lực và tìm hiểu về bất kỳ vấn đề mắt nào.',200.00,'null'),(5,'Khám Tai Mũi Họng (ENT Examination)',' Kiểm tra và đánh giá vấn đề tai, mũi, họng và các vấn đề liên quan.',200.00,'null'),(6,'Khám Phụ Khoa (Gynecological Examination)','Dành riêng cho phụ nữ, kiểm tra và đánh giá sức khỏe phụ khoa và hệ sinh dục nữ.',300.00,'null');
/*!40000 ALTER TABLE `DichVuYTe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `KhamBenh`
--

DROP TABLE IF EXISTS `KhamBenh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KhamBenh` (
  `MaBS` int(11) NOT NULL,
  `MaBN` int(11) NOT NULL,
  `Ngay` date NOT NULL,
  `Buoi` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaYTa` int(11) DEFAULT NULL,
  `KetQuaChuanDoanBenh` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `GhiChu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MaThuoc` int(11) DEFAULT NULL,
  `ThanhToan` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`MaBS`,`MaBN`,`Ngay`,`Buoi`),
  KEY `MaYta` (`MaYTa`),
  KEY `KhamBenh_ibfk_2` (`MaBN`),
  KEY `KhamBenh_ibfk_4` (`MaThuoc`),
  CONSTRAINT `KhamBenh_ibfk_1` FOREIGN KEY (`MaBS`) REFERENCES `BacSi` (`MaBS`),
  CONSTRAINT `KhamBenh_ibfk_2` FOREIGN KEY (`MaBN`) REFERENCES `BenhNhan` (`MaBN`),
  CONSTRAINT `KhamBenh_ibfk_3` FOREIGN KEY (`MaYTa`) REFERENCES `YTa` (`MaYT`),
  CONSTRAINT `KhamBenh_ibfk_4` FOREIGN KEY (`MaThuoc`) REFERENCES `Thuoc` (`MaThuoc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `KhamBenh`
--

LOCK TABLES `KhamBenh` WRITE;
/*!40000 ALTER TABLE `KhamBenh` DISABLE KEYS */;
INSERT INTO `KhamBenh` VALUES (3,3,'2023-09-14','Chiều',2,'daffff','fa',2,1),(3,3,'2023-09-14','Sáng',2,'daffff','fa',2,0),(4,3,'2023-09-14','Chiều',2,'daffff','fa',2,0),(4,4,'2023-10-06','Chiều',2,'ung thư','null',2,1),(5,3,'2023-10-10','Chiều',2,'daffff','fa',2,0),(5,3,'2023-10-10','Sáng',2,'daffff','fa',2,0),(5,4,'2023-09-06','Chiều',2,'da','da',2,0),(5,4,'2023-10-07','Chiều',1,'da','da',2,0),(5,5,'2023-09-06','Chiều',2,'da','da',2,0),(5,5,'2023-10-13','Chiều',1,'fa','fa',4,0),(5,6,'2023-09-06','Chiều',2,'da','da',2,0),(5,6,'2023-10-10','Chiều',2,'da','da',2,1),(5,7,'2023-09-06','Chiều',2,'da','da',2,0),(5,7,'2023-10-05','Chiều',2,'da','da',2,0),(5,7,'2023-10-12','Chiều',2,'da','da',2,0),(6,3,'2023-09-14','Chiều',2,'daffff','fa',2,0),(6,5,'2023-10-04','Sáng',2,'da','da',2,0),(6,6,'2023-10-05','Sáng',1,'daffff','faa',4,0),(7,7,'2023-10-06','Chiều',2,'da','da',2,0);
/*!40000 ALTER TABLE `KhamBenh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LichHenBenhNhan`
--

DROP TABLE IF EXISTS `LichHenBenhNhan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LichHenBenhNhan` (
  `Ngay` date NOT NULL,
  `Buoi` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaBS` int(11) NOT NULL,
  `MaBN` int(11) NOT NULL,
  PRIMARY KEY (`Ngay`,`Buoi`,`MaBS`,`MaBN`),
  KEY `MaBS` (`MaBS`),
  KEY `LichHenBenhNhan_ibfk_3` (`MaBN`),
  CONSTRAINT `LichHenBenhNhan_ibfk_1` FOREIGN KEY (`MaBS`) REFERENCES `BacSi` (`MaBS`),
  CONSTRAINT `LichHenBenhNhan_ibfk_3` FOREIGN KEY (`MaBN`) REFERENCES `BenhNhan` (`MaBN`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LichHenBenhNhan`
--

LOCK TABLES `LichHenBenhNhan` WRITE;
/*!40000 ALTER TABLE `LichHenBenhNhan` DISABLE KEYS */;
INSERT INTO `LichHenBenhNhan` VALUES ('2023-09-15','Sáng',1,4),('2023-09-20','Sáng',1,3),('2023-09-16','Chiều',5,4),('2023-09-16','Sáng',6,4);
/*!40000 ALTER TABLE `LichHenBenhNhan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LichTrucYTa`
--

DROP TABLE IF EXISTS `LichTrucYTa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LichTrucYTa` (
  `Ngay` date NOT NULL,
  `Buoi` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaYTa` int(11) NOT NULL,
  `SoLuongBNToiDa` int(11) DEFAULT NULL,
  `GhiChu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`Ngay`,`Buoi`,`MaYTa`),
  KEY `MaYTa` (`MaYTa`),
  CONSTRAINT `LichTrucYTa_ibfk_1` FOREIGN KEY (`MaYTa`) REFERENCES `YTa` (`MaYT`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LichTrucYTa`
--

LOCK TABLES `LichTrucYTa` WRITE;
/*!40000 ALTER TABLE `LichTrucYTa` DISABLE KEYS */;
INSERT INTO `LichTrucYTa` VALUES ('2023-10-13','Chiều',2,13,'null'),('2023-10-19','Chiều',3,22,'da'),('2023-10-19','Sáng',1,12,'null'),('2023-10-20','Chiều',3,22,'da'),('2023-10-21','Sáng',2,11,'d');
/*!40000 ALTER TABLE `LichTrucYTa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `NguoiDung`
--

DROP TABLE IF EXISTS `NguoiDung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `NguoiDung` (
  `MaNguoiDung` int(11) NOT NULL AUTO_INCREMENT,
  `TenDangNhap` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MatKhau` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `GhiChu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaNguoiDung`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `NguoiDung`
--

LOCK TABLES `NguoiDung` WRITE;
/*!40000 ALTER TABLE `NguoiDung` DISABLE KEYS */;
INSERT INTO `NguoiDung` VALUES (7,'ad1','$2a$10$4V.C4ua0KHEkksQAygFbDeHkJefDgdI0XESm4QkRG2jTFUegxWEFu','bác sĩ Nguyễn Hạnh'),(8,'ad2','$2a$10$eYWOXlBK0iS32GEC0.Ua8OXujPJckYLSFYAVeAx8gQ2..Jers/Pwe','bác sĩ Nguyễn Cao Danh'),(9,'ad3','$2a$10$DTEEqR4zV8vzFZfdB9703OMQIv0psEZMsANRjWe5/2wPfsEzfUiUy','bác sĩ Hà Huy Cận'),(10,'ad4','$2a$10$OXDGF9neYP8CLwUyG30kzeFk1kHTglEFnwpV9Qp4m70QE/H7xU3Aq','bác sĩ Khúc Vân Anh'),(16,'admin','$2a$10$WblNpZLNgpQnNmHAIL1woOm3x1PNWSjytiHJzB9P8Cv75sZ3SEHvq','admin'),(17,'ad0','$2a$10$AAof8oq./0wVybAv1CD1O.qadh0J1cHJ7DdH2ChLAgg9YaDLqOVbq','bác sĩ Lê Bách'),(18,'ad5','$2a$10$AAof8oq./0wVybAv1CD1O.qadh0J1cHJ7DdH2ChLAgg9YaDLqOVbq','bác sĩ Trần Huy Hoàng'),(19,'ad6','$2a$10$AAof8oq./0wVybAv1CD1O.qadh0J1cHJ7DdH2ChLAgg9YaDLqOVbq','bác sĩ Cù Bá Kiến'),(20,'ad7','$2a$10$AAof8oq./0wVybAv1CD1O.qadh0J1cHJ7DdH2ChLAgg9YaDLqOVbq','y tá Hà Thị Nguyệt'),(21,'ad8','$2a$10$AAof8oq./0wVybAv1CD1O.qadh0J1cHJ7DdH2ChLAgg9YaDLqOVbq','y tá Nguyễn Kiều'),(22,'ad9','$2a$10$AAof8oq./0wVybAv1CD1O.qadh0J1cHJ7DdH2ChLAgg9YaDLqOVbq','y tá Trần Thị Anh'),(23,'da1','$2a$10$HgULO3HU2A1gwnNIuer/c.tPLo82DaPLDCM4nXzTR26S7RaGLcDUi',NULL),(24,'da2','$2a$10$HgULO3HU2A1gwnNIuer/c.tPLo82DaPLDCM4nXzTR26S7RaGLcDUi',NULL);
/*!40000 ALTER TABLE `NguoiDung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Thuoc`
--

DROP TABLE IF EXISTS `Thuoc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Thuoc` (
  `MaThuoc` int(11) NOT NULL AUTO_INCREMENT,
  `TenThuoc` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `CongDung` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DonVi` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SoLuong` int(11) DEFAULT NULL,
  `GhiChu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaThuoc`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Thuoc`
--

LOCK TABLES `Thuoc` WRITE;
/*!40000 ALTER TABLE `Thuoc` DISABLE KEYS */;
INSERT INTO `Thuoc` VALUES (1,'hidosi','giảm mỏi','Vỉ',2,'ko3'),(2,'kodafjad','giảm nhức','Lọ',19,'ko'),(3,'asakid','giảm sốt','Chai',5,'ko'),(4,'huyhuy','met','cahi',0,'đa');
/*!40000 ALTER TABLE `Thuoc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `YTa`
--

DROP TABLE IF EXISTS `YTa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `YTa` (
  `MaYT` int(11) NOT NULL AUTO_INCREMENT,
  `HoYT` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TenYT` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SoDT` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `BangCap` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ChuyenMon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `GioiTinh` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MaNguoiDung` int(11) DEFAULT NULL,
  `GhiChu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaYT`),
  KEY `MaNguoiDung` (`MaNguoiDung`),
  CONSTRAINT `YTa_ibfk_1` FOREIGN KEY (`MaNguoiDung`) REFERENCES `NguoiDung` (`MaNguoiDung`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `YTa`
--

LOCK TABLES `YTa` WRITE;
/*!40000 ALTER TABLE `YTa` DISABLE KEYS */;
INSERT INTO `YTa` VALUES (1,'Trần','Thị Anh','036 7304512','anhanh24@gmail.com','Bác sĩ y tế','Tim mạch','Nữ',22,'null'),(2,'Nguyễn','Kiều','0398870903','kieunguyen23@gmail.com','Tiến Sĩ Y Tá ','Tổng Quát','Nữ',21,'null'),(3,'Hà','Thị Nguyệt','09056738321','nguyet321@gmail.com','Y Tá Thạc Sĩ','Nha Khoa','Nữ',20,'null');
/*!40000 ALTER TABLE `YTa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'luonghuy'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-26 18:13:23
