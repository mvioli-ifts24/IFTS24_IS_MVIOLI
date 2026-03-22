import { connection as Database } from "#database";

const index = async (req, res) => {
  try {
    const [results] = await Database.execute(
      "SELECT * FROM `banners` ORDER BY created_at DESC",
    );

    return res.send({ data: results, error: null });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
};

const store = async (req, res) => {
  try {
    const { name, link, contact } = req.body;

    if (!name || !req.file) {
      throw "Nombre e imagen son obligatorios.";
    }

    const [results] = await Database.execute(
      "INSERT INTO `banners` (name, image_filename, link, contact) VALUES (?, ?, ?, ?)",
      [name, req.file.filename, link || null, contact || null],
    );

    return res.send({
      data: {
        id: results.insertId,
        name,
        image_filename: req.file.filename,
        link,
        contact,
      },
      error: null,
    });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, link, contact } = req.body;

    if (!id || !name) {
      throw "ID y nombre son obligatorios.";
    }

    let sql = "UPDATE banners SET name = ?, link = ?, contact = ?";
    let values = [name, link || null, contact || null];

    if (req.file) {
      sql += ", image_filename = ?";
      values.push(req.file.filename);
    }

    sql += " WHERE id = ?";
    values.push(id);

    await Database.execute(sql, values);

    const [results] = await Database.execute(
      "SELECT * FROM `banners` WHERE id = ?",
      [id],
    );

    return res.send({ data: results[0], error: null });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    await Database.execute("DELETE FROM `banners` WHERE id = ?", [id]);

    return res.send({ data: null, error: null });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
};

export { destroy, index, store, update };
