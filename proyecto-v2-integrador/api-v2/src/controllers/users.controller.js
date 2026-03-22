import { connection as Database } from "#database";

const PROFILE_PICTURES_PATH =
  process.env.API_HOST + "/storage/uploads/profile_pictures/";

const index = async (req, res) => {
  try {
    const [results] = await Database.execute(
      "SELECT *, CONCAT(?, profile_picture_filename) as profile_picture_url FROM `users`",
      [PROFILE_PICTURES_PATH],
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
    const [results] = await Database.execute(
      "SELECT users.*, CONCAT(?, profile_picture_filename) as profile_picture_url, users_genders.label as gender_label FROM `users` JOIN users_genders ON users_genders.id = users.gender_id WHERE users.id = ?",
      [PROFILE_PICTURES_PATH, id],
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

    await Database.execute(`${sql_sentence} WHERE id = ?`, [
      ...values_to_insert,
      user_id,
    ]);

    const [results] = await Database.execute(
      "SELECT * FROM `users` WHERE id = ?",
      [user_id],
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

    await Database.execute(`UPDATE users SET deleted_at = ? WHERE id = ?`, [
      disable ? new Date().toISOString().slice(0, 19).replace("T", " ") : null,
      user_id,
    ]);

    const [results] = await Database.execute(
      "SELECT * FROM `users` WHERE id = ?",
      [user_id],
    );

    return res.send({ data: results.length ? results[0] : null, error: null });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;

    if (!name || !surname || !email || !password) {
      throw "Nombre, apellido, email y contraseña son obligatorios.";
    }

    const [resultsEmailValidation] = await Database.execute(
      "SELECT * FROM `users` WHERE email = ?",
      [email],
    );

    if (resultsEmailValidation.length) {
      throw "Ya existe un usuario con el correo provisto.";
    }

    const encryptedPassword = encryptPassword(password);

    const [results] = await Database.execute(
      "INSERT INTO `users` (name, surname, email, password, gender_id, role, profile_picture_filename) VALUES (?, ?, ?, ?, 1, 'admin', 'default.jpg')",
      [name, surname, email, encryptedPassword],
    );

    return res.send({
      data: { id: results.insertId, name, surname, email, role: "admin" },
      error: null,
    });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
};

const assignModerator = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_moderator } = req.body;

    await Database.execute("UPDATE users SET role = ? WHERE id = ?", [
      is_moderator ? "moderator" : "user",
      id,
    ]);

    const [results] = await Database.execute(
      "SELECT * FROM `users` WHERE id = ?",
      [id],
    );

    return res.send({ data: results[0], error: null });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await Database.execute("DELETE FROM `users` WHERE id = ?", [id]);

    return res.send({ data: null, error: null });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
};

export {
  assignModerator,
  createAdmin,
  deleteUser,
  disable,
  index,
  show,
  update,
};
