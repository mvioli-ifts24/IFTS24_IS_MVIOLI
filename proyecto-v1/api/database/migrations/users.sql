CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `gender_id` bigint unsigned NOT NULL,
  `is_admin` tinyint NOT NULL DEFAULT '0',
  `accept_newsletter` tinyint NOT NULL DEFAULT '0',
  `profile_picture_filename` varchar(255) NOT NULL,
  `about` varchar(145) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_unique` (`email`),
  KEY `users_user_genders_FK` (`gender_id`),
  CONSTRAINT `users_user_genders_FK` FOREIGN KEY (`gender_id`) REFERENCES `users_genders` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;