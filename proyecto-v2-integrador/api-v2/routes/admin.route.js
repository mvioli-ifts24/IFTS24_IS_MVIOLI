import {
  destroy as bannersDestroy,
  index as bannersIndex,
  store as bannersStore,
  update as bannersUpdate,
} from "#controllers/banners.controller.js";
import {
  admin_index,
  admin_response,
} from "#controllers/contact_messages.controller.js";
import { index as rolesIndex } from "#controllers/roles.controller.js";
import {
  destroy as sponsorsDestroy,
  index as sponsorsIndex,
  store as sponsorsStore,
  update as sponsorsUpdate,
} from "#controllers/sponsors.controller.js";
import {
  assignModerator,
  createAdmin,
  updateUserRole,
  deleteUser as usersDestroy,
  index as usersIndex,
  show as usersShow,
} from "#controllers/users.controller.js";
import { connection as Database } from "#database";
import { imagesUpload } from "#middlewares/images.multer.middleware.js";
import express from "express";

const adminRoutesGroup = express.Router();

adminRoutesGroup.get("/contact_messages", admin_index);
adminRoutesGroup.patch("/contact_messages/:id", admin_response);

adminRoutesGroup.get("/roles", rolesIndex);

adminRoutesGroup.get("/banners", bannersIndex);
adminRoutesGroup.post(
  "/banners",
  imagesUpload.fields([
    { name: "image_horizontal", maxCount: 1 },
    { name: "image_vertical", maxCount: 1 },
  ]),
  bannersStore,
);
adminRoutesGroup.put(
  "/banners/:id",
  imagesUpload.fields([
    { name: "image_horizontal", maxCount: 1 },
    { name: "image_vertical", maxCount: 1 },
  ]),
  bannersUpdate,
);
adminRoutesGroup.delete("/banners/:id", bannersDestroy);

adminRoutesGroup.get("/sponsors", sponsorsIndex);
adminRoutesGroup.post("/sponsors", imagesUpload.single("image"), sponsorsStore);
adminRoutesGroup.put(
  "/sponsors/:id",
  imagesUpload.single("image"),
  sponsorsUpdate,
);
adminRoutesGroup.delete("/sponsors/:id", sponsorsDestroy);

adminRoutesGroup.get("/users", usersIndex);
adminRoutesGroup.get("/users/:id", usersShow);
adminRoutesGroup.post("/users", createAdmin);
adminRoutesGroup.patch("/users/:id/moderator", assignModerator);
adminRoutesGroup.patch("/users/:id/role", updateUserRole);
adminRoutesGroup.delete("/users/:id", usersDestroy);
adminRoutesGroup.get("/stats", async (req, res) => {
  try {
    const [usersCount] = await Database.execute(
      "SELECT COUNT(*) as count FROM users WHERE deleted_at IS NULL AND role = 'user'",
    );
    const [adminsCount] = await Database.execute(
      "SELECT COUNT(*) as count FROM users WHERE deleted_at IS NULL AND role = 'admin'",
    );
    const [moderatorsCount] = await Database.execute(
      "SELECT COUNT(*) as count FROM users WHERE deleted_at IS NULL AND role = 'moderator'",
    );
    const [reviewsCount] = await Database.execute(
      "SELECT COUNT(*) as count FROM games_reviews",
    );
    const [bannersCount] = await Database.execute(
      "SELECT COUNT(*) as count FROM banners",
    );
    const [sponsorsCount] = await Database.execute(
      "SELECT COUNT(*) as count FROM sponsors",
    );
    const [pendingMessagesCount] = await Database.execute(
      "SELECT COUNT(*) as count FROM contact_messages WHERE response IS NULL",
    );

    return res.send({
      data: {
        users: usersCount[0].count,
        admins: adminsCount[0].count,
        moderators: moderatorsCount[0].count,
        reviews: reviewsCount[0].count,
        banners: bannersCount[0].count,
        sponsors: sponsorsCount[0].count,
        pending_messages: pendingMessagesCount[0].count,
      },
      error: null,
    });
  } catch (err) {
    return res.status(500).send({
      data: null,
      error:
        "No se pudieron cargar las estadísticas. Intenta de nuevo más tarde.",
    });
  }
});

adminRoutesGroup.get("/top-games", async (req, res) => {
  try {
    const [topByReviews] = await Database.execute(`
      SELECT
        cached_games.api_id,
        cached_games.title,
        cached_games.thumbnail,
        COUNT(games_reviews.id) AS review_count,
        ROUND(AVG(games_reviews.rating_id), 1) AS avg_rating
      FROM cached_games
      JOIN games_reviews ON games_reviews.api_game_id = cached_games.api_id
      GROUP BY cached_games.api_id, cached_games.title, cached_games.thumbnail
      ORDER BY review_count DESC
      LIMIT 5
    `);

    const [topByRating] = await Database.execute(`
      SELECT
        cached_games.api_id,
        cached_games.title,
        cached_games.thumbnail,
        COUNT(games_reviews.id) AS review_count,
        ROUND(AVG(games_reviews.rating_id), 1) AS avg_rating
      FROM cached_games
      JOIN games_reviews ON games_reviews.api_game_id = cached_games.api_id
      GROUP BY cached_games.api_id, cached_games.title, cached_games.thumbnail
      HAVING review_count >= 1
      ORDER BY avg_rating DESC, review_count DESC
      LIMIT 5
    `);

    return res.send({
      data: { top_by_reviews: topByReviews, top_by_rating: topByRating },
      error: null,
    });
  } catch (err) {
    return res.status(500).send({
      data: null,
      error:
        "No se pudo cargar el ranking de juegos. Intenta de nuevo más tarde.",
    });
  }
});

export default adminRoutesGroup;
