const { verifyToken } = require("../utils/jwt");
const AppError = require("../utils/AppError");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(
      new AppError(401, "Missing or malformed Authorization header."),
    );
  }
  try {
    const payload = verifyToken(token);
    req.user = payload; // { id, role, email }
    next();
  } catch (err) {
    next(new AppError(401, "Invalid or expired token."));
  }
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
