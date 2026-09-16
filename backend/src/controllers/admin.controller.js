const adminService = require("../services/admin.service");
const {
  validateUpdateUser,
  validateCreateAdmin,
} = require("../validators/admin.validators");
const AppError = require("../utils/AppError");

function parseId(raw, label) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0)
    throw new AppError(400, `Invalid ${label}.`);
  return id;
}

function getDashboardStats(req, res, next) {
  try {
    const stats = adminService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

function getUsers(req, res, next) {
  try {
    const users = adminService.listUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

function updateUser(req, res, next) {
  try {
    const userId = parseId(req.params.id, "user id");
    const payload = validateUpdateUser(req.body);
    const user = adminService.updateUser(userId, req.user, payload);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

function createAdmin(req, res, next) {
  try {
    const errors = validateCreateAdmin(req.body);
    if (Object.keys(errors).length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Validation failed.", errors });
    }
    const admin = adminService.createAdmin(req.user, {
      fullName: req.body.fullName.trim(),
      email: req.body.email.trim().toLowerCase(),
      password: req.body.password,
    });
    res
      .status(201)
      .json({ success: true, message: "Admin account created.", data: admin });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboardStats, getUsers, updateUser, createAdmin };
