-- Seeder: usuarios de prueba
-- La contraseña de todos es: password123
-- Hash bcrypt ($2b$10$...) de "password123"
-- NOTA: admin@rank.com ya es creado por init.js; este seeder agrega los demás usuarios

INSERT IGNORE INTO rank.users (name, surname, email, password, birth_date, gender_id, role, email_verified) VALUES
('Natalia',    'Vega',       'natalia@rank.com',           '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '2000-03-15', 2, 'user',      1),
('Martín',     'López',      'martin.lopez@rank.com',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '1998-07-22', 1, 'user',      1),
('Carla',      'Gómez',      'carla.gomez@rank.com',       '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '2001-11-05', 2, 'user',      1),
('Diego',      'Fernández',  'diego.fernandez@rank.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '1997-04-18', 1, 'user',      1),
('Lucía',      'Martínez',   'lucia.martinez@rank.com',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '2002-09-30', 2, 'user',      1),
('Pablo',      'Rodríguez',  'pablo.rodriguez@rank.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '1999-01-14', 1, 'user',      1),
('Valentina',  'Suárez',     'valentina.suarez@rank.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '2003-06-08', 2, 'user',      1),
('Facundo',    'García',     'facundo.garcia@rank.com',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '1996-12-22', 1, 'user',      1),
('Sofía',      'Pérez',      'sofia.perez@rank.com',       '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '2001-03-03', 2, 'user',      1),
('Juan',       'Herrera',    'juan.herrera@rank.com',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '1995-08-17', 1, 'user',      1),
('Ana',        'Torres',     'ana.torres@rank.com',        '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '2000-05-25', 2, 'user',      1),
('Nicolás',    'Romero',     'nicolas.romero@rank.com',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '1998-10-11', 1, 'user',      1),
('Florencia',  'Díaz',       'florencia.diaz@rank.com',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '1997-02-28', 2, 'moderator', 1),
('Sebastián',  'Ruiz',       'sebastian.ruiz@rank.com',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '2002-07-04', 1, 'user',      1);
