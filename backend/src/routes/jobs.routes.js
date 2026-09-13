const express = require("express");
const { requireAuth } = require("../middleware/auth");
const controller = require("../controllers/jobs.controller");
const router = express.Router();
router.use(requireAuth);
router.get("/", controller.getJobs);
module.exports = router;