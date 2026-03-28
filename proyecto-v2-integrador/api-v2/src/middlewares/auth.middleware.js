import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      throw "No se proveyó autenticación.";
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw "El token provisto tiene un formato incorrecto. Debe ser de tipo Bearer.";
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user_id = decoded.id;

    next();
  } catch (err) {
    return res
      .status(401)
      .send({
        data: null,
        error: "Error durante la autenticación: " + (err?.message ?? err),
      });
  }
};
