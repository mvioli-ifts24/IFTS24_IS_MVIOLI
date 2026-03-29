import { connection as Database } from "#database";

const API_HOST = (process.env.API_HOST || "").replace(/\/+$/, "");
const IMAGES_PATH = API_HOST + "/storage/uploads/images/";

const index = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.min(
      20,
      Math.max(1, parseInt(req.query.pageSize) || 5),
    );
    const search = req.query.search?.trim() || null;
    const offset = (page - 1) * pageSize;

    let whereClause = "";
    const conditionParams = [];

    if (search) {
      whereClause = "WHERE name LIKE ?";
      conditionParams.push(`%${search}%`);
    }

    const [[{ total }]] = await Database.execute(
      `SELECT COUNT(*) as total FROM \`sponsors\` ${whereClause}`,
      conditionParams,
    );

    const [results] = await Database.execute(
      `SELECT *, IF(image_filename IS NULL OR image_filename = '', NULL, CONCAT(?, image_filename)) as image_url FROM \`sponsors\` ${whereClause} ORDER BY created_at DESC LIMIT ${pageSize} OFFSET ${offset}`,
      [IMAGES_PATH, ...conditionParams],
    );

    const baseUrl = `${req.protocol}://${req.get("host")}${req.path}`;
    const buildUrl = (p) => {
      const qs = new URLSearchParams({
        page: String(p),
        pageSize: String(pageSize),
      });
      if (search) qs.set("search", search);
      return `${baseUrl}?${qs.toString()}`;
    };

    return res.send({
      data: results,
      error: null,
      total,
      page,
      pageSize,
      prevUrl: page > 1 ? buildUrl(page - 1) : null,
      nextUrl: page * pageSize < total ? buildUrl(page + 1) : null,
    });
  } catch (err) {
    return res.status(400).send({
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

    const [[existing]] = await Database.execute(
      "SELECT id FROM `sponsors` WHERE name = ? LIMIT 1",
      [name],
    );
    if (existing) throw "Ya existe un sponsor con ese nombre.";

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
    return res.status(400).send({
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

    const [[duplicate]] = await Database.execute(
      "SELECT id FROM `sponsors` WHERE name = ? AND id <> ? LIMIT 1",
      [name, id],
    );
    if (duplicate) throw "Ya existe un sponsor con ese nombre.";

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
    return res.status(400).send({
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
    return res.status(400).send({
      data: null,
      error:
        typeof err === "string"
          ? err
          : "Ocurrió un error inesperado. Intenta de nuevo más tarde.",
    });
  }
};

export { destroy, index, store, update };
