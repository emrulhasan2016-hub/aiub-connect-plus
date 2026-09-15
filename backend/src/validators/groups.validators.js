const AppError = require("../utils/AppError");
function validateGroupMessage(body) {
  const text = String(body.text || "").trim();
  if (!text) {
    throw new AppError(400, "Message cannot be empty.");
  }
  if (text.length > 500) {
    throw new AppError(400, "Message must be 500 characters or fewer.");
  }
  return { text };
}
module.exports = { validateGroupMessage };