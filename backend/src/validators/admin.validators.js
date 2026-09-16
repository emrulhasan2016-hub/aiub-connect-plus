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

function isValidAiubEmail(email = "") {
  return /^[^\s@]+@aiub\.edu$/i.test(String(email).trim());
}

function isValidPassword(password = "") {
  return (
    typeof password === "string" &&
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

function validateCreateAdmin(body) {
  const { fullName, email, password } = body || {};
  const errors = {};

  if (!fullName || fullName.trim().length < 3) {
    errors.fullName = "Full name must be at least 3 characters.";
  }
  if (!isValidAiubEmail(email)) {
    errors.email = "Use a valid AIUB email (name@aiub.edu).";
  }
  if (!isValidPassword(password)) {
    errors.password = "Min 8 chars, 1 capital letter, 1 number.";
  }

  return errors;
}

module.exports = {
  validateUpdateUser,
  validateCreateAdmin,
  ALLOWED_ROLES,
  ALLOWED_STATUSES,
};
