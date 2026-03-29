import { connection as Database } from "#database";

const API_HOST = (process.env.API_HOST || "").replace(/\/+$/, "");
const IMAGES_PATH = API_HOST + "/storage/uploads/images/";

const BANNER_SELECT = `
  SELECT *,
    IF(image_filename_horizontal IS NULL OR image_filename_horizontal = '', NULL, CONCAT(?, image_filename_horizontal)) as image_url_horizontal,
    IF(image_filename_vertical IS NULL OR image_filename_vertical = '', NULL, CONCAT(?, image_filename_vertical)) as image_url_vertical
  FROM \`banners\`
`;

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
      `SELECT COUNT(*) as total FROM \`banners\` ${whereClause}`,
      conditionParams,
    );

    const [results] = await Database.execute(
      BANNER_SELECT +
        `${whereClause} ORDER BY created_at DESC LIMIT ${pageSize} OFFSET ${offset}`,
      [IMAGES_PATH, IMAGES_PATH, ...conditionParams],
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
    const { contact, link, name } = req.body;
    const fileH = req.files?.["image_horizontal"]?.[0] ?? null;
    const fileV = req.files?.["image_vertical"]?.[0] ?? null;

    if (!name || !fileH || !fileV) {
      throw "Nombre e imágenes horizontal y vertical son obligatorias.";
    }

    const [[existing]] = await Database.execute(
      "SELECT id FROM `banners` WHERE name = ? LIMIT 1",
      [name],
    );
    if (existing) throw "Ya existe un banner con ese nombre.";

    const [results] = await Database.execute(
      "INSERT INTO `banners` (name, image_filename_horizontal, image_filename_vertical, link, contact) VALUES (?, ?, ?, ?, ?)",
      [name, fileH.filename, fileV.filename, link || null, contact || null],
    );

    return res.send({
      data: {
        id: results.insertId,
        name,
        image_filename_horizontal: fileH.filename,
        image_filename_vertical: fileV.filename,
        image_url_horizontal: IMAGES_PATH + fileH.filename,
        image_url_vertical: IMAGES_PATH + fileV.filename,
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
    const { contact, link, name } = req.body;
    const fileH = req.files?.["image_horizontal"]?.[0] ?? null;
    const fileV = req.files?.["image_vertical"]?.[0] ?? null;

    if (!id || !name) {
      throw "ID y nombre son obligatorios.";
    }

    const [[duplicate]] = await Database.execute(
      "SELECT id FROM `banners` WHERE name = ? AND id <> ? LIMIT 1",
      [name, id],
    );
    if (duplicate) throw "Ya existe un banner con ese nombre.";

    let sql = "UPDATE banners SET name = ?, link = ?, contact = ?";
    let values = [name, link || null, contact || null];

    if (fileH) {
      sql += ", image_filename_horizontal = ?";
      values.push(fileH.filename);
    }

    if (fileV) {
      sql += ", image_filename_vertical = ?";
      values.push(fileV.filename);
    }

    sql += " WHERE id = ?";
    values.push(id);

    await Database.execute(sql, values);

    const [results] = await Database.execute(BANNER_SELECT + "WHERE id = ?", [
      IMAGES_PATH,
      IMAGES_PATH,
      id,
    ]);

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

    await Database.execute("DELETE FROM `banners` WHERE id = ?", [id]);

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
