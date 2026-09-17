require("dotenv").config();
const db = require("../src/database/db");

const columns = db.prepare("PRAGMA table_info(users)").all();
const hasColumn = columns.some((col) => col.name === "is_super_admin");

if (hasColumn) {
  console.log("✔ is_super_admin column already exists — nothing to do.");
} else {
  db.exec(
    "ALTER TABLE users ADD COLUMN is_super_admin INTEGER NOT NULL DEFAULT 0 CHECK (is_super_admin IN (0,1))",
  );
  console.log(
    "✔ is_super_admin column added. All existing users default to 0 (not super admin).",
  );
}
