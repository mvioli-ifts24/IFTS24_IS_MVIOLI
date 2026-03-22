import { index } from "#controllers/games_reviews_ratings.controller.js";
import express from "express";

const gamesReviewsRatingsRoutesGroup = express.Router();

gamesReviewsRatingsRoutesGroup.get("/", index);

export default gamesReviewsRatingsRoutesGroup;
