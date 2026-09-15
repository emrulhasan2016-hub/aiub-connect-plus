// src/validators/posts.validators.js
// OWNED BY: Member 2 (Sajib) - Home Feed

const AppError = require("../utils/AppError");

const CATEGORIES = [
  "General Discussion",
  "Academic Discussion",
  "Notice",
  "Job Circular",
  "Internship",
  "Scholarship",
  "Event",
  "Study Material",
  "Lost & Found",
  "Achievement",
];

const VISIBILITIES = ["Public", "Group Only"];

function validateCreatePost(body) {
  const content = String(body.content || "").trim();

  if (!content) {
    throw new AppError(400, "Post content cannot be empty.");
  }
  if (content.length > 500) {
    throw new AppError(400, "Post content must be 500 characters or fewer.");
  }
  if (!body.category || !CATEGORIES.includes(body.category)) {
    throw new AppError(400, "Please choose a valid category.");
  }
  const visibility = body.visibility || "Public";
  if (!VISIBILITIES.includes(visibility)) {
    throw new AppError(400, "Visibility must be 'Public' or 'Group Only'.");
  }

  return {
    content,
    category: body.category,
    image: body.image || null,
    visibility,
  };
}

function validateComment(body) {
  const text = String(body.text || "").trim();

  if (!text) {
    throw new AppError(400, "Comment cannot be empty.");
  }
  if (text.length > 200) {
    throw new AppError(400, "Comment must be 200 characters or fewer.");
  }

  let parentId = null;
  if (body.parentId !== undefined && body.parentId !== null && body.parentId !== "") {
    parentId = Number(body.parentId);
    if (!Number.isInteger(parentId) || parentId <= 0) {
      throw new AppError(400, "Invalid parentId.");
    }
  }

  return { text, parentId };
}

module.exports = { validateCreatePost, validateComment, CATEGORIES, VISIBILITIES };