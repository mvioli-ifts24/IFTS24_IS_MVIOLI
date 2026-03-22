import {
  destroy,
  index,
  store,
  update,
} from "#controllers/banners.controller.js";
import { upload } from "#middlewares/profile.multer.middleware.js";
import express from "express";

const bannersRoutesGroup = express.Router();

bannersRoutesGroup.get("/", index);
bannersRoutesGroup.post("/", upload.single("image"), store);
bannersRoutesGroup.put("/:id", upload.single("image"), update);
bannersRoutesGroup.delete("/:id", destroy);

export default bannersRoutesGroup;
