// data/groups.js
import { covers } from "../constants/dummyImages";

const groups = [
  {
    id: "g1", name: "AIUB CSE", description: "Official group for Computer Science & Engineering students and faculty.",
    category: "Department", cover: covers[0], memberIds: ["u1", "u2", "u3", "u6"],
    messages: [
      { id: "m1", userId: "u3", text: "Welcome everyone to the CSE group!", createdAt: "2026-07-01T09:00:00Z" },
      { id: "m2", userId: "u1", text: "Excited to be here 🎉", createdAt: "2026-07-01T09:05:00Z" },
    ],
  },
  {
    id: "g2", name: "AIUB Business Club", description: "Connecting future business leaders of AIUB through events and workshops.",
    category: "Club", cover: covers[1], memberIds: ["u2", "u4"],
    messages: [
      { id: "m3", userId: "u2", text: "Career fair planning meeting tomorrow at 5 PM.", createdAt: "2026-07-06T12:00:00Z" },
    ],
  },
  {
    id: "g3", name: "Thesis Group - Mobile Computing", description: "Collaboration space for thesis students working on mobile computing topics.",
    category: "Academic", cover: covers[2], memberIds: ["u1"], messages: [],
  },
  {
    id: "g4", name: "Programming Club", description: "Weekly problem solving sessions, contests, and coding discussions.",
    category: "Club", cover: covers[0], memberIds: ["u1", "u6"],
    messages: [
      { id: "m4", userId: "u6", text: "Anyone solved today's Codeforces problem?", createdAt: "2026-07-09T20:00:00Z" },
    ],
  },
];

export default groups;
