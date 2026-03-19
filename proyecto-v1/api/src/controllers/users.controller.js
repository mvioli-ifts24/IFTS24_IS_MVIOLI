const Database = require("#database");
const Luxon = require("luxon");

const PROFILE_PICTURES_PATH =
  process.env.API_HOST + "/storage/uploads/profile_pictures/";

const index = async (req, res) => {
  try {
    const [results] = await Database.query(
      "SELECT *, CONCAT(?, profile_picture_filename) as profile_picture_url FROM `users`",
      [PROFILE_PICTURES_PATH]
    );

    return res.send({ data: results, error: null });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
};

const show = async (req, res) => {
  try {
    let { id } = req.params;
    if (id === "own") {
      id = req.user_id;
    }
    const [results] = await Database.query(
      "SELECT users.*, CONCAT(?, profile_picture_filename) as profile_picture_url, users_genders.label as gender_label FROM `users` JOIN users_genders ON users_genders.id = users.gender_id WHERE users.id = ?",
      [PROFILE_PICTURES_PATH, id]
    );
    const user = results.length ? results[0] : null;
    delete user.password;

    return res.send({ data: user, error: null });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
};

const update = async (req, res) => {
  try {
    const user_id = req.user_id;

    const { gender_id, about, accept_newsletter } = req.body;

    if (!gender_id || !about) {
      throw "Para actualizar un registro es obligatorio los campos: genero, suscripcion y sobre mí.";
    }

    const values_to_insert = [gender_id, about, accept_newsletter ? 1 : 0];

    let sql_sentence = `UPDATE users SET gender_id = ?, about = ?, accept_newsletter = ?`;

    if (req.file) {
      values_to_insert.push(req.file.filename);
      sql_sentence += ", profile_picture_filename = ?";
    }

    await Database.query(`${sql_sentence} WHERE id = ?`, [
      ...values_to_insert,
      user_id,
    ]);

    const [results] = await Database.query(
      "SELECT * FROM `users` WHERE id = ?",
      [user_id]
    );

    return res.send({ data: results.length ? results[0] : null, error: null });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
};

const disable = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { disable } = req.body;
    console.log(disable);

    if (disable !== 0 && disable !== 1) {
      throw "Para deshabilitar un registro es obligatorio el campo disable con un valor de 0 o 1.";
    }

    await Database.query(`UPDATE users SET deleted_at = ? WHERE id = ?`, [
      disable ? Luxon.DateTime.now().toSQL({ includeOffset: false }) : null,
      user_id,
    ]);

    const [results] = await Database.query(
      "SELECT * FROM `users` WHERE id = ?",
      [user_id]
    );

    return res.send({ data: results.length ? results[0] : null, error: null });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
};

module.exports = {
  index,
  show,
  update,
  disable,
};
