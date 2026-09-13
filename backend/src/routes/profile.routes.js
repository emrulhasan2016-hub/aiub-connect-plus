const express = require("express");
const { requireAuth } = require("../middleware/auth");
const controller = require("../controllers/profile.controller");

const router = express.Router();
router.use(requireAuth);
router.get("/me", controller.getMe);
router.put("/me", controller.updateMe);

module.exports = router;
