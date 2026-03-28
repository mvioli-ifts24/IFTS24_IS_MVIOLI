import { connection as Database } from "#database";

const index = async (req, res) => {
  try {
    const user_id = req.user_id;

    const [results] = await Database.execute(
      "SELECT contact_messages.*, users.email as user_email FROM `contact_messages` JOIN `users` on contact_messages.user_id = users.id WHERE user_id = ?",
      [user_id],
    );

    return res.send({ data: results, error: null });
  } catch (err) {
    return res
      .status(400)
      .send({
        data: null,
        error:
          typeof err === "string"
            ? err
            : "Ocurrió un error inesperado. Intenta de nuevo más tarde.",
      });
  }
};

const admin_index = async (req, res) => {
  try {
    const [results] = await Database.execute(
      "SELECT contact_messages.*, users.email as user_email FROM `contact_messages` JOIN `users` on contact_messages.user_id = users.id",
    );

    return res.send({ data: results, error: null });
  } catch (err) {
    return res
      .status(400)
      .send({
        data: null,
        error:
          typeof err === "string"
            ? err
            : "Ocurrió un error inesperado. Intenta de nuevo más tarde.",
      });
  }
};

const store = async (req, res) => {
  try {
    const { message } = req.body;
    const user_id = req.user_id;

    if (!message) {
      throw "Para crear un registro es obligatorio el campo message.";
    }

    const [results] = await Database.execute(
      "INSERT INTO `contact_messages` (message, user_id) VALUES (?, ?)",
      [message, user_id],
    );

    return res.send({ data: { message, id: results.insertId }, error: null });
  } catch (err) {
    return res
      .status(400)
      .send({
        data: null,
        error:
          typeof err === "string"
            ? err
            : "Ocurrió un error inesperado. Intenta de nuevo más tarde.",
      });
  }
};

const admin_response = async (req, res) => {
  try {
    const { id } = req.params;

    const { response } = req.body;

    if (!response) {
      throw "Para contestar un mensaje es necesario el campo de response.";
    }

    await Database.execute(
      `UPDATE contact_messages SET response = ? WHERE id = ?`,
      [response, id],
    );

    const [results] = await Database.execute(
      "SELECT * FROM `contact_messages` WHERE id = ?",
      [id],
    );

    return res.send({ data: results.length ? results[0] : null, error: null });
  } catch (err) {
    return res
      .status(400)
      .send({
        data: null,
        error:
          typeof err === "string"
            ? err
            : "Ocurrió un error inesperado. Intenta de nuevo más tarde.",
      });
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user_id;

    const [owned] = await Database.execute(
      "SELECT id FROM `contact_messages` WHERE id = ? AND user_id = ?",
      [id, user_id],
    );

    if (!owned.length) {
      return res.status(403).send({
        data: null,
        error: "No tenés permiso para eliminar este mensaje.",
      });
    }

    await Database.execute("DELETE FROM `contact_messages` WHERE id = ?", [id]);

    return res.send({ data: null, error: null });
  } catch (err) {
    return res
      .status(400)
      .send({
        data: null,
        error:
          typeof err === "string"
            ? err
            : "Ocurrió un error inesperado. Intenta de nuevo más tarde.",
      });
  }
};

export { admin_index, admin_response, destroy, index, store };
