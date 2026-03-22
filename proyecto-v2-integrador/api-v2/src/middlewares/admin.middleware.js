import { connection as Database } from "#database";

export const adminMiddleware = async (req, res, next) => {
  try {
    const user_id = req.user_id;

    const [results] = await Database.execute(
      "SELECT * FROM `users` WHERE id = ?",
      [user_id],
    );

    const user = results[0];

    if (user.role !== "admin") {
      throw "El usuario logueado no es administrador.";
    }

    next();
  } catch (err) {
    return res
      .status(401)
      .send({ data: null, error: "Error durante la autorización: " + err });
  }
};
