const AppError = require("../utils/AppError");
const ALLOWED_ROLES = ["Student", "Faculty", "Alumni", "Admin"];
const ALLOWED_STATUSES = ["active", "banned"];

function validateUpdateUser(body) {
  const role = body.role !== undefined ? String(body.role) : undefined;
  const status = body.status !== undefined ? String(body.status) : undefined;

  if (role === undefined && status === undefined) {
    throw new AppError(400, "Provide at least a role or a status to update.");
  }
  if (role !== undefined && !ALLOWED_ROLES.includes(role)) {
    throw new AppError(
      400,
      `Role must be one of: ${ALLOWED_ROLES.join(", ")}.`,
    );
  }
  if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
    throw new AppError(
      400,
      `Status must be one of: ${ALLOWED_STATUSES.join(", ")}.`,
    );
  }

  return { role, status };
}

module.exports = { validateUpdateUser, ALLOWED_ROLES, ALLOWED_STATUSES };
