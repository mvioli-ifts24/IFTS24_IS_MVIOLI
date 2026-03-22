import {
  destroy,
  index,
  store,
  update,
} from "#controllers/sponsors.controller.js";
import { upload } from "#middlewares/profile.multer.middleware.js";
import express from "express";

const sponsorsRoutesGroup = express.Router();

sponsorsRoutesGroup.get("/", index);
sponsorsRoutesGroup.post("/", upload.single("image"), store);
sponsorsRoutesGroup.put("/:id", upload.single("image"), update);
sponsorsRoutesGroup.delete("/:id", destroy);

export default sponsorsRoutesGroup;
