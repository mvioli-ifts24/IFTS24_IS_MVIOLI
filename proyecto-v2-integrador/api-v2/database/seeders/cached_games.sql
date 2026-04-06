-- Seeder: 15 juegos populares free-to-play de FreeToGame
-- IDs verificados contra la API: https://www.freetogame.com/api/games
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM rank.cached_games;
SET FOREIGN_KEY_CHECKS = 1;
INSERT INTO rank.cached_games (api_id, title, thumbnail) VALUES
(475,  'Genshin Impact',     'https://www.freetogame.com/g/475/thumbnail.jpg'),
(57,   'Fortnite',           'https://www.freetogame.com/g/57/thumbnail.jpg'),
(466,  'Valorant',           'https://www.freetogame.com/g/466/thumbnail.jpg'),
(3,    'Warframe',           'https://www.freetogame.com/g/3/thumbnail.jpg'),
(226,  'Path of Exile',      'https://www.freetogame.com/g/226/thumbnail.jpg'),
(2,    'World of Tanks',     'https://www.freetogame.com/g/2/thumbnail.jpg'),
(23,   'Apex Legends',       'https://www.freetogame.com/g/23/thumbnail.jpg'),
(21,   'Destiny 2',          'https://www.freetogame.com/g/21/thumbnail.jpg'),
(523,  'Fall Guys',          'https://www.freetogame.com/g/523/thumbnail.jpg'),
(229,  'Dota 2',             'https://www.freetogame.com/g/229/thumbnail.jpg'),
(286,  'League of Legends',  'https://www.freetogame.com/g/286/thumbnail.jpg'),
(12,   'War Thunder',        'https://www.freetogame.com/g/12/thumbnail.jpg'),
(6,    'Blade and Soul',     'https://www.freetogame.com/g/6/thumbnail.jpg'),
(477,  'Eternal Return',     'https://www.freetogame.com/g/477/thumbnail.jpg'),
(217,  'Smite',              'https://www.freetogame.com/g/217/thumbnail.jpg');
