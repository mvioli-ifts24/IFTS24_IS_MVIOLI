const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      throw "No se proveyó autenticacion.";
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw "El token provisto tiene un formato incorrecto. Debe ser de tipo <Bearer>.";
    }

    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
      if (error) {
        throw "Autenticación de token invalida o token expirado.";
      }
      req.user_id = decoded.id;
    });

    next();
  } catch (err) {
    return res
      .status(401)
      .send({ data: null, error: "Error durante la autenticación: " + err });
  }
};
