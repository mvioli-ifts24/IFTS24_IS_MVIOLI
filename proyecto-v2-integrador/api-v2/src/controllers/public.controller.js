import { connection as Database } from "#database";

const API_HOST = (process.env.API_HOST || "").replace(/\/+$/, "");
const PROFILE_PICTURES_PATH = API_HOST + "/storage/uploads/profile_pictures/";

export const getStats = async (req, res) => {
  try {
    const [[{ users }]] = await Database.execute(
      "SELECT COUNT(*) as users FROM `users`",
    );

    const [[{ reviews }]] = await Database.execute(
      "SELECT COUNT(*) as reviews FROM `games_reviews`",
    );

    const [[{ games }]] = await Database.execute(
      "SELECT COUNT(*) as games FROM `cached_games`",
    );

    return res.send({
      data: {
        users: Number(users),
        reviews: Number(reviews),
        games: Number(games),
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

export const getRecentReviews = async (req, res) => {
  try {
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));

    const [results] = await Database.execute(
      `SELECT games_reviews.id, games_reviews.title, games_reviews.description,
        games_reviews.rating_id, games_reviews.api_game_id, games_reviews.created_at,
        games_reviews_ratings.description as rating,
        users.name as user_name, users.surname as user_surname,
        IF(users.profile_picture_filename IS NULL OR users.profile_picture_filename = '', NULL,
          CONCAT(?, users.profile_picture_filename)) as user_avatar,
        cached_games.title as game_title, cached_games.thumbnail as game_thumbnail
      FROM \`games_reviews\`
      JOIN \`games_reviews_ratings\` ON games_reviews.rating_id = games_reviews_ratings.id
      JOIN \`users\` ON games_reviews.user_id = users.id
      JOIN \`cached_games\` ON games_reviews.api_game_id = cached_games.api_id
      ORDER BY games_reviews.created_at DESC
      LIMIT ${limit}`,
      [PROFILE_PICTURES_PATH],
    );

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
