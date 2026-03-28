INSERT INTO `user_roles` (name, label) VALUES ('admin', 'Administrador') ON DUPLICATE KEY UPDATE label = VALUES(label);
INSERT INTO `user_roles` (name, label) VALUES ('moderator', 'Moderador') ON DUPLICATE KEY UPDATE label = VALUES(label);
INSERT INTO `user_roles` (name, label) VALUES ('user', 'Usuario') ON DUPLICATE KEY UPDATE label = VALUES(label);
