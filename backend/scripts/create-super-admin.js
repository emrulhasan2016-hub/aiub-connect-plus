// Run: node scripts/create-super-admin.js "Owner Name" owner@aiub.edu SomeStrongPassword123

require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("../src/database/db");

const [, , fullName, email, password] = process.argv;

if (!fullName || !email || !password) {
  console.log(
    'Usage: node scripts/create-super-admin.js "Full Name" email@example.com password',
  );
  process.exit(1);
}

const existingSuperAdmin = db
  .prepare(`SELECT id, email FROM users WHERE is_super_admin = 1`)
  .get();
if (existingSuperAdmin) {
  console.log(
    `❌ A Super Admin already exists: ${existingSuperAdmin.email} (id: ${existingSuperAdmin.id})`,
  );
  console.log("Only one Super Admin is allowed. Aborting.");
  process.exit(1);
}

const existingUser = db
  .prepare(`SELECT id FROM users WHERE email = ?`)
  .get(email);
if (existingUser) {
  db.prepare(
    `UPDATE users SET role = 'Admin', is_super_admin = 1 WHERE id = ?`,
  ).run(existingUser.id);
  console.log(`✔ Existing user (${email}) promoted to Super Admin.`);
} else {
  const username = email.split("@")[0];
  const passwordHash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare(
      `INSERT INTO users (full_name, username, email, password_hash, role, department, is_super_admin)
       VALUES (?, ?, ?, ?, 'Admin', 'Administration', 1)`,
    )
    .run(fullName, username, email, passwordHash);
  console.log(
    `✔ Super Admin created: id=${info.lastInsertRowid}, email=${email}`,
  );
}
