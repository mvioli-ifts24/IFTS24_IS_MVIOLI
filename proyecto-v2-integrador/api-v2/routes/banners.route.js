import { index } from "#controllers/banners.controller.js";
import express from "express";

const bannersRoutesGroup = express.Router();

bannersRoutesGroup.get("/", index);

export default bannersRoutesGroup;
