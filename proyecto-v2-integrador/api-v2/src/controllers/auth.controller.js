import { connection as Database } from "#database";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

const encryptPassword = (plainPassword) =>
  crypto
    .pbkdf2Sync(plainPassword, process.env.SECRET_KEY, 10000, 64, "sha512")
    .toString("base64");

const API_HOST = (process.env.API_HOST || "").replace(/\/+$/, "");

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

    const userId = results.insertId;
    const token = jwt.sign(
      {
        id: userId,
        email,
        gender_id,
        role: "user",
        email_verified: 0,
      },
      process.env.SECRET_KEY,
    );

    return res.send({
      data: {
        token,
        user: {
          id: userId,
          name: name || null,
          surname: surname || null,
          email,
          role: "user",
          gender_id,
          favorite_game_id: null,
          favorite_game_title: null,
          favorite_game_thumbnail: null,
          email_verified: 0,
          about: null,
          profile_picture_url:
            API_HOST + "/storage/uploads/profile_pictures/" + req.file.filename,
          accept_newsletter: accept_newsletter ? 1 : 0,
          birth_date: birthDate
            ? new Date(birthDate).toISOString().split("T")[0]
            : null,
        },
      },
      error: null,
    });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: typeof err === 'string' ? err : 'Ocurrió un error inesperado. Intenta de nuevo más tarde.' });
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
        email_verified: user.email_verified,
      },
      process.env.SECRET_KEY,
    );

    return res.send({
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          role: user.role,
          gender_id: user.gender_id,
          email_verified: user.email_verified,
          favorite_game_id: user.favorite_game_id,
          favorite_game_title: user.favorite_game_title || null,
          favorite_game_thumbnail: user.favorite_game_thumbnail || null,
          about: user.about,
          profile_picture_url:
            API_HOST +
            "/storage/uploads/profile_pictures/" +
            user.profile_picture_filename,
          accept_newsletter: user.accept_newsletter,
          birth_date: user.birth_date,
        },
      },
      error: null,
    });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: typeof err === 'string' ? err : 'Ocurrió un error inesperado. Intenta de nuevo más tarde.' });
  }
};

const verifyAccount = async (req, res) => {
  try {
    const user_id = req.user_id;

    await Database.execute("UPDATE users SET email_verified = 1 WHERE id = ?", [
      user_id,
    ]);

    const [results] = await Database.execute(
      "SELECT email_verified FROM users WHERE id = ?",
      [user_id],
    );

    return res.send({
      data: {
        email_verified: results.length ? results[0].email_verified : 0,
      },
      error: null,
    });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: typeof err === 'string' ? err : 'Ocurrió un error inesperado. Intenta de nuevo más tarde.' });
  }
};

export { login, register, verifyAccount };
