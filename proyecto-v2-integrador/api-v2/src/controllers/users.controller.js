import { connection as Database } from "#database";
import crypto from "node:crypto";

const API_HOST = (process.env.API_HOST || "").replace(/\/+$/, "");
const PROFILE_PICTURES_PATH = API_HOST + "/storage/uploads/profile_pictures/";

const encryptPassword = (plainPassword) =>
  crypto
    .pbkdf2Sync(plainPassword, process.env.SECRET_KEY, 10000, 64, "sha512")
    .toString("base64");

const USER_SELECT = `
  SELECT
    users.id,
    users.name,
    users.surname,
    users.email,
    users.birth_date,
    users.gender_id,
    users.role,
    users.email_verified,
    users.accept_newsletter,
    users.favorite_game_id,
    users.about,
    users.deleted_at,
    users_genders.label as gender_label,
    CONCAT(?, users.profile_picture_filename) as profile_picture_url
  FROM users
  JOIN users_genders ON users_genders.id = users.gender_id
`;

const enrichFavoriteGame = async (user) => {
  if (!user || !user.favorite_game_id) {
    return {
      ...user,
      favorite_game_title: null,
      favorite_game_thumbnail: null,
    };
  }

  try {
    const preflight = await fetch(
      `https://www.freetogame.com/api/game?id=${user.favorite_game_id}`,
    );

    if (!preflight.ok) {
      return {
        ...user,
        favorite_game_title: null,
        favorite_game_thumbnail: null,
      };
    }

    const game = await preflight.json();

    return {
      ...user,
      favorite_game_title: game?.title || null,
      favorite_game_thumbnail: game?.thumbnail || null,
    };
  } catch (_) {
    return {
      ...user,
      favorite_game_title: null,
      favorite_game_thumbnail: null,
    };
  }
};

const index = async (req, res) => {
  try {
    const [results] = await Database.execute(
      `${USER_SELECT} ORDER BY users.id`,
      [PROFILE_PICTURES_PATH],
    );

    const enrichedUsers = await Promise.all(
      results.map((user) => enrichFavoriteGame(user)),
    );

    return res.send({ data: enrichedUsers, error: null });
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
      `${USER_SELECT} WHERE users.id = ?`,
      [PROFILE_PICTURES_PATH, id],
    );
    const user = results.length ? await enrichFavoriteGame(results[0]) : null;

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

    const {
      about,
      accept_newsletter,
      favorite_game_id,
      birth_date,
      gender_id,
    } = req.body;

    const updates = [];
    const values = [];

    if (about !== undefined) {
      if (String(about).length > 150) {
        throw "El campo sobre mí no puede superar los 150 caracteres.";
      }

      updates.push("about = ?");
      values.push(about || null);
    }

    if (accept_newsletter !== undefined) {
      updates.push("accept_newsletter = ?");
      values.push(accept_newsletter ? 1 : 0);
    }

    if (favorite_game_id !== undefined) {
      updates.push("favorite_game_id = ?");
      values.push(favorite_game_id ? Number(favorite_game_id) : null);
    }

    if (birth_date !== undefined) {
      updates.push("birth_date = ?");
      values.push(birth_date ? String(birth_date) : null);
    }

    if (gender_id !== undefined) {
      const parsedGenderId = Number(gender_id);

      if (!parsedGenderId) {
        throw "El género seleccionado es inválido.";
      }

      const [genderResults] = await Database.execute(
        "SELECT id FROM users_genders WHERE id = ?",
        [parsedGenderId],
      );

      if (!genderResults.length) {
        throw "El género seleccionado no existe.";
      }

      updates.push("gender_id = ?");
      values.push(parsedGenderId);
    }

    if (req.file) {
      updates.push("profile_picture_filename = ?");
      values.push(req.file.filename);
    }

    if (!updates.length) {
      throw "No se enviaron campos válidos para actualizar el perfil.";
    }

    await Database.execute(
      `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
      [...values, user_id],
    );

    const [results] = await Database.execute(
      `${USER_SELECT} WHERE users.id = ?`,
      [PROFILE_PICTURES_PATH, user_id],
    );
    const user = results.length ? await enrichFavoriteGame(results[0]) : null;

    return res.send({ data: user, error: null });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
};

const changePassword = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { current_password, new_password, confirm_password } = req.body;

    if (!current_password || !new_password || !confirm_password) {
      throw "Para cambiar la contraseña son obligatorios current_password, new_password y confirm_password.";
    }

    if (new_password !== confirm_password) {
      throw "La nueva contraseña y su confirmación no coinciden.";
    }

    if (String(new_password).length < 6) {
      throw "La nueva contraseña debe tener al menos 6 caracteres.";
    }

    const [results] = await Database.execute(
      "SELECT password FROM users WHERE id = ?",
      [user_id],
    );

    if (!results.length) {
      throw "No se encontró el usuario autenticado.";
    }

    const currentEncrypted = encryptPassword(current_password);

    if (results[0].password !== currentEncrypted) {
      throw "La contraseña actual es incorrecta.";
    }

    const nextEncrypted = encryptPassword(new_password);

    await Database.execute("UPDATE users SET password = ? WHERE id = ?", [
      nextEncrypted,
      user_id,
    ]);

    return res.send({ data: { updated: true }, error: null });
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
  changePassword,
  createAdmin,
  deleteUser,
  disable,
  index,
  show,
  update,
};
