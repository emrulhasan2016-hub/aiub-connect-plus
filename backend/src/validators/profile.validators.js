const AppError = require("../utils/AppError");

function validateUpdateProfile(body) {
  const fullName = String(body.fullName || "").trim();
  const department = String(body.department || "").trim();
  const bio = String(body.bio || "").trim();
  const avatar =
    body.avatar === undefined || body.avatar === null
      ? null
      : String(body.avatar).trim();
  const cover =
    body.cover === undefined || body.cover === null
      ? null
      : String(body.cover).trim();

  if (fullName.length < 3) {
    throw new AppError(400, "Full name must be at least 3 characters.");
  }
  if (!department) {
    throw new AppError(400, "Department is required.");
  }
  if (bio.length > 150) {
    throw new AppError(400, "Bio must be 150 characters or fewer.");
  }

  const isSafeImageRef = (val) =>
    val === null ||
    val === "" ||
    /^https?:\/\//i.test(val) ||
    /^avatar[0-9]+$/i.test(val) ||
    /^cover[0-9]+$/i.test(val);

  if (!isSafeImageRef(avatar)) {
    throw new AppError(400, "Avatar must be a valid image URL or preset id.");
  }
  if (!isSafeImageRef(cover)) {
    throw new AppError(400, "Cover must be a valid image URL or preset id.");
  }

  return { fullName, department, bio, avatar, cover };
}

module.exports = { validateUpdateProfile };
