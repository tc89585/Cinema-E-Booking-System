-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: cinema-ebooking
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `movies`
--

DROP TABLE IF EXISTS `movies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movies` (
  `Movie Title` varchar(45) NOT NULL,
  `Category` varchar(45) NOT NULL,
  `Cast` varchar(45) NOT NULL,
  `Director` varchar(45) NOT NULL,
  `Producer` varchar(45) NOT NULL,
  `Synopsis` varchar(450) NOT NULL,
  `Reviews` int NOT NULL,
  `US-Film Rating Code` varchar(45) NOT NULL,
  `Show Dates` varchar(45) NOT NULL,
  PRIMARY KEY (`Movie Title`,`Category`,`Cast`,`Director`,`Producer`,`Synopsis`,`Reviews`,`US-Film Rating Code`,`Show Dates`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movies`
--

LOCK TABLES `movies` WRITE;
/*!40000 ALTER TABLE `movies` DISABLE KEYS */;
INSERT INTO `movies` VALUES ('Insidious','Horror','Patrick Wilson, Ty Simpkins','Patrick Wilson','Sony Pictures','Josh Lambert heads east to drop his son, Dalton, off at school. However, Dalton\'s college dream soon becomes a living nightmare when the repressed demons of his past suddenly return to haunt them both',3,'R','Monday: 4pm'),('Mission Impossible','Action','Tom Cruise, Hayley Atwell','Christopher Mcquarrie','Paramount Pictures','Ethan Hunt and the IMF team must track down a terrifying new weapon that threatens all of humanity if it falls into the wrong hands. ',5,'PG-13','Monday: 3pm'),('Oppenheimer','Drama','Robert Downey, ','Christopher Nolan','Universal Pictures','During World War II, Lt. Gen. Leslie Groves Jr. appoints physicist J. Robert Oppenheimer to work on the top-secret Manhattan Project. Oppenheimer and a team of scientists spend years developing and designing the atomic bomb.',5,'R','Monday: 2pm');
/*!40000 ALTER TABLE `movies` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-01 19:12:12
