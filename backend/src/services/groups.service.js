const db = require("../database/db");
const AppError = require("../utils/AppError");
function getGroupRowOrThrow(groupId) {
  const row = db.prepare(`SELECT * FROM groups WHERE id = ?`).get(groupId);
  if (!row) {
    throw new AppError(404, "Group not found.");
  }
  return row;
}
function isMember(groupId, userId) {
  return !!db
    .prepare(`SELECT 1 FROM group_members WHERE group_id = ? AND user_id = ?`)
    .get(groupId, userId);
}

function getMembers(groupId) {
  const rows = db
    .prepare(
      `
      SELECT
        u.id          AS m_id,
        u.full_name   AS m_full_name,
        u.username    AS m_username,
        u.role        AS m_role,
        u.department  AS m_department,
        u.avatar_url  AS m_avatar
      FROM group_members gm
      JOIN users u ON u.id = gm.user_id
      WHERE gm.group_id = ?
      ORDER BY gm.joined_at ASC
      `
    )
    .all(groupId);

  return rows.map((row) => ({
    id: row.m_id,
    fullName: row.m_full_name,
    username: row.m_username,
    role: row.m_role,
    department: row.m_department,
    avatar: row.m_avatar,
  }));
}
function mapGroupRow(row) {
  const members = getMembers(row.id);
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    cover: row.cover_url,
    createdBy: row.created_by,
    createdAt: row.created_at,
    memberIds: members.map((m) => m.id),
    memberCount: members.length,
    members,
  };
}
function listGroups() {
  const rows = db
    .prepare(`SELECT * FROM groups ORDER BY created_at DESC, id DESC`)
    .all();
  return rows.map(mapGroupRow);
}

function toggleMembership(groupId, userId) {
  getGroupRowOrThrow(groupId); // 404s if the group itself doesn't exist

  if (isMember(groupId, userId)) {
    db.prepare(`DELETE FROM group_members WHERE group_id = ? AND user_id = ?`).run(
      groupId,
      userId
    );
  } else {
    db.prepare(`INSERT INTO group_members (group_id, user_id) VALUES (?, ?)`).run(
      groupId,
      userId
    );
  }

  const freshRow = getGroupRowOrThrow(groupId);
  return mapGroupRow(freshRow);
}

function mapMessageRow(row) {
  return {
    id: row.id,
    groupId: row.group_id,
    userId: row.user_id,
    text: row.text,
    createdAt: row.created_at,
    sender: {
      id: row.s_id,
      fullName: row.s_full_name,
      username: row.s_username,
      role: row.s_role,
      avatar: row.s_avatar,
    },
  };
}

const MESSAGE_SELECT = `
  SELECT
    gm.*,
    u.id          AS s_id,
    u.full_name   AS s_full_name,
    u.username    AS s_username,
    u.role        AS s_role,
    u.avatar_url  AS s_avatar
  FROM group_messages gm
  JOIN users u ON u.id = gm.user_id
`;

function listMessages(groupId) {
  getGroupRowOrThrow(groupId);

  const rows = db
    .prepare(`${MESSAGE_SELECT} WHERE gm.group_id = ? ORDER BY gm.created_at ASC, gm.id ASC`)
    .all(groupId);

  return rows.map(mapMessageRow);
}

function addMessage(groupId, userId, text) {
  getGroupRowOrThrow(groupId);

  if (!isMember(groupId, userId)) {
    throw new AppError(403, "You must join this group before sending a message.");
  }

  const info = db
    .prepare(`INSERT INTO group_messages (group_id, user_id, text) VALUES (?, ?, ?)`)
    .run(groupId, userId, text);

  const row = db.prepare(`${MESSAGE_SELECT} WHERE gm.id = ?`).get(info.lastInsertRowid);
  return mapMessageRow(row);
}

module.exports = {
  listGroups,
  toggleMembership,
  listMessages,
  addMessage,
};