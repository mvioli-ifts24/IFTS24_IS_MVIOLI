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
import {
  destroy as sponsorsDestroy,
  index as sponsorsIndex,
  store as sponsorsStore,
  update as sponsorsUpdate,
} from "#controllers/sponsors.controller.js";
import {
  assignModerator,
  createAdmin,
  index as usersIndex,
  show as usersShow,
} from "#controllers/users.controller.js";
import { connection as Database } from "#database";
import { upload } from "#middlewares/profile.multer.middleware.js";
import express from "express";

const adminRoutesGroup = express.Router();

adminRoutesGroup.get("/contact_messages", admin_index);
adminRoutesGroup.patch("/contact_messages/:id", admin_response);

adminRoutesGroup.get("/banners", bannersIndex);
adminRoutesGroup.post("/banners", upload.single("image"), bannersStore);
adminRoutesGroup.put("/banners/:id", upload.single("image"), bannersUpdate);
adminRoutesGroup.delete("/banners/:id", bannersDestroy);

adminRoutesGroup.get("/sponsors", sponsorsIndex);
adminRoutesGroup.post("/sponsors", upload.single("image"), sponsorsStore);
adminRoutesGroup.put("/sponsors/:id", upload.single("image"), sponsorsUpdate);
adminRoutesGroup.delete("/sponsors/:id", sponsorsDestroy);

adminRoutesGroup.get("/users", usersIndex);
adminRoutesGroup.get("/users/:id", usersShow);
adminRoutesGroup.post("/users", createAdmin);
adminRoutesGroup.patch("/users/:id/moderator", assignModerator);
adminRoutesGroup.get("/stats", async (req, res) => {
  try {
    const [usersCount] = await Database.execute(
      "SELECT COUNT(*) as count FROM users WHERE deleted_at IS NULL",
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

    return res.send({
      data: {
        users: usersCount[0].count,
        reviews: reviewsCount[0].count,
        banners: bannersCount[0].count,
        sponsors: sponsorsCount[0].count,
      },
      error: null,
    });
  } catch (err) {
    return res
      .status(400)
      .send({ data: null, error: "Error al consultar la DB: " + err });
  }
});

export default adminRoutesGroup;
