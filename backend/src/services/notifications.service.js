const db = require("../database/db");
const AppError = require("../utils/AppError");

function mapNotificationRow(row) {
  return {
    id: row.id,
    recipientId: row.recipient_id,
    type: row.type,
    text: row.text,
    relatedId: row.related_id,
    read: !!row.is_read,
    createdAt: row.created_at,
  };
}

function listNotifications(userId) {
  const rows = db
    .prepare(
      `SELECT * FROM notifications WHERE recipient_id = ? ORDER BY created_at DESC, id DESC`,
    )
    .all(userId);
  return rows.map(mapNotificationRow);
}

function markOneRead(userId, notificationId) {
  const row = db
    .prepare(`SELECT * FROM notifications WHERE id = ?`)
    .get(notificationId);
  if (!row) throw new AppError(404, "Notification not found.");
  if (row.recipient_id !== userId) {
    throw new AppError(403, "You cannot modify another user's notification.");
  }
  db.prepare(`UPDATE notifications SET is_read = 1 WHERE id = ?`).run(
    notificationId,
  );
  return listNotifications(userId);
}

function markAllRead(userId) {
  db.prepare(`UPDATE notifications SET is_read = 1 WHERE recipient_id = ?`).run(
    userId,
  );
  return listNotifications(userId);
}

module.exports = { listNotifications, markOneRead, markAllRead };
