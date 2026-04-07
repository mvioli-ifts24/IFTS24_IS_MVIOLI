import { adminMiddleware } from "#middlewares/admin.middleware.js";
import { authMiddleware } from "#middlewares/auth.middleware.js";
import express from "express";
import adminRoutesGroup from "./admin.route.js";
import authRoutesGroup from "./auth.route.js";
import bannersRoutesGroup from "./banners.route.js";
import contactMessagesRoutesGroup from "./contact_messages.route.js";
import gamesRouteGroup from "./games.route.js";
import gamesReviewsRoutesGroup from "./games_reviews.route.js";
import gamesReviewsRatingsRoutesGroup from "./games_reviews_ratings.route.js";
import sponsorsRoutesGroup from "./sponsors.route.js";
import usersRouteGroup from "./users.route.js";
import usersGendersRouteGroup from "./users_genders.route.js";

const router = express.Router();

const rootRouter = router
  .use("/auth", authRoutesGroup)
  .use("", authMiddleware)
  .use("/users_genders", usersGendersRouteGroup)
  .use("/games_reviews", gamesReviewsRoutesGroup)
  .use("/games_reviews_ratings", gamesReviewsRatingsRoutesGroup)
  .use("/contact_messages", contactMessagesRoutesGroup)
  .use("/users", usersRouteGroup)
  .use("/games", gamesRouteGroup)
  .use("/banners", bannersRoutesGroup)
  .use("/sponsors", sponsorsRoutesGroup)
  .use("/admin", adminMiddleware, adminRoutesGroup);

export default rootRouter;
