const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const controller = require("../controllers/admin.controller");

const router = express.Router();
router.use(requireAuth);
router.use(requireRole("Admin"));

router.get("/dashboard-stats", controller.getDashboardStats);
router.get("/users", controller.getUsers);
router.put("/users/:id", controller.updateUser);

module.exports = router;
