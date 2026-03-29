import crypto from "crypto";
import fs from "fs";
import multer from "multer";
import path from "path";

const UPLOAD_DIR = "./public/uploads/profile_pictures/";

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
      path.extname(file.originalname).toLowerCase(),
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      new Error(
        "Tipo de archivo no soportado. Solo se permiten imágenes (jpg, jpeg, png).",
      ),
    );
  },
  limits: { fileSize: 1024 * 1024 * 1 },
});

export { upload };
