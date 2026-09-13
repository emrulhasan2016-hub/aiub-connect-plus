const express = require("express");
const { requireAuth } = require("../middleware/auth");
const controller = require("../controllers/groups.controller");

const router = express.Router();
router.use(requireAuth);

router.get("/", controller.getGroups);
router.post("/:id/join", controller.joinGroup);
router.get("/:id/messages", controller.getMessages);
router.post("/:id/messages", controller.postMessage);
module.exports = router;