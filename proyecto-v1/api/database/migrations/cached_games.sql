CREATE TABLE `cached_games` (
  `title` varchar(100) NOT NULL,
  `thumbnail` varchar(100) NOT NULL,
  `api_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`api_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;