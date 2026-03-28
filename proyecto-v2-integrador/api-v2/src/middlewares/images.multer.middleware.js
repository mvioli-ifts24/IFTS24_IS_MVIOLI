import crypto from "crypto";
import fs from "fs";
import multer from "multer";
import path from "path";

const UPLOAD_DIR = "./public/uploads/images/";

// Crear el directorio si no existe
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uuid = crypto.randomUUID();
    return cb(null, uuid + path.extname(file.originalname));
  },
});

const imagesUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpg|jpeg|png|gif|webp/;
    const mimetype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      "Tipo de archivo no soportado. Solo se permiten imágenes (jpg, jpeg, png, gif, webp).",
    );
  },
  limits: { fileSize: 1024 * 1024 * 2 }, // 2MB
});

export { imagesUpload };
