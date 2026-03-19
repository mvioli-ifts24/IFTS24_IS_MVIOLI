const Database = require("#database");

const index = async (req, res) => {
  try {
    const preflight = await fetch("https://www.freetogame.com/api/games");
    const response = await preflight.json();

    return res.send({ data: response, error: null });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
};

const show = async (req, res) => {
  try {
    const { game_id } = req.params;

    const preflight = await fetch(
      `https://www.freetogame.com/api/game?id=${game_id}`
    );
    const response = await preflight.json();

    return res.send({ data: response, error: null });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
};

module.exports = {
  index,
  show,
};
