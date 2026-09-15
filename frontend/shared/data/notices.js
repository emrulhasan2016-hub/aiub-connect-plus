// data/notices.js
// category: Academic, Exam, Assignment, Seminar, Workshop
const notices = [
  {
    id: "n1", userId: "u3", title: "Mid-term Quiz 2 Schedule Released", category: "Exam",
    content: "Quiz 2 for Mobile Application Development will be held on 20 July 2026, covering Weeks 1-4. Bring your student ID.",
    attachments: ["quiz2_syllabus.pdf"], createdAt: "2026-07-10T08:00:00Z",
  },
  {
    id: "n2", userId: "u3", title: "Assignment 1 Submission Extended", category: "Assignment",
    content: "Due to popular request, Assignment 1 (React Navigation) deadline is extended to 15 July 2026, 11:59 PM.",
    attachments: [], createdAt: "2026-07-08T10:00:00Z",
  },
  {
    id: "n3", userId: "u5", title: "Workshop: Intro to Expo EAS Build", category: "Workshop",
    content: "A hands-on workshop on generating APKs with EAS Build will be held in Lab 4, Building A, this Friday.",
    attachments: ["workshop_flyer.png"], createdAt: "2026-07-05T09:00:00Z",
  },
  {
    id: "n4", userId: "u3", title: "Guest Seminar: Careers in Mobile Development", category: "Seminar",
    content: "Join us for a seminar with industry alumni discussing career paths in mobile app development.",
    attachments: [], createdAt: "2026-07-02T09:00:00Z",
  },
];

export default notices;
