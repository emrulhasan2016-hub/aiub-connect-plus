const db = require("../database/db");
const AppError = require("../utils/AppError");

function mapPublicUserRow(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    username: row.username,
    role: row.role,
    department: row.department,
    studentId: row.student_id,
    bio: row.bio,
    avatar: row.avatar_url,
    cover: row.cover_url,
    followerCount: row.follower_count || 0,
    followingCount: row.following_count || 0,
  };
}

const PUBLIC_SELECT = `
  SELECT
    u.*,
    (SELECT COUNT(*) FROM follows f WHERE f.followee_id = u.id) AS follower_count,
    (SELECT COUNT(*) FROM follows f WHERE f.follower_id = u.id) AS following_count
  FROM users u
`;

function searchUsers(query, currentUserId) {
  const q = String(query || "").trim();
  const like = `%${q}%`;

  const rows = db
    .prepare(
      `
      ${PUBLIC_SELECT}
      WHERE u.status = 'active'
        AND u.id != ?
        AND (? = '' OR u.full_name LIKE ? OR u.username LIKE ? OR u.department LIKE ?)
      ORDER BY u.full_name ASC
      LIMIT 50
      `,
    )
    .all(currentUserId, q, like, like, like);

  return rows.map(mapPublicUserRow);
}

function getPublicProfile(userId) {
  const row = db.prepare(`${PUBLIC_SELECT} WHERE u.id = ?`).get(userId);
  if (!row) throw new AppError(404, "User not found.");
  return mapPublicUserRow(row);
}

function toggleFollow(targetId, currentUserId) {
  if (targetId === currentUserId) {
    throw new AppError(400, "You cannot follow yourself.");
  }

  const target = db.prepare(`SELECT id FROM users WHERE id = ?`).get(targetId);
  if (!target) throw new AppError(404, "User not found.");

  const existing = db
    .prepare(`SELECT 1 FROM follows WHERE follower_id = ? AND followee_id = ?`)
    .get(currentUserId, targetId);

  if (existing) {
    db.prepare(
      `DELETE FROM follows WHERE follower_id = ? AND followee_id = ?`,
    ).run(currentUserId, targetId);
  } else {
    db.prepare(
      `INSERT INTO follows (follower_id, followee_id) VALUES (?, ?)`,
    ).run(currentUserId, targetId);
  }

  return {
    user: getPublicProfile(targetId),
    isFollowing: !existing,
  };
}

module.exports = { searchUsers, getPublicProfile, toggleFollow };
