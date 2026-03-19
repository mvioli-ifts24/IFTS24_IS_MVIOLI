const express = require("express");
const controller = require("#controllers/contact_messages.controller.js");

const contactMessagesRoutesGroup = express.Router();

contactMessagesRoutesGroup.get("/", controller.index);
contactMessagesRoutesGroup.post("/", controller.store);
contactMessagesRoutesGroup.delete("/:id", controller.destroy);

module.exports = contactMessagesRoutesGroup;
