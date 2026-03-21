const express = require("express");
const controller = require("#controllers/games.controller.js");

const gamesRoutesGroup = express.Router();

gamesRoutesGroup.get("/", controller.index);
gamesRoutesGroup.get("/:game_id", controller.show);

module.exports = gamesRoutesGroup;
