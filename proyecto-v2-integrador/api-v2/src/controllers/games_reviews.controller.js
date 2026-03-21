const Database = require("#database");

const indexGameReviews = async (req, res) => {
  try {
    const { game_id } = req.params;
    const user_id = req.user_id;

    const QUERY_BASE =
      "SELECT games_reviews.*, games_reviews_ratings.description as rating, users.email as user_email, cached_games.title as game_title, cached_games.thumbnail as game_thumbnail FROM `games_reviews` JOIN `games_reviews_ratings` ON games_reviews.rating_id = games_reviews_ratings.id JOIN `users` ON games_reviews.user_id = users.id JOIN `cached_games` ON games_reviews.api_game_id = cached_games.api_id WHERE api_game_id = ?";

    const [results] = await Database.query(`${QUERY_BASE} AND users.id != ?`, [
      game_id,
      user_id,
    ]);

    const [resultsOwn] = await Database.query(
      `${QUERY_BASE} AND users.id = ?`,
      [game_id, user_id]
    );

    return res.send({
      data: {
        ownReview: resultsOwn.length ? resultsOwn[0] : null,
        othersReviews: results,
      },
      error: null,
    });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
};

const indexOwnReviews = async (req, res) => {
  try {
    const user_id = req.user_id;

    const QUERY_BASE =
      "SELECT games_reviews.*, games_reviews_ratings.description as rating, users.email as user_email, cached_games.title as game_title, cached_games.thumbnail as game_thumbnail FROM `games_reviews` JOIN `games_reviews_ratings` ON games_reviews.rating_id = games_reviews_ratings.id JOIN `users` ON games_reviews.user_id = users.id JOIN `cached_games` ON games_reviews.api_game_id = cached_games.api_id";

    const [resultsOwn] = await Database.query(
      `${QUERY_BASE} AND users.id = ?`,
      [user_id]
    );

    return res.send({ data: resultsOwn, error: null });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
};

const indexUserReviews = async (req, res) => {
  try {
    const { user_id } = req.params;

    const QUERY_BASE =
      "SELECT games_reviews.*, games_reviews_ratings.description as rating, users.email as user_email, cached_games.title as game_title, cached_games.thumbnail as game_thumbnail FROM `games_reviews` JOIN `games_reviews_ratings` ON games_reviews.rating_id = games_reviews_ratings.id JOIN `users` ON games_reviews.user_id = users.id JOIN `cached_games` ON games_reviews.api_game_id = cached_games.api_id";

    const [results] = await Database.query(`${QUERY_BASE} AND users.id = ?`, [
      user_id,
    ]);

    return res.send({ data: results, error: null });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
};

const store = async (req, res) => {
  try {
    const { title, description, rating_id, api_game_id } = req.body;
    const user_id = req.user_id;

    if (!title || !description || !rating_id || !api_game_id) {
      throw "Para crear un registro son obligatorios tres campos: titulo, reseña, id de juego api y puntuación.";
    }

    const [resultsCachedGames] = await Database.query(
      "SELECT * FROM `cached_games` WHERE api_id = ?",
      [api_game_id]
    );

    /* Si es la primera vez que se sube una review de este juego
          al sistema, cacheo el juego. Caso contrario no lo necesito volver a hacer.
        */

    if (!resultsCachedGames.length) {
      const preflight = await fetch(
        `https://www.freetogame.com/api/game?id=${api_game_id}`
      );
      const { title, thumbnail } = await preflight.json();
      await Database.query(
        "INSERT INTO `cached_games` (title, thumbnail, api_id) VALUES (?,?,?)",
        [title, thumbnail, api_game_id]
      );
    }

    const [results] = await Database.query(
      "INSERT INTO `games_reviews` (title, description, api_game_id, rating_id, user_id) VALUES (?,?,?,?,?)",
      [title, description, api_game_id, rating_id, user_id]
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
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, rating_id, api_game_id } = req.body;

    if (!title || !description || !rating_id || !api_game_id) {
      throw "Para actualizar un registro son obligatorios tres campos: titulo, reseña, id de juego api y puntuación.";
    }

    await Database.query(
      `UPDATE games_reviews SET title = ?, description = ?, api_game_id = ?, rating_id = ? WHERE id = ?`,
      [title, description, api_game_id, rating_id, id]
    );

    const [results] = await Database.query(
      "SELECT * FROM `games_reviews` WHERE id = ?",
      [id]
    );

    return res.send({ data: results.length ? results[0] : null, error: null });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const [results] = await Database.query(
      "DELETE FROM `games_reviews` WHERE id = ?",
      [id]
    );

    return res.send({ data: null, error: null });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
};

module.exports = {
  indexOwnReviews,
  indexGameReviews,
  indexUserReviews,
  store,
  update,
  destroy,
};
