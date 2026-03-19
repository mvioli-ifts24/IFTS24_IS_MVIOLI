const express = require("express");
const controller = require("#controllers/users.controller.js");
const upload = require("#middlewares/profile.multer.middleware.js");

const usersRouteGroup = express.Router();

usersRouteGroup.get("/", controller.index);
usersRouteGroup.get("/:id", controller.show);
usersRouteGroup.put("/", upload.single("profile_picture"), controller.update);
usersRouteGroup.patch("/", controller.disable);

module.exports = usersRouteGroup;
