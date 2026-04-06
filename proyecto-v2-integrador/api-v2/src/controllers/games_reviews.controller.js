import { connection as Database } from "#database";

const API_HOST = (process.env.API_HOST || "").replace(/\/+$/, "");
const PROFILE_PICTURES_PATH = API_HOST + "/storage/uploads/profile_pictures/";

const indexGameReviews = async (req, res) => {
  try {
    const { game_id } = req.params;
    const user_id = req.user_id;

    const QUERY_BASE = `SELECT games_reviews.*, games_reviews_ratings.description as rating, users.email as user_email, users.name as user_name, users.surname as user_surname, IF(users.profile_picture_filename IS NULL OR users.profile_picture_filename = '', NULL, CONCAT('${PROFILE_PICTURES_PATH}', users.profile_picture_filename)) as user_avatar, cached_games.title as game_title, cached_games.thumbnail as game_thumbnail FROM \`games_reviews\` JOIN \`games_reviews_ratings\` ON games_reviews.rating_id = games_reviews_ratings.id JOIN \`users\` ON games_reviews.user_id = users.id JOIN \`cached_games\` ON games_reviews.api_game_id = cached_games.api_id WHERE api_game_id = ?`;

    const [results] = await Database.execute(
      `${QUERY_BASE} AND users.id != ?`,
      [game_id, user_id],
    );

    const [resultsOwn] = await Database.execute(
      `${QUERY_BASE} AND users.id = ?`,
      [game_id, user_id],
    );

    const [[stats]] = await Database.execute(
      "SELECT ROUND(AVG(rating_id), 2) as avg_rating, COUNT(*) as review_count FROM `games_reviews` WHERE api_game_id = ?",
      [game_id],
    );

    return res.send({
      data: {
        ownReview: resultsOwn.length ? resultsOwn[0] : null,
        othersReviews: results,
        avg_rating: stats.avg_rating ? Number(stats.avg_rating) : null,
        review_count: Number(stats.review_count),
      },
      error: null,
    });
  } catch (err) {
    return res.status(400).send({
      data: null,
      error:
        typeof err === "string"
          ? err
          : "Ocurrió un error inesperado. Intenta de nuevo más tarde.",
    });
  }
};

const indexOwnReviews = async (req, res) => {
  try {
    const user_id = req.user_id;

    const QUERY_BASE = `SELECT games_reviews.*, games_reviews_ratings.description as rating, users.email as user_email, users.name as user_name, users.surname as user_surname, IF(users.profile_picture_filename IS NULL OR users.profile_picture_filename = '', NULL, CONCAT('${PROFILE_PICTURES_PATH}', users.profile_picture_filename)) as user_avatar, cached_games.title as game_title, cached_games.thumbnail as game_thumbnail FROM \`games_reviews\` JOIN \`games_reviews_ratings\` ON games_reviews.rating_id = games_reviews_ratings.id JOIN \`users\` ON games_reviews.user_id = users.id JOIN \`cached_games\` ON games_reviews.api_game_id = cached_games.api_id WHERE 1 = 1`;

    const [resultsOwn] = await Database.execute(
      `${QUERY_BASE} AND users.id = ?`,
      [user_id],
    );

    return res.send({ data: resultsOwn, error: null });
  } catch (err) {
    return res.status(400).send({
      data: null,
      error:
        typeof err === "string"
          ? err
          : "Ocurrió un error inesperado. Intenta de nuevo más tarde.",
    });
  }
};

const indexUserReviews = async (req, res) => {
  try {
    const { user_id } = req.params;

    const QUERY_BASE = `SELECT games_reviews.*, games_reviews_ratings.description as rating, users.email as user_email, users.name as user_name, users.surname as user_surname, IF(users.profile_picture_filename IS NULL OR users.profile_picture_filename = '', NULL, CONCAT('${PROFILE_PICTURES_PATH}', users.profile_picture_filename)) as user_avatar, cached_games.title as game_title, cached_games.thumbnail as game_thumbnail FROM \`games_reviews\` JOIN \`games_reviews_ratings\` ON games_reviews.rating_id = games_reviews_ratings.id JOIN \`users\` ON games_reviews.user_id = users.id JOIN \`cached_games\` ON games_reviews.api_game_id = cached_games.api_id WHERE 1 = 1`;

    // Si el parámetro contiene @, hacer lookup por email; si no, por ID numérico
    const isEmail = typeof user_id === "string" && user_id.includes("@");
    const condition = isEmail ? "AND users.email = ?" : "AND users.id = ?";

    const [results] = await Database.execute(`${QUERY_BASE} ${condition}`, [
      user_id,
    ]);

    return res.send({ data: results, error: null });
  } catch (err) {
    return res.status(400).send({
      data: null,
      error:
        typeof err === "string"
          ? err
          : "Ocurrió un error inesperado. Intenta de nuevo más tarde.",
    });
  }
};

const store = async (req, res) => {
  try {
    const { title, description, rating_id, api_game_id } = req.body;
    const user_id = req.user_id;

    if (!title || !description || !rating_id || !api_game_id) {
      throw "Para crear un registro son obligatorios tres campos: titulo, reseña, id de juego api y puntuación.";
    }

    // Verificar si el usuario ya tiene una reseña para este juego
    const [existing] = await Database.execute(
      "SELECT id FROM `games_reviews` WHERE api_game_id = ? AND user_id = ?",
      [api_game_id, user_id],
    );

    if (existing.length) {
      throw "Ya tenés una reseña publicada para este juego. Podés editarla desde tu perfil.";
    }

    const [resultsCachedGames] = await Database.execute(
      "SELECT * FROM `cached_games` WHERE api_id = ?",
      [api_game_id],
    );

    /* Si es la primera vez que se sube una review de este juego
          al sistema, cacheo el juego. Caso contrario no lo necesito volver a hacer.
        */

    if (!resultsCachedGames.length) {
      const preflight = await fetch(
        `https://www.freetogame.com/api/game?id=${api_game_id}`,
      );
      const { title, thumbnail } = await preflight.json();
      await Database.execute(
        "INSERT INTO `cached_games` (title, thumbnail, api_id) VALUES (?,?,?)",
        [title, thumbnail, api_game_id],
      );
    }

    const [results] = await Database.execute(
      "INSERT INTO `games_reviews` (title, description, api_game_id, rating_id, user_id) VALUES (?,?,?,?,?)",
      [title, description, api_game_id, rating_id, user_id],
    );

    return res.send({
      data: {
        title,
        description,
        rating_id,
        api_game_id,
        id: results.insertId,
      },
      error: null,
    });
  } catch (err) {
    return res.status(400).send({
      data: null,
      error:
        typeof err === "string"
          ? err
          : "Ocurrió un error inesperado. Intenta de nuevo más tarde.",
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user_id;

    const { title, description, rating_id, api_game_id } = req.body;

    if (!title || !description || !rating_id || !api_game_id) {
      throw "Para actualizar un registro son obligatorios tres campos: titulo, reseña, id de juego api y puntuación.";
    }

    // Verificar que la reseña pertenece al usuario
    const [owned] = await Database.execute(
      "SELECT id FROM `games_reviews` WHERE id = ? AND user_id = ?",
      [id, user_id],
    );

    if (!owned.length) {
      return res.status(403).send({
        data: null,
        error: "No tenés permiso para editar esta reseña.",
      });
    }

    await Database.execute(
      `UPDATE games_reviews SET title = ?, description = ?, api_game_id = ?, rating_id = ? WHERE id = ?`,
      [title, description, api_game_id, rating_id, id],
    );

    const [results] = await Database.execute(
      "SELECT * FROM `games_reviews` WHERE id = ?",
      [id],
    );

    return res.send({ data: results.length ? results[0] : null, error: null });
  } catch (err) {
    return res.status(400).send({
      data: null,
      error:
        typeof err === "string"
          ? err
          : "Ocurrió un error inesperado. Intenta de nuevo más tarde.",
    });
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user_id;

    // Verificar que la reseña pertenece al usuario
    const [owned] = await Database.execute(
      "SELECT id FROM `games_reviews` WHERE id = ? AND user_id = ?",
      [id, user_id],
    );

    if (!owned.length) {
      return res.status(403).send({
        data: null,
        error: "No tenés permiso para eliminar esta reseña.",
      });
    }

    await Database.execute("DELETE FROM `games_reviews` WHERE id = ?", [id]);

    return res.send({ data: null, error: null });
  } catch (err) {
    return res.status(400).send({
      data: null,
      error:
        typeof err === "string"
          ? err
          : "Ocurrió un error inesperado. Intenta de nuevo más tarde.",
    });
  }
};

const indexRecentReviews = async (req, res) => {
  try {
    const { rating_id, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;

    const QUERY_BASE = `SELECT games_reviews.id, games_reviews.user_id, games_reviews.api_game_id, games_reviews.title, games_reviews.description, games_reviews.created_at, games_reviews_ratings.id as rating_id, games_reviews_ratings.description as rating, users.email as user_email, users.name as user_name, users.surname as user_surname, IF(users.profile_picture_filename IS NULL OR users.profile_picture_filename = '', NULL, CONCAT('${PROFILE_PICTURES_PATH}', users.profile_picture_filename)) as user_avatar, cached_games.title as game_title, cached_games.thumbnail as game_thumbnail FROM \`games_reviews\` JOIN \`games_reviews_ratings\` ON games_reviews.rating_id = games_reviews_ratings.id JOIN \`users\` ON games_reviews.user_id = users.id JOIN \`cached_games\` ON games_reviews.api_game_id = cached_games.api_id WHERE 1 = 1`;

    const params = [];
    let query = QUERY_BASE;

    if (rating_id) {
      query += " AND games_reviews.rating_id = ?";
      params.push(rating_id);
    }

    query += ` ORDER BY games_reviews.created_at DESC LIMIT ${limitNum + 1} OFFSET ${offset}`;

    const [results] = await Database.execute(query, params);

    const hasMore = results.length > limitNum;
    const data = hasMore ? results.slice(0, limitNum) : results;

    return res.send({ data, hasMore, error: null });
  } catch (err) {
    return res.status(400).send({
      data: null,
      hasMore: false,
      error:
        typeof err === "string"
          ? err
          : "Ocurrió un error inesperado. Intenta de nuevo más tarde.",
    });
  }
};

export {
  destroy,
  indexGameReviews,
  indexOwnReviews,
  indexRecentReviews,
  indexUserReviews,
  store,
  update,
};
