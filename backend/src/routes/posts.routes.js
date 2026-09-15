// src/routes/posts.routes.js
// OWNED BY: Member 2 (Sajib) - Home Feed
// Mounted at /api/posts by server.js

const express = require("express");
const { requireAuth } = require("../middleware/auth");
const controller = require("../controllers/posts.controller");

const router = express.Router();

router.use(requireAuth);

router.get("/", controller.getPosts);
router.post("/", controller.createPost);
router.get("/:id", controller.getPost);
router.post("/:id/like", controller.toggleLike);
router.get("/:id/comments", controller.getComments);
router.post("/:id/comments", controller.addComment);

module.exports = router;