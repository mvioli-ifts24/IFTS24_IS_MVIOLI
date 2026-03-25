import {
  login,
  register,
  verifyAccount,
} from "#controllers/auth.controller.js";
import { authMiddleware } from "#middlewares/auth.middleware.js";
import { upload } from "#middlewares/profile.multer.middleware.js";
import express from "express";

const authRoutesGroup = express.Router();

authRoutesGroup.post("/register", upload.single("profile_picture"), register);
authRoutesGroup.post("/login", login);
authRoutesGroup.post("/verify-account", authMiddleware, verifyAccount);

export default authRoutesGroup;
