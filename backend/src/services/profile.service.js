const db = require("../database/db");
const AppError = require("../utils/AppError");

function mapUserRow(row) {
  const followers = db
    .prepare(`SELECT follower_id FROM follows WHERE followee_id = ?`)
    .all(row.id)
    .map((r) => r.follower_id);
  const following = db
    .prepare(`SELECT followee_id FROM follows WHERE follower_id = ?`)
    .all(row.id)
    .map((r) => r.followee_id);

  return {
    id: row.id,
    fullName: row.full_name,
    username: row.username,
    email: row.email,
    role: row.role,
    department: row.department,
    studentId: row.student_id,
    bio: row.bio,
    avatar: row.avatar_url,
    cover: row.cover_url,
    followers,
    following,
    status: row.status,
    isSuperAdmin: !!row.is_super_admin,
    createdAt: row.created_at,
  };
}

function getProfile(userId) {
  const row = db.prepare(`SELECT * FROM users WHERE id = ?`).get(userId);
  if (!row) throw new AppError(404, "User not found.");
  return mapUserRow(row);
}

function updateProfile(userId, { fullName, department, bio }) {
  db.prepare(
    `UPDATE users SET full_name = ?, department = ?, bio = ? WHERE id = ?`,
  ).run(fullName, department, bio, userId);
  return getProfile(userId);
}

module.exports = { getProfile, updateProfile };
