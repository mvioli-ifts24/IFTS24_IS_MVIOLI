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
      return res
        .status(403)
        .send({
          data: null,
          error: "Acceso denegado: se requieren permisos de administrador.",
        });
    }

    next();
  } catch (err) {
    return res
      .status(403)
      .send({
        data: null,
        error: "Error durante la autorización: " + (err?.message ?? err),
      });
  }
};
