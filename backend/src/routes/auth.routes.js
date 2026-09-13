// src/routes/auth.routes.js
// OWNER: Member 1 (Zihadul) - Auth. Implemented in Document 2.

const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth");

// POST /api/auth/register
router.post("/register", authController.register);

// POST /api/auth/login
router.post("/login", authController.login);

// POST /api/auth/forgot-password
router.post("/forgot-password", authController.forgotPassword);

// GET /api/auth/me (protected — requires a valid JWT)
router.get("/me", requireAuth, authController.me);

module.exports = router;
