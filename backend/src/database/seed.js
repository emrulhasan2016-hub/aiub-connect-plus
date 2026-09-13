// src/database/seed.js
// OWNER: Member 1 (Zihadul) - Auth
// Run with: npm run db:seed
// Idempotent: skips any account whose email already exists.

const bcrypt = require("bcryptjs");
const db = require("../database/db");

const SALT_ROUNDS = 10;

const DEMO_USERS = [
  { fullName: "Rafiul Islam", username: "rafiul_cse", email: "rafiul.islam@aiub.edu", password: "Rafiul123", role: "Student", department: "CSE", studentId: "21-12345-1", bio: "3rd year CSE student. Into React Native & competitive programming.", status: "active" },
  { fullName: "Nusrat Jahan", username: "nusrat_j", email: "nusrat.jahan@aiub.edu", password: "Nusrat123", role: "Student", department: "BBA", studentId: "20-98765-2", bio: "Marketing enthusiast | Business Club core member", status: "active" },
  { fullName: "Dr. Sazid Uddin", username: "dr_sazid", email: "sazid.uddin@aiub.edu", password: "Sazid123", role: "Faculty", department: "Computer Science", studentId: "FAC-0012", bio: "Assistant Professor, Dept. of CSE. Teaches Mobile App Development.", status: "active" },
  { fullName: "Tanvir Ahmed", username: "tanvir_alum", email: "tanvir.ahmed@aiub.edu", password: "Tanvir123", role: "Alumni", department: "CSE", studentId: "ALM-2019-441", bio: "AIUB CSE '19. Software Engineer @ a fintech company. Happy to mentor!", status: "active" },
  { fullName: "Admin Office", username: "aiub_admin", email: "admin@aiub.edu", password: "Admin123", role: "Admin", department: "IT Administration", studentId: "ADM-0001", bio: "Official platform administration account.", status: "active" },
  { fullName: "Mehedi Hasan", username: "mehedi_h", email: "mehedi.hasan@aiub.edu", password: "Mehedi123", role: "Student", department: "EEE", studentId: "22-11223-1", bio: "Robotics club | Loves Arduino projects", status: "banned" },
];

async function seed() {
  const findByEmail = db.prepare("SELECT id FROM users WHERE email = ?");
  const insert = db.prepare(`
    INSERT INTO users (full_name, username, email, password_hash, role, department, student_id, bio, status)
    VALUES (@fullName, @username, @email, @passwordHash, @role, @department, @studentId, @bio, @status)
  `);

  let inserted = 0;
  let skipped = 0;

  for (const demo of DEMO_USERS) {
    if (findByEmail.get(demo.email)) {
      skipped += 1;
      continue;
    }
    const passwordHash = await bcrypt.hash(demo.password, SALT_ROUNDS);
    insert.run({ ...demo, passwordHash });
    inserted += 1;
  }

  console.log(`✔ Seed complete. Inserted: ${inserted}, skipped (already existed): ${skipped}`);
}

seed();
