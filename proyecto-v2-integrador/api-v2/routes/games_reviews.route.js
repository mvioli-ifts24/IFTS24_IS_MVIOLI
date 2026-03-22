import {
  destroy,
  indexGameReviews,
  indexOwnReviews,
  indexUserReviews,
  store,
  update,
} from "#controllers/games_reviews.controller.js";
import express from "express";

const gamesReviewsRoutesGroup = express.Router();

gamesReviewsRoutesGroup.get("/game/:game_id", indexGameReviews);
gamesReviewsRoutesGroup.get("/user", indexOwnReviews);
gamesReviewsRoutesGroup.get("/user/:user_id", indexUserReviews);
gamesReviewsRoutesGroup.post("/", store);
gamesReviewsRoutesGroup.put("/:id", update);
gamesReviewsRoutesGroup.delete("/:id", destroy);

export default gamesReviewsRoutesGroup;
