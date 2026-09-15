const express = require("express");
const { requireAuth } = require("../middleware/auth");
const controller = require("../controllers/notices.controller");

const router = express.Router();
router.use(requireAuth);
router.get("/", controller.getNotices);

module.exports = router;