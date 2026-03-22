import { login, register } from "#controllers/auth.controller.js";
import { upload } from "#middlewares/profile.multer.middleware.js";
import express from "express";

const authRoutesGroup = express.Router();

authRoutesGroup.post("/register", upload.single("profile_picture"), register);
authRoutesGroup.post("/login", login);

export default authRoutesGroup;
