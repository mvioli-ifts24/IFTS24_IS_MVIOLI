import { disable, index, show, update } from "#controllers/users.controller.js";
import { upload } from "#middlewares/profile.multer.middleware.js";
import express from "express";

const usersRouteGroup = express.Router();

usersRouteGroup.get("/", index);
usersRouteGroup.get("/:id", show);
usersRouteGroup.put("/", upload.single("profile_picture"), update);
usersRouteGroup.patch("/", disable);

export default usersRouteGroup;
