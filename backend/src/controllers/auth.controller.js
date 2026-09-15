// src/controllers/auth.controller.js
// OWNER: Member 1 (Zihadul) - Auth

const authService = require("../services/auth.service");
const AppError = require("../utils/AppError");
const {
  validateRegisterInput,
  validateLoginInput,
  validateForgotPasswordInput,
} = require("../validators/auth.validators");

async function register(req, res, next) {
  try {
    const errors = validateRegisterInput(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed.", errors });
    }

    const user = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: "Account created. You can now log in.",
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const errors = validateLoginInput(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed.", errors });
    }

    const { token, user } = await authService.login(req.body);
    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: { token, user },
    });
  } catch (err) {
    next(err);
  }
}

function forgotPassword(req, res, next) {
  try {
    const errors = validateForgotPasswordInput(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed.", errors });
    }

    const result = authService.forgotPassword(req.body);
    res.status(200).json({ success: true, message: result.message, data: { demoNote: result.demoNote } });
  } catch (err) {
    next(err);
  }
}

function me(req, res, next) {
  try {
    if (!req.user) {
      throw new AppError(401, "Not authenticated.");
    }
    const user = authService.getMe(req.user.id);
    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, forgotPassword, me };
