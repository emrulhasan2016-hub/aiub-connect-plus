const AppError = require("../utils/AppError");

function validateUpdateProfile(body) {
  const fullName = String(body.fullName || "").trim();
  const department = String(body.department || "").trim();
  const bio = String(body.bio || "").trim();

  if (fullName.length < 3) {
    throw new AppError(400, "Full name must be at least 3 characters.");
  }
  if (!department) {
    throw new AppError(400, "Department is required.");
  }
  if (bio.length > 150) {
    throw new AppError(400, "Bio must be 150 characters or fewer.");
  }

  return { fullName, department, bio };
}

module.exports = { validateUpdateProfile };
