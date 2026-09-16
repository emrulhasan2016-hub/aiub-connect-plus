const { verifyToken } = require("../utils/jwt");
const AppError = require("../utils/AppError");
const db = require("../database/db");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(
      new AppError(401, "Missing or malformed Authorization header."),
    );
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    return next(new AppError(401, "Invalid or expired token."));
  }

  const account = db
    .prepare("SELECT id, role, status FROM users WHERE id = ?")
    .get(payload.id);

  if (!account) {
    return next(new AppError(401, "This account no longer exists."));
  }
  if (account.status === "banned") {
    return next(new AppError(403, "Your account has been banned."));
  }

  req.user = { ...payload, role: account.role };
  next();
}

function requireRole(...allowedRoles) {
  return function (req, res, next) {
    if (!req.user) return next(new AppError(401, "Not authenticated."));
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(403, "You do not have permission to perform this action."),
      );
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
