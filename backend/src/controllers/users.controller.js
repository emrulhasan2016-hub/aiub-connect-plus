const usersService = require("../services/users.service");
const AppError = require("../utils/AppError");

function parseId(raw, label) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, `Invalid ${label}.`);
  }
  return id;
}

function searchUsers(req, res, next) {
  try {
    const users = usersService.searchUsers(req.query.q, req.user.id);
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

function getUser(req, res, next) {
  try {
    const userId = parseId(req.params.id, "user id");
    const user = usersService.getPublicProfile(userId);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

function toggleFollow(req, res, next) {
  try {
    const userId = parseId(req.params.id, "user id");
    const result = usersService.toggleFollow(userId, req.user.id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { searchUsers, getUser, toggleFollow };
