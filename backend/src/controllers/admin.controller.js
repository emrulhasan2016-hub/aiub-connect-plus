const adminService = require("../services/admin.service");
const { validateUpdateUser } = require("../validators/admin.validators");
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
    const user = adminService.updateUser(userId, req.user, payload); // ⭐ req.user পুরোটা পাঠানো হচ্ছে
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboardStats, getUsers, updateUser };
