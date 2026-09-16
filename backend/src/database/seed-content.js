const db = require("../database/db");

function userIdByEmail(email) {
  const row = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  return row ? row.id : null;
}

const GROUPS = [
  {
    name: "AIUB CSE",
    description:
      "Official group for Computer Science & Engineering students and faculty.",
    category: "Department",
    createdByEmail: "sazid.uddin@aiub.edu",
    memberEmails: [
      "sazid.uddin@aiub.edu",
      "rafiul.islam@aiub.edu",
      "tanvir.ahmed@aiub.edu",
    ],
    messages: [
      {
        email: "sazid.uddin@aiub.edu",
        text: "Welcome everyone to the CSE group!",
      },
      { email: "rafiul.islam@aiub.edu", text: "Excited to be here 🎉" },
      {
        email: "tanvir.ahmed@aiub.edu",
        text: "Alumni here — ping me if anyone needs interview prep help.",
      },
    ],
  },
  {
    name: "AIUB Business Club",
    description:
      "Connecting future business leaders of AIUB through events and workshops.",
    category: "Club",
    createdByEmail: "nusrat.jahan@aiub.edu",
    memberEmails: ["nusrat.jahan@aiub.edu", "tanvir.ahmed@aiub.edu"],
    messages: [
      {
        email: "nusrat.jahan@aiub.edu",
        text: "Career fair planning meeting tomorrow at 5 PM.",
      },
    ],
  },
  {
    name: "AIUB Programming Contest",
    description:
      "Practice sessions, contest announcements and team formation for ICPC & NCPC.",
    category: "Club",
    createdByEmail: "rafiul.islam@aiub.edu",
    memberEmails: ["rafiul.islam@aiub.edu"],
    messages: [
      {
        email: "rafiul.islam@aiub.edu",
        text: "Weekly practice contest every Friday 8 PM. All welcome!",
      },
    ],
  },
];

const NOTICES = [
  {
    email: "sazid.uddin@aiub.edu",
    title: "Mid-term Exam Routine — Fall 2026",
    category: "Exam",
    content:
      "The mid-term examination for all CSE sections will begin from the second week of next month. Detailed section-wise routine is attached. Students must carry their ID cards to the exam hall.",
  },
  {
    email: "sazid.uddin@aiub.edu",
    title: "Mobile Application Development — Assignment 2",
    category: "Assignment",
    content:
      "Submit a working React Native application demonstrating navigation, state management and REST API integration. Deadline is end of this month. Late submissions will be penalised.",
  },
  {
    email: "admin@aiub.edu",
    title: "Seminar on AI & Career Opportunities",
    category: "Seminar",
    content:
      "The Department of CSE is organising a seminar on Artificial Intelligence and career pathways. Open to all departments. Registration is free but seats are limited.",
  },
  {
    email: "admin@aiub.edu",
    title: "Library Extended Hours During Exam Week",
    category: "Academic",
    content:
      "The central library will remain open until 10 PM throughout the examination period. Group study rooms can be reserved at the front desk.",
  },
];

const JOBS = [
  {
    email: "tanvir.ahmed@aiub.edu",
    type: "Job",
    company: "BracIT",
    position: "Junior Software Engineer",
    description:
      "Looking for fresh graduates with strong fundamentals in JavaScript and databases. Training will be provided on the company stack.",
    requirements: ["JavaScript", "SQL", "Problem solving", "CGPA 3.00+"],
    deadline: "2026-10-30",
    applyLink: "https://example.com/apply/bracit-jse",
  },
  {
    email: "tanvir.ahmed@aiub.edu",
    type: "Internship",
    company: "Pathao",
    position: "Mobile App Development Intern",
    description:
      "3-month paid internship working alongside the mobile team on React Native features. Possibility of full-time conversion.",
    requirements: ["React Native", "Git", "Final year student"],
    deadline: "2026-10-15",
    applyLink: "https://example.com/apply/pathao-intern",
  },
  {
    email: "admin@aiub.edu",
    type: "Scholarship",
    company: "AIUB Financial Aid Office",
    position: "Merit Scholarship — Spring 2027",
    description:
      "Tuition waiver for students maintaining a CGPA of 3.75 or above with no disciplinary record. Apply through the student portal.",
    requirements: ["CGPA 3.75+", "No backlog", "Full-time enrolment"],
    deadline: "2026-11-20",
    applyLink: "https://example.com/apply/aiub-merit",
  },
  {
    email: "tanvir.ahmed@aiub.edu",
    type: "Freelancing",
    company: "Remote / Upwork",
    position: "Frontend Developer (Contract)",
    description:
      "Short-term contract building dashboards in React. Good first freelance project for students comfortable with component libraries.",
    requirements: ["React", "CSS", "Basic REST APIs"],
    deadline: "2026-12-01",
    applyLink: "https://example.com/apply/freelance-frontend",
  },
];

function seedGroups() {
  let inserted = 0;
  for (const g of GROUPS) {
    let groupRow = db
      .prepare("SELECT id FROM groups WHERE name = ?")
      .get(g.name);

    if (!groupRow) {
      const createdBy = userIdByEmail(g.createdByEmail);
      const info = db
        .prepare(
          `INSERT INTO groups (name, description, category, created_by) VALUES (?, ?, ?, ?)`,
        )
        .run(g.name, g.description, g.category, createdBy);
      groupRow = { id: info.lastInsertRowid };
      inserted += 1;
    }

    const addMember = db.prepare(
      `INSERT OR IGNORE INTO group_members (group_id, user_id) VALUES (?, ?)`,
    );
    for (const email of g.memberEmails) {
      const uid = userIdByEmail(email);
      if (uid) addMember.run(groupRow.id, uid);
    }

    const existingMsgs = db
      .prepare("SELECT COUNT(*) AS c FROM group_messages WHERE group_id = ?")
      .get(groupRow.id).c;

    if (existingMsgs === 0) {
      const addMsg = db.prepare(
        `INSERT INTO group_messages (group_id, user_id, text) VALUES (?, ?, ?)`,
      );
      for (const m of g.messages) {
        const uid = userIdByEmail(m.email);
        if (uid) addMsg.run(groupRow.id, uid, m.text);
      }
    }
  }
  return inserted;
}

function seedNotices() {
  let inserted = 0;
  const exists = db.prepare("SELECT id FROM notices WHERE title = ?");
  const insert = db.prepare(
    `INSERT INTO notices (user_id, title, category, content, attachments) VALUES (?, ?, ?, ?, '[]')`,
  );
  for (const n of NOTICES) {
    if (exists.get(n.title)) continue;
    const uid = userIdByEmail(n.email);
    if (!uid) continue;
    insert.run(uid, n.title, n.category, n.content);
    inserted += 1;
  }
  return inserted;
}

function seedJobs() {
  let inserted = 0;
  const exists = db.prepare(
    "SELECT id FROM jobs WHERE company = ? AND position = ?",
  );
  const insert = db.prepare(
    `INSERT INTO jobs (user_id, type, company, position, description, requirements, deadline, apply_link)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  for (const j of JOBS) {
    if (exists.get(j.company, j.position)) continue;
    const uid = userIdByEmail(j.email);
    if (!uid) continue;
    insert.run(
      uid,
      j.type,
      j.company,
      j.position,
      j.description,
      JSON.stringify(j.requirements),
      j.deadline,
      j.applyLink,
    );
    inserted += 1;
  }
  return inserted;
}

function seedFollows() {
  const pairs = [
    ["rafiul.islam@aiub.edu", "sazid.uddin@aiub.edu"],
    ["rafiul.islam@aiub.edu", "tanvir.ahmed@aiub.edu"],
    ["nusrat.jahan@aiub.edu", "tanvir.ahmed@aiub.edu"],
    ["tanvir.ahmed@aiub.edu", "sazid.uddin@aiub.edu"],
  ];
  const insert = db.prepare(
    `INSERT OR IGNORE INTO follows (follower_id, followee_id) VALUES (?, ?)`,
  );
  let inserted = 0;
  for (const [a, b] of pairs) {
    const fa = userIdByEmail(a);
    const fb = userIdByEmail(b);
    if (fa && fb) {
      const res = insert.run(fa, fb);
      inserted += res.changes;
    }
  }
  return inserted;
}

function run() {
  const userCount = db.prepare("SELECT COUNT(*) AS c FROM users").get().c;
  if (userCount === 0) {
    console.error("✖ No users found. Run `npm run db:seed` first.");
    process.exit(1);
  }

  const g = seedGroups();
  const n = seedNotices();
  const j = seedJobs();
  const f = seedFollows();

  console.log(
    `✔ Content seed complete. Groups: +${g}, Notices: +${n}, Jobs: +${j}, Follows: +${f}`,
  );
}

run();
