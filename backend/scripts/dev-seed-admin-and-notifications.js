require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("../src/database/db");
const { signToken } = require("../src/utils/jwt");

function upsertUser({ email, fullName, username, role, department, status }) {
  let user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);
  if (!user) {
    const passwordHash = bcrypt.hashSync("DevTest123", 10);
    const info = db
      .prepare(
        `INSERT INTO users (full_name, username, email, password_hash, role, department, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        fullName,
        username,
        email,
        passwordHash,
        role,
        department,
        status || "active",
      );
    user = db
      .prepare(`SELECT * FROM users WHERE id = ?`)
      .get(info.lastInsertRowid);
    console.log(
      `Created user: ${user.id} ${user.email} (${user.role}, ${user.status})`,
    );
  } else {
    console.log(
      `Reusing user: ${user.id} ${user.email} (${user.role}, ${user.status})`,
    );
  }
  return user;
}

function ensureNotification({ recipientId, type, text, relatedId }) {
  const existing = db
    .prepare(`SELECT 1 FROM notifications WHERE recipient_id = ? AND text = ?`)
    .get(recipientId, text);
  if (!existing) {
    db.prepare(
      `INSERT INTO notifications (recipient_id, type, text, related_id) VALUES (?, ?, ?, ?)`,
    ).run(recipientId, type, text, relatedId ?? null);
  }
}

function run() {
  const admin = upsertUser({
    email: "dev.admin@aiub.edu",
    fullName: "Dev Admin",
    username: "dev_admin",
    role: "Admin",
    department: "IT Administration",
  });

  const banned = upsertUser({
    email: "dev.banned@aiub.edu",
    fullName: "Dev Banned Student",
    username: "dev_banned",
    role: "Student",
    department: "EEE",
    status: "banned",
  });

  const student = upsertUser({
    email: "dev.tester@aiub.edu",
    fullName: "Dev Tester",
    username: "dev_tester",
    role: "Student",
    department: "CSE",
  });

  ensureNotification({
    recipientId: student.id,
    type: "Notice",
    text: "New notice posted: Sample Notice.",
    relatedId: null,
  });
  ensureNotification({
    recipientId: student.id,
    type: "Job",
    text: "New job circular: Sample Job.",
    relatedId: null,
  });
  ensureNotification({
    recipientId: student.id,
    type: "Like",
    text: "Someone liked your post.",
    relatedId: null,
  });
  ensureNotification({
    recipientId: student.id,
    type: "Group",
    text: "You were added to a group.",
    relatedId: null,
  });

  console.log("\nUse these as Authorization header values:\n");
  console.log(`Admin (${admin.email}):\nBearer ${signToken(admin)}\n`);
  console.log(
    `Student/dev.tester (${student.email}):\nBearer ${signToken(student)}\n`,
  );
  console.log(`Banned Student id (for unban test): ${banned.id}\n`);
}

run();
