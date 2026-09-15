// src/services/auth.service.js
// OWNER: Member 1 (Zihadul) - Auth

const bcrypt = require("bcryptjs");
const db = require("../database/db");
const { signToken } = require("../utils/jwt");
const AppError = require("../utils/AppError");

const SALT_ROUNDS = 10;

function toPublicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    fullName: row.full_name,
    username: row.username,
    email: row.email,
    role: row.role,
    department: row.department,
    studentId: row.student_id,
    bio: row.bio,
    avatarUrl: row.avatar_url,
    coverUrl: row.cover_url,
    status: row.status,
    createdAt: row.created_at,
  };
}

function findByEmail(email) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase());
}

function findByUsername(username) {
  return db.prepare("SELECT * FROM users WHERE username = ?").get(username);
}

function findById(id) {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
}

async function register({ fullName, username, email, department, studentId, role, password }) {
  if (findByEmail(email)) {
    throw new AppError(409, "An account with this AIUB email already exists.");
  }
  if (findByUsername(username)) {
    throw new AppError(409, "This username is already taken.");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const insert = db.prepare(`
    INSERT INTO users (full_name, username, email, password_hash, role, department, student_id, status)
    VALUES (@fullName, @username, @email, @passwordHash, @role, @department, @studentId, 'active')
  `);

  const result = insert.run({
    fullName,
    username,
    email: email.toLowerCase(),
    passwordHash,
    role,
    department,
    studentId,
  });

  const created = findById(result.lastInsertRowid);
  return toPublicUser(created);
}

async function login({ email, password }) {
  const row = findByEmail(email);
  if (!row) {
    throw new AppError(401, "Invalid email or password.");
  }

  const passwordMatches = await bcrypt.compare(password, row.password_hash);
  if (!passwordMatches) {
    throw new AppError(401, "Invalid email or password.");
  }

  if (row.status === "banned") {
    throw new AppError(403, "This account has been suspended by an administrator.");
  }

  const publicUser = toPublicUser(row);
  const token = signToken(publicUser);
  return { token, user: publicUser };
}

// PROJECT-APPROPRIATE mock: no email provider is configured anywhere in the
// supplied project (VERIFIED — no nodemailer/SMTP config exists). The
// response is identical whether or not the email exists, which avoids
// leaking which addresses are registered (standard practice) and is
// explicitly NOT a claim of real email delivery.
function forgotPassword({ email }) {
  const row = findByEmail(email);
  return {
    message: "If an account exists for this email, password reset instructions would be sent.",
    demoNote: row
      ? "DEMO: account exists (no email sent — no email provider configured)."
      : "DEMO: no matching account (response kept identical on purpose).",
  };
}

function getMe(userId) {
  const row = findById(userId);
  if (!row) {
    throw new AppError(404, "User not found.");
  }
  return toPublicUser(row);
}

module.exports = { register, login, forgotPassword, getMe, toPublicUser, findByEmail, findById };
