const express = require("express");
const contact_messages_controller = require("#controllers/contact_messages.controller.js");

const adminRoutesGroup = express.Router();

adminRoutesGroup.get(
  "/contact_messages",
  contact_messages_controller.admin_index
);
adminRoutesGroup.patch(
  "/contact_messages/:id",
  contact_messages_controller.admin_response
);

module.exports = adminRoutesGroup;
