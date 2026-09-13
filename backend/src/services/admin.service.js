const db = require("../database/db");
const AppError = require("../utils/AppError");

function getDashboardStats() {
  const totalUsers = db.prepare(`SELECT COUNT(*) AS c FROM users`).get().c;
  const bannedUsers = db
    .prepare(`SELECT COUNT(*) AS c FROM users WHERE status = 'banned'`)
    .get().c;
  const totalGroups = db.prepare(`SELECT COUNT(*) AS c FROM groups`).get().c;
  const totalPosts = db.prepare(`SELECT COUNT(*) AS c FROM posts`).get().c;
  const totalNotices = db.prepare(`SELECT COUNT(*) AS c FROM notices`).get().c;
  const totalJobs = db.prepare(`SELECT COUNT(*) AS c FROM jobs`).get().c;
  return {
    totalUsers,
    bannedUsers,
    totalGroups,
    totalPosts,
    totalNotices,
    totalJobs,
  };
}

function mapUserRow(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    username: row.username,
    email: row.email,
    role: row.role,
    department: row.department,
    status: row.status,
    createdAt: row.created_at,
  };
}

function listUsers() {
  const rows = db
    .prepare(`SELECT * FROM users ORDER BY created_at DESC, id DESC`)
    .all();
  return rows.map(mapUserRow);
}

function getUserRowOrThrow(userId) {
  const row = db.prepare(`SELECT * FROM users WHERE id = ?`).get(userId);
  if (!row) throw new AppError(404, "User not found.");
  return row;
}

function updateUser(targetUserId, actingAdminId, { role, status }) {
  getUserRowOrThrow(targetUserId);

  if (targetUserId === actingAdminId) {
    throw new AppError(
      400,
      "Admins cannot change their own role or status from this screen.",
    );
  }

  db.prepare(
    `UPDATE users SET role = COALESCE(?, role), status = COALESCE(?, status) WHERE id = ?`,
  ).run(role ?? null, status ?? null, targetUserId);
  return mapUserRow(getUserRowOrThrow(targetUserId));
}

module.exports = { getDashboardStats, listUsers, updateUser };
