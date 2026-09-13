const AppError = require("../utils/AppError");

function validateMarkRead(body) {
  if (body.markAll === true) {
    return { markAll: true, id: null };
  }
  const id = Number(body.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(
      400,
      "Provide either { markAll: true } or a valid { id }.",
    );
  }
  return { markAll: false, id };
}

module.exports = { validateMarkRead };
