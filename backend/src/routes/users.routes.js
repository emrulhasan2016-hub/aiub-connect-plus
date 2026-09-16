const express = require("express");
const { requireAuth } = require("../middleware/auth");
const controller = require("../controllers/users.controller");

const router = express.Router();
router.use(requireAuth);

router.get("/", controller.searchUsers);
router.get("/:id", controller.getUser);
router.post("/:id/follow", controller.toggleFollow);

module.exports = router;
