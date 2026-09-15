// data/jobs.js
// type: "Job" | "Internship" | "Freelancing" | "Scholarship"
const jobs = [
  {
    id: "j1", userId: "u4", type: "Job", company: "Finzo Technologies", position: "Junior React Native Developer",
    description: "Looking for a junior mobile developer with basic React Native and Expo experience. Fresh graduates welcome.",
    requirements: ["React Native basics", "Git", "Good communication"],
    deadline: "2026-08-01", applyLink: "https://example.com/apply/finzo-rn",
  },
  {
    id: "j2", userId: "u4", type: "Internship", company: "CodeNest Ltd.", position: "Frontend Intern",
    description: "3-month paid internship for undergraduate CSE students, working on real client projects.",
    requirements: ["JavaScript", "React basics"],
    deadline: "2026-07-25", applyLink: "https://example.com/apply/codenest-intern",
  },
  {
    id: "j3", userId: "u3", type: "Scholarship", company: "AIUB Merit Scholarship Fund", position: "Merit-based Tuition Scholarship",
    description: "Available for students with CGPA 3.75+ with no incomplete courses.",
    requirements: ["CGPA 3.75+", "Full-time enrollment"],
    deadline: "2026-09-01", applyLink: "https://example.com/apply/aiub-merit",
  },
  {
    id: "j4", userId: "u4", type: "Freelancing", company: "Self-employed / Remote", position: "Mobile UI Designer (Part-time)",
    description: "Small remote gigs designing mobile UI mockups for early-stage startups.",
    requirements: ["Figma", "Portfolio"],
    deadline: "2026-07-31", applyLink: "https://example.com/apply/freelance-ui",
  },
];

export default jobs;
