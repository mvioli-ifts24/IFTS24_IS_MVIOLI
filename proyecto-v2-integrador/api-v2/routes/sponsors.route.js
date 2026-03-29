import { index } from "#controllers/sponsors.controller.js";
import express from "express";

const sponsorsRoutesGroup = express.Router();

sponsorsRoutesGroup.get("/", index);

export default sponsorsRoutesGroup;
