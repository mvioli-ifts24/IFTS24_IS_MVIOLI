const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, `./public/uploads/profile_pictures/`);
  },
  filename: (req, file, cb) => {
    const uuid = crypto.randomUUID();
    req.file_uuid = uuid;
    return cb(null, uuid + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpg|jpeg|png/;
    const mimetype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && path.extname) {
      return cb(null, true);
    }
    cb("Tipo de archivo no soportado");
  },
  limits: { fileSize: 1024 * 1024 * 1 },
});

module.exports = upload;
