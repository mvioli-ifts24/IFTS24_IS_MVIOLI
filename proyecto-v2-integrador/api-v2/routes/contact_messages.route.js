import {
  destroy,
  index,
  store,
} from "#controllers/contact_messages.controller.js";
import express from "express";

const contactMessagesRoutesGroup = express.Router();

contactMessagesRoutesGroup.get("/", index);
contactMessagesRoutesGroup.post("/", store);
contactMessagesRoutesGroup.delete("/:id", destroy);

export default contactMessagesRoutesGroup;
