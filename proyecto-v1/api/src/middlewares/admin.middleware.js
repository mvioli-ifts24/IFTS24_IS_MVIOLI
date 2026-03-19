const Database = require("#database");

module.exports = async (req, res, next) => {
  try {
    const user_id = req.user_id;

    const [results] = await Database.query(
      "SELECT * FROM `users` WHERE id = ?",
      [user_id]
    );

    const user = results[0];

    if (!user.is_admin) {
      throw "El usuario logueado no es administrador.";
    }

    next();
  } catch (err) {
    return res
      .status(401)
      .send({ data: null, error: "Error durante la autorización: " + err });
  }
};
