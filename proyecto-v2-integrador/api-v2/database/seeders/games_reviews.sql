-- Seeder: reseñas de 15 juegos con 15 usuarios distintos
-- Distribución: 14 usuarios × 4 reseñas c/u = 56 reseñas en total
-- Contraseña de todos los usuarios seed: password123
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM rank.games_reviews;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- Genshin Impact (api_id: 475)
-- ============================================================
INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Masterpiece absoluto', 'Genshin Impact redefinió lo que puede ser un free-to-play. El mundo abierto es enorme y lleno de secretos, los personajes tienen diseños únicos y la historia principal engancha desde el primer capítulo. El gacha puede ser frustrante si no tenés paciencia F2P, pero hay muchísimo contenido gratuito.', 5, 475, id, '2026-03-20 14:30:00' FROM rank.users WHERE email = 'natalia@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Bello pero dependiente del gacha', 'El trabajo artístico es impresionante y explorar Teyvat es un placer. Sin embargo, el sistema de gacha y los pases de batalla hacen que sentir el progreso de manera justa sea complicado. Recomendado para quienes tienen paciencia y disfrutan el lore.', 3, 475, id, '2026-03-12 10:15:00' FROM rank.users WHERE email = 'diego.fernandez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'El mejor free-to-play del momento', 'Increíble cantidad de contenido gratuito, personajes carismáticos y una banda sonora que te deja sin palabras. Si esquivás el gacha o no te importa no tener los mejores personajes, podés pasar cientos de horas sin gastar un peso.', 5, 475, id, '2026-02-28 22:00:00' FROM rank.users WHERE email = 'facundo.garcia@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Buen juego con monetización agresiva', 'Reconozco que el juego es muy bueno a nivel visual y en términos de jugabilidad, pero el sistema de gacha me arruinó la experiencia. Si podés ignorar el meta y los nuevos personajes, vas a disfrutarlo mucho. Si no, preparate para frustración.', 2, 475, id, '2026-01-15 16:45:00' FROM rank.users WHERE email = 'nicolas.romero@rank.com';

-- ============================================================
-- Fortnite (api_id: 57)
-- ============================================================
INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Siempre reinventándose', 'Fortnite es el battle royale que no para de innovar. Cada temporada trae cambios radicales al mapa, colaboraciones increíbles y nuevos modos de juego. Las construcciones pueden sentirse abrumadoras al principio, pero aprender a usarlas te da una ventaja enorme.', 4, 57, id, '2026-03-18 19:00:00' FROM rank.users WHERE email = 'natalia@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Muy divertido con amigos', 'Jugar Fortnite en squad con amigos es una de las experiencias más entretenidas que tuve en un battle royale. El modo Zero Build es perfecto para quienes no queremos perder tiempo aprendiendo construcciones. Las skins y colaboraciones con franquicias conocidas son un plus.', 4, 57, id, '2026-03-05 21:30:00' FROM rank.users WHERE email = 'lucia.martinez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Se perdió en las colaboraciones', 'Antes Fortnite tenía identidad propia. Ahora parece un shopping de franquicias. El juego en sí sigue siendo sólido y el modo Zero Build lo salvó para muchos, pero extraño cuando se sentía como un mundo cohesivo y no un evento de crossover interminable.', 3, 57, id, '2026-02-14 17:00:00' FROM rank.users WHERE email = 'facundo.garcia@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Perfecto para entrar al género', 'Si nunca jugaste un battle royale, Fortnite es un muy buen punto de entrada. Es colorido, accesible y tiene una curva de aprendizaje suave. La comunidad puede ser complicada en nivel competitivo, pero los modos casuales son muy amigables.', 4, 57, id, '2026-01-30 11:20:00' FROM rank.users WHERE email = 'nicolas.romero@rank.com';

-- ============================================================
-- Valorant (api_id: 466)
-- ============================================================
INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'El shooter táctico definitivo', 'Valorant mezcla a la perfección la precisión de CS con habilidades únicas por agente. El sistema de economía añade otra capa estratégica, y el rankeo —aunque frustrante a veces— es muy satisfactorio cuando subís. El anti-cheat puede ser invasivo, ojo.', 5, 466, id, '2026-03-25 20:00:00' FROM rank.users WHERE email = 'natalia@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Curva de aprendizaje empinada pero vale', 'Al principio Valorant puede parecer injusto. Los más experimentados te barren fácil. Pero si te comprometés a mejorar la puntería y aprender los mapas, la curva se invierte y es uno de los juegos más satisfactorios para progresar. Las actualizaciones de agentes son frescas.', 4, 466, id, '2026-02-22 15:10:00' FROM rank.users WHERE email = 'lucia.martinez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Riot sabe hacer un shooter', 'Riot tomó lo mejor de CS:GO y lo modernizó con habilidades únicas sin romper el balance. Los mapas están bien diseñados, el gunplay es satisfactorio y el sistema de audio es excelente para la comunicación táctica. Lo único que le falta es más variedad de modos.', 5, 466, id, '2026-02-10 09:40:00' FROM rank.users WHERE email = 'sofia.perez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Tóxico en ranked, divertido en casual', 'Valorant como juego es excelente: bien hecho, equilibrado y entretenido. El problema está en su comunidad cuando entrás a ranked. La cantidad de toxicidad, trolls y flamers arruina la experiencia. En casual es otra historia: mucho más relajado y disfrutable.', 3, 466, id, '2026-01-08 14:00:00' FROM rank.users WHERE email = 'nicolas.romero@rank.com';

-- ============================================================
-- Warframe (api_id: 3)
-- ============================================================
INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Profundidad sin igual', 'Warframe es de esos juegos que te enganchan para siempre. La cantidad de frames (personajes) es enorme, cada uno con habilidades únicas, y el sistema de modding es profundísimo. El contenido gratuito es generoso y Digital Extremes escucha mucho a la comunidad.', 5, 3, id, '2026-03-17 13:25:00' FROM rank.users WHERE email = 'natalia@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Fantástico pero abrumador al inicio', 'La curva de aprendizaje inicial de Warframe es una de las más duras que conocí. Sin guía prácticamente no entendés nada. Pero si pasás esa barrera, encontrás uno de los juegos más ricos y generosos en contenido de los F2P. La historia de El Segundo Sueño es magistral.', 4, 3, id, '2026-03-01 18:00:00' FROM rank.users WHERE email = 'lucia.martinez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Referente del género F2P', 'Warframe demuestra que un free-to-play puede ser justo y divertido sin necesidad de pay-to-win. El comercio entre jugadores equilibra perfectamente la economía. Exige tiempo de inversión, pero cada hora que le ponés se siente recompensada. Altamente recomendado.', 5, 3, id, '2026-02-05 12:00:00' FROM rank.users WHERE email = 'sofia.perez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Gran juego pero difícil de volver', 'Jugué Warframe durante meses y lo amé, pero después de un tiempo largo sin jugar, volver es casi imposible porque todo cambia drásticamente entre actualizaciones. Si podés comprometerte a jugar de forma continua, es excelente. Si no, puede frustrarte al regresar.', 3, 3, id, '2026-01-20 08:30:00' FROM rank.users WHERE email = 'florencia.diaz@rank.com';

-- ============================================================
-- Path of Exile (api_id: 226)
-- ============================================================
INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'El ARPG más profundo que existe', 'Path of Exile lleva la customización de personaje a niveles que ningún juego en el género alcanza. El árbol de habilidades pasivas es un mapa en sí mismo. La liga de temporada introduce mecánicas frescas constantemente. Si jugaste Diablo y querés más profundidad, no hay otro igual.', 5, 226, id, '2026-03-14 21:00:00' FROM rank.users WHERE email = 'martin.lopez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Brillante pero para jugadores dedicados', 'PoE no es para todo el mundo: requiere investigación, paciencia y muchas horas para entender sus sistemas. Como la segunda temporada mejoró mucho la experiencia inicial, puede ser un buen momento para entrar. La comunidad es super útil si tenés preguntas.', 4, 226, id, '2026-02-20 16:30:00' FROM rank.users WHERE email = 'lucia.martinez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Diablo pero en difícil', 'Si buscás relajarte después del trabajo, Path of Exile no es tu juego. Es intenso, demandante y requiere planificación. Pero si justamente te gusta ese desafío intelectual de optimizar builds y pushear el endgame, no hay nada mejor. Dominar un build propio es una satisfacción enorme.', 4, 226, id, '2026-01-25 14:15:00' FROM rank.users WHERE email = 'sofia.perez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Excelente pero con barreras enormes', 'El juego en sí es extraordinario, pero sus sistemas están tan mal explicados que la mayoría abandona antes de llegar al endgame. Un tutorial decente salvaría a miles de jugadores de frustrarse y dejarlo en las primeras horas. Espero que PoE 2 mejore esto.', 3, 226, id, '2026-01-12 11:00:00' FROM rank.users WHERE email = 'florencia.diaz@rank.com';

-- ============================================================
-- World of Tanks (api_id: 2)
-- ============================================================
INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'La experiencia tanque definitiva', 'World of Tanks es único en su género. La variedad de tanques históricos es impresionante, el sistema de daño es realista y las batallas de 15 vs 15 son muy dinámicas. La curva de aprendizaje puede intimidar, pero la comunidad y los tutoriales ayudan bastante.', 4, 2, id, '2026-03-10 09:00:00' FROM rank.users WHERE email = 'martin.lopez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Buen juego con monetización dudosa', 'El núcleo del juego es entretenido y los tanques premium añaden variedad, pero sentís constantemente que el juego te empuja a gastar para progresar más rápido. Con paciencia podés disfrutarlo sin pagar, pero puede hacerse lento. El matchmaking a veces es injusto.', 3, 2, id, '2026-02-16 19:45:00' FROM rank.users WHERE email = 'pablo.rodriguez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Horas y horas sin aburrirse', 'Llevo más de un año jugando World of Tanks y sigo encontrando cosas nuevas por descubrir. La variedad de naciones y tipos de vehículos es enorme, y cada uno juega diferente. El aspecto estratégico —posicionamiento, ángulos, spotting— hace que cada partida sea un puzzle.', 5, 2, id, '2026-01-28 13:00:00' FROM rank.users WHERE email = 'sofia.perez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Nostálgico y entretenido', 'WoT es uno de esos clásicos que resisten el paso del tiempo. Quizás no tenga los gráficos más modernos, pero la jugabilidad estratégica y la satisfacción de destruir rivales con un buen disparo siguen siendo únicas. Para el nicho que le gusta, es lo mejor que hay.', 4, 2, id, '2026-01-05 20:00:00' FROM rank.users WHERE email = 'florencia.diaz@rank.com';

-- ============================================================
-- Apex Legends (api_id: 23)
-- ============================================================
INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'El mejor battle royale en movimiento', 'Apex Legends tiene el mejor sistema de movimiento de cualquier battle royale. Las habilidades de los Legends están perfectamente balanceadas y el sistema de comunicación por pings hace posible jugar en equipo sin micrófono. Respawn sigue puliendo el juego con cada temporada.', 5, 23, id, '2026-03-22 20:15:00' FROM rank.users WHERE email = 'martin.lopez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Muy divertido pero bugs frustrantes', 'El gunplay de Apex es de los mejores en el mercado, la movilidad es adictiva y los Legends tienen personalidades geniales. El problema son los bugs técnicos persistentes y los problemas de servidores. EA debería invertir más en la infraestructura porque el juego lo merece.', 3, 23, id, '2026-03-08 17:30:00' FROM rank.users WHERE email = 'pablo.rodriguez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Enganchante y lleno de acción', 'La curva de aprendizaje de Apex es más accesible que otros shooters tácticos, pero el techo de habilidad es altísimo. Aprende a usar las habilidades de movimiento de Pathfinder o Octane y el juego se transforma en algo completamente diferente. Muy recomendado con squad de amigos.', 4, 23, id, '2026-02-01 12:45:00' FROM rank.users WHERE email = 'juan.herrera@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Temporada tras temporada, sigue vigente', 'Lo que más me gusta de Apex es que cada temporada cambia suficientemente el meta para mantener el juego fresco sin alienar a los jugadores de siempre. Los Legends nuevos suelen estar bien balanceados y los mapas tienen excelente diseño táctico. Uno de mis F2P favoritos.', 5, 23, id, '2026-01-10 15:20:00' FROM rank.users WHERE email = 'florencia.diaz@rank.com';

-- ============================================================
-- Destiny 2 (api_id: 21)
-- ============================================================
INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'El gunplay más satisfactorio de un MMO', 'Ningún juego te hace sentir tan poderoso disparando como Destiny 2. Cada arma tiene peso y feedback propio, las habilidades de subclase son divertidísimas de usar y las Raids son de las mejores experiencias cooperativas que existen en los videojuegos. Le perdono muchas cosas gracias a eso.', 5, 21, id, '2026-03-19 22:30:00' FROM rank.users WHERE email = 'martin.lopez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Impresionante pero necesita amigos', 'Destiny 2 es uno de los mejores shooters PvE que existen, pero buena parte de su contenido más interesante (Raids, Mazmoras) requiere un grupo coordinado. Si tenés ese grupo, la experiencia es inmejorable. Solo, se siente más limitado aunque igual tiene contenido valioso.', 4, 21, id, '2026-02-25 18:00:00' FROM rank.users WHERE email = 'pablo.rodriguez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Historia excepcional', 'La expansión La Reina de los Brujados marcó un antes y después en la narrativa de Destiny 2. La forma en que cuenta la historia a través del gameplay es brillante. El free-to-play base está bien, pero las expansiones valen cada peso. El lore es one of the best en los videojuegos.', 5, 21, id, '2026-02-08 10:30:00' FROM rank.users WHERE email = 'juan.herrera@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Bungie lo complica demasiado', 'El modelo de contenido de Destiny 2 es confuso y frustrante para nuevosjugadores. No sabés qué expansión comprarte, qué contenido está activo, qué vas a perder por la "vaulting" de Bungie. El juego en sí es increíble, pero la gestión de contenido es un desastre. Necesita una presentación más clara.', 2, 21, id, '2026-01-18 23:00:00' FROM rank.users WHERE email = 'sebastian.ruiz@rank.com';

-- ============================================================
-- Fall Guys (api_id: 523)
-- ============================================================
INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Pura diversión y risas', 'Fall Guys es el antídoto perfecto contra los shooters serios. Cada ronda es una caja de sorpresas: puede que pierdas por un salto mal calculado o que alguien te empuje al vacío en el peor momento. Es imposible no reírse, ya sea que ganes o pierdas. Ideal para jugar con amigos o familia.', 5, 523, id, '2026-03-23 11:00:00' FROM rank.users WHERE email = 'carla.gomez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Divertido pero repetitivo', 'Fall Guys es genuinamente divertido las primeras semanas. El problema es que los minijuegos se repiten mucho y con el tiempo la variedad se agota. Mediatonic saca contenido nuevo, pero puede llegar a sentirse monótono si jugás muchas horas seguidas. En sesiones cortas es perfecto.', 3, 523, id, '2026-03-03 14:00:00' FROM rank.users WHERE email = 'pablo.rodriguez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'El juego de fiesta más accesible', 'Cualquier persona, sin importar su experiencia en videojuegos, puede jugar y disfrutar Fall Guys. Esa accesibilidad es su mayor fortaleza. Los minijuegos son intuitivos y hay algo muy satisfactorio en llegar a la final y competir por la corona. Muy buen F2P para toda la familia.', 4, 523, id, '2026-01-22 19:15:00' FROM rank.users WHERE email = 'juan.herrera@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Nostalgias de Stumble Guys', 'Soy más de Stumble Guys para el teléfono, pero cuando jugué Fall Guys en PC entendí por qué es tan exitoso. La física del personaje, el caos controlado de cada ronda y la satisfacción del "qualified" son únicos. Para las temporadas temáticas con crossovers hay skins muy copadas.', 4, 523, id, '2026-01-02 10:45:00' FROM rank.users WHERE email = 'sebastian.ruiz@rank.com';

-- ============================================================
-- Dota 2 (api_id: 229)
-- ============================================================
INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'El MOBA más complejo y satisfactorio', 'DOTA 2 no es un juego, es un compromiso de vida. Tiene la curva de aprendizaje más empinada de los videojuegos, pero cuando empezás a entender sus capas —economía, draft, rotaciones— la profundidad es inigualable. Cada partida es diferente y las jugadas de alto nivel son arte.', 5, 229, id, '2026-03-21 23:00:00' FROM rank.users WHERE email = 'carla.gomez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'No apto para novatos sin guía', 'DOTA 2 maltrata a los nuevos jugadores. Sin un amigo que te enseñe o sin dedicar horas a videos y guías, es casi imposible no sentirte inútil las primeras semanas. La comunidad puede ser muy toxica con los principiantes. Dicho esto, si persistís, el juego es incomparable.', 2, 229, id, '2026-02-12 20:30:00' FROM rank.users WHERE email = 'valentina.suarez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Competitivo al máximo nivel', 'No conozco ningún juego que tenga el nivel de picos de adrenalina que DOTA 2 en los momentos decisivos de una partida reñida. Un comeback de base destruida, un teamfight ganado con un héroe a 100 HP... esas emociones son únicas. Es el esport que más disfruto ver y jugar.', 5, 229, id, '2026-01-30 16:00:00' FROM rank.users WHERE email = 'juan.herrera@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Grandioso pero demanda demasiado tiempo', 'DOTA 2 es un juego increíble, no lo voy a negar. Pero las partidas de 45-60 minutos en promedio lo hacen difícil de encajar en la vida adulta. Cuando tenés tiempo y concentración es extraordinario. Cuando no, puede convertirse en una carga. Ideal para estudiantes con tiempo libre.', 3, 229, id, '2025-12-28 09:00:00' FROM rank.users WHERE email = 'sebastian.ruiz@rank.com';

-- ============================================================
-- League of Legends (api_id: 286)
-- ============================================================
INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'El MOBA que lo define todo', 'League of Legends sigue siendo la referencia que todo MOBA intenta superar. El roster de campeones es enorme, el sistema de items da mucha profundidad estratégica y Riot sigue actualizando el juego con campeones nuevos y reworks constantes. Si vas a probar un MOBA, este es el punto de entrada.', 4, 286, id, '2026-03-16 17:30:00' FROM rank.users WHERE email = 'carla.gomez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Adictivo pero frustrante en ranked', 'LoL tiene una de las curvas de aprendizaje más largas del gaming. Aprender los más de 160 campeones, los items, los mapas, los roles... es un trabajo de meses. Una vez que agarrás el hilo es increíblemente satisfactorio, pero el camino tiene momentos muy frustrantes. La comunidad puede ser tóxica.', 3, 286, id, '2026-02-18 12:00:00' FROM rank.users WHERE email = 'valentina.suarez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'El juego gratuito más jugado del mundo', 'LoL lleva más de una década siendo el juego PC más jugado del mundo y hay una razón: es increíblemente profundo y accesible a la vez. El lore de Runeterra es vasto, las actualizaciones son constantes y el esport es fascinante de ver. Muy recomendado si tenés paciencia para aprender.', 5, 286, id, '2026-01-14 15:45:00' FROM rank.users WHERE email = 'ana.torres@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Bien pero la toxicidad arruina todo', 'El juego en sí es excelente: bien balanceado, con updates frecuentes y muchísimo contenido. El problema es su comunidad: el sistema de reporte no funciona bien y las partidas rankeadas pueden ser un infierno si te toca alguien que la quiere boicotear. En normals es otra experiencia.', 2, 286, id, '2025-12-20 21:00:00' FROM rank.users WHERE email = 'sebastian.ruiz@rank.com';

-- ============================================================
-- War Thunder (api_id: 12)
-- ============================================================
INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Simulación bélica sin igual', 'War Thunder combina aviones, tanques y barcos en un juego de simulación bélica increíblemente detallado. Los modelos de daño son realistas, la variedad de vehículos históricos es enorme y hay un modo para cada nivel de simulación. Un must para amantes de la historia militar.', 4, 12, id, '2026-03-11 08:30:00' FROM rank.users WHERE email = 'carla.gomez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Monstruosamente pay-to-win en el grind', 'La simulación de War Thunder es brillante, pero el grind para desbloquear vehículos de alto tier es literalmente diseñado para hacerte gastar dinero. Con premium el progreso es razonable; sin él, te vas a hartar antes de llegar al contenido interesante. La base del juego es sólida sin embargo.', 2, 12, id, '2026-02-07 19:00:00' FROM rank.users WHERE email = 'valentina.suarez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Para fans de la II Guerra Mundial', 'Si te apasiona la Segunda Guerra Mundial y los vehículos militares, War Thunder es una joya. El nivel de detalle histórico en los modelos de tanques y aviones es admirable, y las batallas son épicas cuando el equipo se coordina. Recomendado con paciencia para el grind inicial.', 4, 12, id, '2026-01-03 13:30:00' FROM rank.users WHERE email = 'ana.torres@rank.com';

-- ============================================================
-- Blade and Soul (api_id: 6)
-- ============================================================
INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Combate sin igual en un MMORPG', 'Blade & Soul tiene el sistema de combate más fluido y satisfactorio que vi en un MMORPG. Las clases tienen mecánicas propias muy diferenciadas y el PvP de torneo es de alta calidad. El problema es que NCSoft descuidó el juego en occidente, con servidores lentos y contenido retrasado.', 3, 6, id, '2026-03-09 16:00:00' FROM rank.users WHERE email = 'diego.fernandez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Hermoso pero abandonado', 'El diseño visual de Blade & Soul es impresionante —la dirección artística coreana es preciosa— y el combate es adictivo. Pero el estado del juego en occidente es deplorable: servidores lentos, poca inversión de NCSoft y comunidad cada vez más pequeña. Una pena.', 2, 6, id, '2025-12-15 11:00:00' FROM rank.users WHERE email = 'valentina.suarez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'El mejor combate de MMORPG que jugué', 'No exagero: el combate de Blade & Soul es el más satisfactorio de cualquier MMORPG que probé. El timing de los contraataques y la fluidez de las combos hace que cada pelea se sienta como una danza. Si pudieras trasplantar ese combate a un juego más mantenido sería perfecto.', 4, 6, id, '2025-12-05 18:30:00' FROM rank.users WHERE email = 'ana.torres@rank.com';

-- ============================================================
-- Eternal Return (api_id: 477)
-- ============================================================
INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Battle royale con twist de MOBA', 'Eternal Return combina el loop de crafting y supervivencia de un battle royale con el roster de personajes con habilidades de un MOBA. Es una propuesta muy original que funciona bien. Cada personaje tiene builds predefinidas que dan estructura al caos del early game. Muy recomendado para quienes buscan algo distinto.', 4, 477, id, '2026-03-07 21:15:00' FROM rank.users WHERE email = 'diego.fernandez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Nicho pero excelente para ese nicho', 'Eternal Return no va a ser el juego más jugado del mundo, pero para quienes disfrutan tanto de los MOBAs como de los battle royales, es una propuesta única. Los personajes tienen mucha personalidad y el sistema de crafteo da profundidad táctica desde el minuto uno.', 4, 477, id, '2026-01-27 14:00:00' FROM rank.users WHERE email = 'facundo.garcia@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Innovador pero con curva alta', 'La mezcla de géneros de Eternal Return es genial en papel, pero la curva de aprendizaje de entender los sistemas de crafting de cada personaje es muy alta. Una vez que elegís un main y aprendés su build, el juego fluye bien. Los desarrolladores son activos y escuchan a la comunidad.', 3, 477, id, '2025-11-30 17:00:00' FROM rank.users WHERE email = 'ana.torres@rank.com';

-- ============================================================
-- Smite (api_id: 217)
-- ============================================================
INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'El MOBA en tercera persona más divertido', 'Smite hace algo diferente a LoL y DOTA: te pone en tercera persona dentro del mapa. Eso cambia todo: los skillshots requieren apuntar manualmente, la cámara crea un sentido de escala único y las teamfights se sienten épicas. El tema mitológico de los dioses add mucha personalidad a cada personaje.', 4, 217, id, '2026-03-26 20:45:00' FROM rank.users WHERE email = 'diego.fernandez@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Perspectiva única para el género', 'Si estás cansado de ver los MOBAs desde arriba, Smite es una bocanada de aire fresco. La perspectiva de tercera persona introduce mecánicas genuinamente nuevas y la temática mitológica hace que los dioses sean personajes llamativos. El meta tiene variedad suficiente para no aburrir.', 4, 217, id, '2026-02-03 10:00:00' FROM rank.users WHERE email = 'facundo.garcia@rank.com';

INSERT IGNORE INTO rank.games_reviews (title, description, rating_id, api_game_id, user_id, created_at)
SELECT 'Bien pero alejado de DOTA y LoL', 'Smite ocupa un espacio interesante pero nunca terminó de consolidarse frente a los dos grandes del género. La perspectiva en tercera persona puede ser confusa al principio y la interfaz de HUD tiene cosas raras. Dicho eso, el roster de dioses es enorme y el modo Arena es muy divertido en casual.', 3, 217, id, '2025-12-10 14:30:00' FROM rank.users WHERE email = 'nicolas.romero@rank.com';
