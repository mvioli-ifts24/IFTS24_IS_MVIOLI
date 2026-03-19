const Database = require("#database");
const Luxon = require("luxon");
const crypto = require("node:crypto");
const jwt = require("jsonwebtoken");

const encryptPassword = (plainPassword) =>
  crypto
    .pbkdf2Sync(plainPassword, process.env.SECRET_KEY, 10000, 64, "sha512")
    .toString("base64");

const register = async (req, res) => {
  try {
    const { email, password, gender_id, accept_newsletter } = req.body;

    if (!email || !password || !gender_id || !accept_newsletter || !req.file) {
      throw "Para crear un registro son obligatorios cinco campos: email, contraseña, foto de perfil, genero, y suscripción.";
    }

    const [resultsEmailValidation] = await Database.query(
      "SELECT * FROM `users` WHERE email = ?",
      [email]
    );

    if (resultsEmailValidation.length) {
      throw "Ya existe un usuario con el correo provisto.";
    }

    const encryptedPassword = encryptPassword(password);

    const [results] = await Database.query(
      "INSERT INTO `users` (email, password, gender_id, accept_newsletter, profile_picture_filename) VALUES (?, ?, ?, ?, ?)",
      [
        email,
        encryptedPassword,
        gender_id,
        accept_newsletter ? 1 : 0,
        req.file.filename,
      ]
    );

    const token = jwt.sign(
      { id: results.insertId, email, gender_id, is_admin: 0 },
      process.env.SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );

    return res.send({ data: { token }, error: null });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw "Para iniciar sesión son obligatorios dos campos: email y contraseña.";
    }

    const [results] = await Database.query(
      "SELECT * FROM `users` WHERE email = ?",
      [email]
    );

    if (!results.length) {
      throw "No existe ningún usuario con el correo provisto.";
    }

    const encryptedPassword = encryptPassword(password);

    const user = results[0];

    if (user.deleted_at) {
      throw "El usuario esta deshabilitado.";
    }

    if (encryptedPassword !== user.password) {
      throw "La contraseña para el usuario provisto es incorrecta";
    }

    const token = jwt.sign(
      {
        id: user.id,
        is_admin: user.is_admin,
        gender_id: user.gender_id,
        email: user.email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );

    return res.send({ data: { token }, error: null });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
};

module.exports = {
  register,
  login,
};
