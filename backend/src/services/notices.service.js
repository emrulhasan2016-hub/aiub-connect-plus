const db = require("../database/db");
function mapNoticeRow(row) {
  return {
 id: row.id,
 userId: row.user_id,
 title: row.title,
 category: row.category,
 content: row.content,
attachments: JSON.parse(row.attachments || "[]"),
createdAt: row.created_at,
author: {
id: row.author_id,
fullName: row.author_full_name,
role: row.author_role,
},
};
}
function listNotices() {
  const rows = db
 .prepare(
  `
SELECT
n.*,    u.id        AS author_id,
u.full_name AS author_full_name,
u.role      AS author_role
FROM notices n
JOIN users u ON u.id = n.user_id
  ORDER BY n.created_at DESC, n.id DESC
   `
 )
 .all();

  return rows.map(mapNoticeRow);
}
module.exports = { listNotices };