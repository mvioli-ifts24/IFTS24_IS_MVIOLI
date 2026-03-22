import { index, show } from "#controllers/games.controller.js";
import express from "express";

const gamesRoutesGroup = express.Router();

gamesRoutesGroup.get("/", index);
gamesRoutesGroup.get("/:game_id", show);

export default gamesRoutesGroup;
