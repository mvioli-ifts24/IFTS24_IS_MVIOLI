import { connection as Database } from "#database";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

const encryptPassword = (plainPassword) =>
  crypto
    .pbkdf2Sync(plainPassword, process.env.SECRET_KEY, 10000, 64, "sha512")
    .toString("base64");

const register = async (req, res) => {
  try {
    const {
      name,
      surname,
      email,
      password,
      confirmPassword,
      birthDate,
      gender_id,
      accept_newsletter,
    } = req.body;
    console.log("req.body", req.body);
    if (
      !email ||
      !password ||
      !confirmPassword ||
      !gender_id ||
      !accept_newsletter
    ) {
      throw "Para crear un registro son obligatorios los campos requeridos.";
    }

    if (password !== confirmPassword) {
      throw "Las contraseñas no coinciden.";
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
      "INSERT INTO `users` (name, surname, email, password, birth_date, gender_id, role, accept_newsletter, profile_picture_filename) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name || null,
        surname || null,
        email,
        encryptedPassword,
        birthDate ? new Date(birthDate).toISOString().split("T")[0] : null,
        gender_id,
        "user",
        accept_newsletter ? 1 : 0,
        req.file.filename,
      ],
    );

    const token = jwt.sign(
      { id: results.insertId, email, gender_id, role: "user" },
      process.env.SECRET_KEY,
      {
        expiresIn: "24h",
      },
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

    const [results] = await Database.execute(
      "SELECT * FROM `users` WHERE email = ?",
      [email],
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
        role: user.role,
        gender_id: user.gender_id,
        email: user.email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "24h",
      },
    );

    return res.send({ data: { token }, error: null });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
};

export { login, register };
