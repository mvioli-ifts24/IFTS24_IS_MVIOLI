import { index } from "#controllers/users_genders.controller.js";
import express from "express";

const usersGendersRouteGroup = express.Router();

usersGendersRouteGroup.get("/", index);

export default usersGendersRouteGroup;
