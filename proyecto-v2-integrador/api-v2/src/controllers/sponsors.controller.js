import { connection as Database } from "#database";

const API_HOST = (process.env.API_HOST || "").replace(/\/+$/, "");
const IMAGES_PATH = API_HOST + "/storage/uploads/images/";

const index = async (req, res) => {
  try {
    const [results] = await Database.execute(
      "SELECT *, IF(image_filename IS NULL OR image_filename = '', NULL, CONCAT(?, image_filename)) as image_url FROM `sponsors` ORDER BY created_at DESC",
      [IMAGES_PATH],
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
    const { name, link, contact } = req.body;

    if (!name || !req.file) {
      throw "Nombre e imagen son obligatorios.";
    }

    const [results] = await Database.execute(
      "INSERT INTO `sponsors` (name, image_filename, link, contact) VALUES (?, ?, ?, ?)",
      [name, req.file.filename, link || null, contact || null],
    );

    return res.send({
      data: {
        id: results.insertId,
        name,
        image_filename: req.file.filename,
        image_url: IMAGES_PATH + req.file.filename,
        link: link || null,
        contact: contact || null,
      },
      error: null,
    });
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

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, link, contact } = req.body;

    if (!id || !name) {
      throw "ID y nombre son obligatorios.";
    }

    let sql = "UPDATE sponsors SET name = ?, link = ?, contact = ?";
    let values = [name, link || null, contact || null];

    if (req.file) {
      sql += ", image_filename = ?";
      values.push(req.file.filename);
    }

    sql += " WHERE id = ?";
    values.push(id);

    await Database.execute(sql, values);

    const [results] = await Database.execute(
      "SELECT *, IF(image_filename IS NULL OR image_filename = '', NULL, CONCAT(?, image_filename)) as image_url FROM `sponsors` WHERE id = ?",
      [IMAGES_PATH, id],
    );

    return res.send({ data: results[0], error: null });
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

    await Database.execute("DELETE FROM `sponsors` WHERE id = ?", [id]);

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

export { destroy, index, store, update };
