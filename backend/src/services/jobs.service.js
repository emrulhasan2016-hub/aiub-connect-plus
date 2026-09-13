const db = require("../database/db");
function mapJobRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    company: row.company,
    position: row.position,
    description: row.description,
    requirements: JSON.parse(row.requirements || "[]"),
    deadline: row.deadline,
    applyLink: row.apply_link,
    createdAt: row.created_at,
  };
}
function listJobs() {
  const rows = db.prepare(`SELECT * FROM jobs ORDER BY created_at DESC, id DESC`).all();
  return rows.map(mapJobRow);
}
module.exports = { listJobs };