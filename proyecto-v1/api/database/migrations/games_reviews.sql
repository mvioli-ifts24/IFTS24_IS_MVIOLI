CREATE TABLE `games_reviews` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `rating_id` bigint unsigned NOT NULL,
  `api_game_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `games_reviews_unique` (`api_game_id`,`user_id`),
  KEY `games_reviews_games_reviews_ratings_FK` (`rating_id`),
  KEY `games_reviews_users_FK` (`user_id`),
  CONSTRAINT `games_reviews_cached_games_FK` FOREIGN KEY (`api_game_id`) REFERENCES `cached_games` (`api_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `games_reviews_games_reviews_ratings_FK` FOREIGN KEY (`rating_id`) REFERENCES `games_reviews_ratings` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `games_reviews_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;