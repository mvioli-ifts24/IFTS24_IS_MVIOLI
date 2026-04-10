import { index as bannersIndex } from "#controllers/banners.controller.js";
import { getRecentReviews, getStats } from "#controllers/public.controller.js";
import { index as sponsorsIndex } from "#controllers/sponsors.controller.js";
import express from "express";

const publicRoutesGroup = express.Router();

publicRoutesGroup.get("/banners", bannersIndex);
publicRoutesGroup.get("/reviews", getRecentReviews);
publicRoutesGroup.get("/sponsors", sponsorsIndex);
publicRoutesGroup.get("/stats", getStats);

export default publicRoutesGroup;
