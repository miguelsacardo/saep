CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$1000000$5ptnrnTkTHwnuucz9M0HSz$ZuASMMtERF7c81kxtTYfHIRAhwQkhMNcH4nlWUAdJzg=','2025-11-24 18:07:39.128320',1,'lin','','','lin@gmail.com',1,1,'2025-11-24 18:07:01.342079');

CREATE TABLE `app_produto` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` longtext,
  `min_stock` int NOT NULL,
  `current_stock` int NOT NULL,
  `material` varchar(50) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `app_produto` VALUES 
(1,'Martelo','Martelo com cabo de madeira envernizado e cabeça fixada com cunha metálica.',10,100,'Aço Carbono e Madeira','2025-11-24 18:24:33.796598','2025-11-24 18:27:34.181649'),
(2,'Chave de Fenda Philips','Haste em aço cromo vanádio, ponta imantada e cabo anatômico.',20,30,'Aço Cromo Vanádio e PVC','2025-11-24 18:25:07.933246','2025-11-24 18:29:01.196604'),
(3,'Alicate Universal 8','Alicate para corte e torção de fios, com isolamento elétrico de até 1000V',5,30,'Aço Temperado e Borracha','2025-11-24 18:25:56.103232','2025-11-24 18:25:56.103252');

CREATE TABLE `app_estoque` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `movement_type` varchar(3) NOT NULL,
  `quantity` int unsigned NOT NULL,
  `movement_date` datetime(6) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `product_id` bigint NOT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `app_estoque_product_id_fk` (`product_id`),
  KEY `app_estoque_user_id_fk` (`user_id`),
  CONSTRAINT `app_estoque_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `app_produto` (`id`),
  CONSTRAINT `app_estoque_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `app_estoque_chk_1` CHECK ((`quantity` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `app_estoque` VALUES 
(1,'IN',50,'2025-11-24 18:27:25.000000','2025-11-24 18:27:34.182191',1,1),
(2,'IN',20,'2025-11-23 18:27:49.000000','2025-11-24 18:28:26.820535',2,1),
(3,'OUT',5,'2025-11-24 18:28:45.000000','2025-11-24 18:29:01.197022',2,1);
