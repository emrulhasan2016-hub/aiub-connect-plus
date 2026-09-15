// scripts/dev-seed-and-token.js
// TEMPORARY DEV/QA SCRIPT — delete once real login (Member 1) exists.
// Run with: node scripts/dev-seed-and-token.js

require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("../src/database/db");
const { signToken } = require("../src/utils/jwt");

function run() {
  const email = "dev.tester@aiub.edu";
  let user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);

  if (!user) {
    const passwordHash = bcrypt.hashSync("DevTest123", 10);
    const info = db
      .prepare(
        `INSERT INTO users (full_name, username, email, password_hash, role, department, student_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run("Dev Tester", "dev_tester", email, passwordHash, "Student", "CSE", "00-00000-0");
    user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(info.lastInsertRowid);
    console.log("Created temporary dev user:", user.id, user.email);
  } else {
    console.log("Reusing existing temporary dev user:", user.id, user.email);
  }

  const token = signToken(user);
  console.log("\nUse this as your Authorization header value:\n");
  console.log(`Bearer ${token}\n`);
}

run();