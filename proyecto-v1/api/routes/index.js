const express = require("express");
const gamesReviewsRoutesGroup = require("./games_reviews.route");
const gamesReviewsRatingsRoutesGroup = require("./games_reviews_ratings.route");
const contactMessagesRoutesGroup = require("./contact_messages.route");
const authRoutesGroup = require("./auth.route");
const authMiddleware = require("#middlewares/auth.middleware.js");
const usersRouteGroup = require("./users.route");
const usersGendersRouteGroup = require("./users_genders.route");
const gamesRouteGroup = require("./games.route");
const adminRoutesGroup = require("./admin.route");
const adminMiddleware = require("#middlewares/admin.middleware.js");
const path = require("path");

const router = express.Router();

const rootRouter = router
  .use("/auth", authRoutesGroup)
  .use("/users_genders", usersGendersRouteGroup)
  .use("/storage", express.static(path.resolve(process.cwd(), "./public")))
  .use("", authMiddleware)
  .use("/games_reviews", gamesReviewsRoutesGroup)
  .use("/games_reviews_ratings", gamesReviewsRatingsRoutesGroup)
  .use("/contact_messages", contactMessagesRoutesGroup)
  .use("/users", usersRouteGroup)
  .use("/games", gamesRouteGroup)
  .use("/admin", adminMiddleware, adminRoutesGroup);

module.exports = rootRouter;
