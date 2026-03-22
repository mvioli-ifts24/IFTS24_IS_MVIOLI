-- Script de inicialización de la base de datos
-- Ejecutar este script para crear todas las tablas necesarias

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS rank;
USE rank;

-- Tabla de géneros de usuario
SOURCE database/migrations/users_genders.sql;

-- Tabla de usuarios
SOURCE database/migrations/users.sql;

-- Tabla de ratings de reseñas
SOURCE database/migrations/games_reviews_ratings.sql;

-- Tabla de juegos cacheados
SOURCE database/migrations/cached_games.sql;

-- Tabla de reseñas de juegos
SOURCE database/migrations/games_reviews.sql;

-- Tabla de mensajes de contacto
SOURCE database/migrations/contact_messages.sql;

-- Tabla de banners
SOURCE database/migrations/banners.sql;

-- Tabla de sponsors
SOURCE database/migrations/sponsors.sql;

-- Insertar datos iniciales
SOURCE database/seeders/users_genders.sql;
SOURCE database/seeders/games_reviews_ratings.sql;

-- Crear usuario administrador por defecto (contraseña: admin123)
INSERT INTO users (name, surname, email, password, gender_id, role, profile_picture_filename)
VALUES ('Admin', 'Sistema', 'admin@rank.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 'admin', 'default.jpg')
ON DUPLICATE KEY UPDATE email=email;