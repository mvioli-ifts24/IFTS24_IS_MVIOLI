const express = require("express");
const controller = require("#controllers/auth.controller.js");
const upload = require("#middlewares/profile.multer.middleware.js");

const authRoutesGroup = express.Router();

authRoutesGroup.post(
  "/register",
  upload.single("profile_picture"),
  controller.register
);
authRoutesGroup.post("/login", controller.login);

module.exports = authRoutesGroup;
