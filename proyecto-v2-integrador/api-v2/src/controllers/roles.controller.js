import { connection as Database } from "#database";

const index = async (req, res) => {
  try {
    const [results] = await Database.execute(
      "SELECT id, name, label FROM user_roles ORDER BY id",
    );

    return res.send({ data: results, error: null });
  } catch (err) {
    return res.status(500).send({
      data: null,
      error: "No se pudieron cargar los roles.",
    });
  }
};

export { index };
