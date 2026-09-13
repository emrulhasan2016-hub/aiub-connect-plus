const express = require("express");
const { requireAuth } = require("../middleware/auth");
const controller = require("../controllers/notifications.controller");

const router = express.Router();
router.use(requireAuth);
router.get("/", controller.getNotifications);
router.put("/", controller.markRead);

module.exports = router;
