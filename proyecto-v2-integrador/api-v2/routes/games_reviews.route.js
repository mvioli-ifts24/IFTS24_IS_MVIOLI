const express = require("express");
const controller = require("#controllers/games_reviews.controller.js");

const gamesReviewsRoutesGroup = express.Router();

gamesReviewsRoutesGroup.get("/game/:game_id", controller.indexGameReviews);
gamesReviewsRoutesGroup.get("/user", controller.indexOwnReviews);
gamesReviewsRoutesGroup.get("/user/:user_id", controller.indexUserReviews);
gamesReviewsRoutesGroup.post("/", controller.store);
gamesReviewsRoutesGroup.put("/:id", controller.update);
gamesReviewsRoutesGroup.delete("/:id", controller.destroy);

module.exports = gamesReviewsRoutesGroup;
