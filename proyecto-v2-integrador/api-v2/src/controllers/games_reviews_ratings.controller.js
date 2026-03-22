import { connection as Database } from "#database";

const index = async (req, res) => {
  try {
    const [results] = await Database.execute(
      "SELECT * FROM `games_reviews_ratings`",
    );

    return res.send({ data: results, error: null });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
};

export { index };
