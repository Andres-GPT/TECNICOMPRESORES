-- MySQL dump 10.13  Distrib 9.2.0, for Win64 (x86_64)
--
-- Host: localhost    Database: tecnicompresores
-- ------------------------------------------------------
-- Server version	9.2.0

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
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `cedula` int NOT NULL,
  `nombre` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `apellido` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `telefono` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `correo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `direccion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Andres','Abril','312534546','abril@gmail.com','calle 13N 13-07 Nueva Colombia(Las Américas)'),(2,'Franklin','Ronquillo','322634235','ronquillo@gmail.com','san eduardo'),(6546,'Jainer','Garcia','12412','pilarUser@gmail.com','calle 13N 13-07 Las Américas');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuraciones`
--

DROP TABLE IF EXISTS `configuraciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuraciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `logo` text NOT NULL,
  `leyenda` text NOT NULL,
  `fecha_modificacion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuraciones`
--

LOCK TABLES `configuraciones` WRITE;
/*!40000 ALTER TABLE `configuraciones` DISABLE KEYS */;
INSERT INTO `configuraciones` VALUES (1,'/uploads/1739049525072.png','No nos hacemos responsables por pérdida o daño de la máquina después de 24 horas de haber sido notificado de la entrega. Por favor revise su máquina al momento de retirarla.','2025-02-03 15:50:49');
/*!40000 ALTER TABLE `configuraciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maquinas`
--

DROP TABLE IF EXISTS `maquinas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maquinas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `observacion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `fecha_entrada` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('pendiente por revisión','en espera de aprobación','en proceso','pendiente por recoger','terminado') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `estante` int NOT NULL,
  `nivel` int NOT NULL,
  `id_cliente` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_id_cliente` (`id_cliente`),
  CONSTRAINT `fk_id_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`cedula`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maquinas`
--

LOCK TABLES `maquinas` WRITE;
/*!40000 ALTER TABLE `maquinas` DISABLE KEYS */;
INSERT INTO `maquinas` VALUES (53,'sfasfa','fgafaf','2025-02-08 21:06:34','terminado',1,2,1),(54,'maquina','maquina','2025-02-08 21:07:25','pendiente por recoger',2,3,6546),(55,'maquibnafaf','fafasffsaf','2025-02-08 21:15:06','terminado',4,5,2),(56,'Maquina afajhfahfa fhafhafkahf fjhafjahfgjahg hfjahgjahgjab jfihaighaighabaj ajfh vajhgaihgaj vajbvuiashv asivhaiv aujivbauv auivb juiavbj vjka uiab','fafajhfahfa fhafhafkahf fjhafjahfgjahg hfjahgjahgjab jfihaighaighabaj ajfh vajhgaihgaj vajbvuiashv asivhaiv aujivbauv auivb juiavbj vjka uiab','2025-02-08 21:33:32','pendiente por recoger',34,43,2),(57,'maquina','maquina','2025-02-09 14:45:32','en proceso',0,0,1),(58,'maquina 2','maquina 2','2025-02-09 14:49:59','en proceso',0,0,2),(59,'maquina nieva','gagebfs','2025-02-09 15:31:03','en proceso',0,0,2),(60,'fhfdh','hfdh','2025-02-09 15:46:44','terminado',80,98,1),(61,'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has s','Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has s','2025-02-09 15:58:33','en proceso',0,0,2);
/*!40000 ALTER TABLE `maquinas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notas_llamadas`
--

DROP TABLE IF EXISTS `notas_llamadas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notas_llamadas` (
  `id_nota` int NOT NULL AUTO_INCREMENT,
  `nota` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_maquina` int NOT NULL,
  PRIMARY KEY (`id_nota`),
  KEY `fk_id_maquina_notas` (`id_maquina`),
  CONSTRAINT `fk_id_maquina_notas` FOREIGN KEY (`id_maquina`) REFERENCES `maquinas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notas_llamadas`
--

LOCK TABLES `notas_llamadas` WRITE;
/*!40000 ALTER TABLE `notas_llamadas` DISABLE KEYS */;
INSERT INTO `notas_llamadas` VALUES (10,'nota','2025-02-08 21:10:09',53),(11,'nota','2025-02-09 00:47:05',55),(12,'notita','2025-02-09 15:48:29',60),(13,'','2025-02-09 15:48:36',54);
/*!40000 ALTER TABLE `notas_llamadas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `procedimientos`
--

DROP TABLE IF EXISTS `procedimientos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `procedimientos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `estado_cliente` enum('aceptado','rechazado','pendiente') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pendiente',
  `costo_revision` decimal(10,2) NOT NULL DEFAULT '0.00',
  `costo_procedimiento` decimal(10,2) NOT NULL DEFAULT '0.00',
  `fecha_revision` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_maquina` int NOT NULL,
  `id_tecnico` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_id_maquina` (`id_maquina`),
  KEY `fk_tecnico_procedimiento_idx` (`id_tecnico`),
  CONSTRAINT `fk_id_maquina` FOREIGN KEY (`id_maquina`) REFERENCES `maquinas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_tecnico_procedimiento` FOREIGN KEY (`id_tecnico`) REFERENCES `tecnicos` (`cedula`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `procedimientos`
--

LOCK TABLES `procedimientos` WRITE;
/*!40000 ALTER TABLE `procedimientos` DISABLE KEYS */;
INSERT INTO `procedimientos` VALUES (43,'procedimiento','rechazado',1242.00,0.00,'2025-02-08 21:08:08',53,124),(44,'fasf','aceptado',12.00,42.00,'2025-02-08 21:08:58',54,124),(45,'fafa','aceptado',1232.00,323.00,'2025-02-08 21:15:21',55,124),(46,'nuevo','aceptado',40000000.00,3.00,'2025-02-08 21:33:58',56,124),(47,'procedimiento','aceptado',150000.00,160000.00,'2025-02-09 14:48:00',57,124),(48,'proceso','aceptado',20.00,100.00,'2025-02-09 15:09:54',58,124),(49,'procedimenmt xd','aceptado',150000.00,100000.00,'2025-02-09 15:38:33',59,124),(50,'gdfgs','rechazado',160000.00,0.00,'2025-02-09 15:46:55',60,124),(51,'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a ga','aceptado',150000.00,100000.00,'2025-02-09 16:01:04',61,124);
/*!40000 ALTER TABLE `procedimientos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recibos`
--

DROP TABLE IF EXISTS `recibos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recibos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha_generacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_maquina` int NOT NULL,
  `id_configuracion` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_id_maquina_recibo` (`id_maquina`),
  KEY `fk_configuracion_recibo_idx` (`id_configuracion`),
  CONSTRAINT `fk_configuracion_recibo` FOREIGN KEY (`id_configuracion`) REFERENCES `configuraciones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_id_maquina_recibo` FOREIGN KEY (`id_maquina`) REFERENCES `maquinas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recibos`
--

LOCK TABLES `recibos` WRITE;
/*!40000 ALTER TABLE `recibos` DISABLE KEYS */;
INSERT INTO `recibos` VALUES (18,'2025-02-08 21:08:43',53,1),(19,'2025-02-08 21:09:45',54,1),(20,'2025-02-08 21:15:40',55,1),(21,'2025-02-09 15:47:40',60,1),(22,'2025-02-09 16:06:57',56,1);
/*!40000 ALTER TABLE `recibos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tecnicos`
--

DROP TABLE IF EXISTS `tecnicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tecnicos` (
  `cedula` int NOT NULL,
  `nombre` varchar(128) NOT NULL,
  `apellido` varchar(128) NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  PRIMARY KEY (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tecnicos`
--

LOCK TABLES `tecnicos` WRITE;
/*!40000 ALTER TABLE `tecnicos` DISABLE KEYS */;
INSERT INTO `tecnicos` VALUES (124,'Técnico','Tecnico','12324','activo');
/*!40000 ALTER TABLE `tecnicos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-09 11:41:27
