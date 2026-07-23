// data/posts.js
// category is one of: General Discussion, Academic Discussion, Notice, Job Circular,
// Internship, Scholarship, Event, Study Material, Lost & Found, Achievement
import { postImages } from "../constants/dummyImages";

const posts = [
  {
    id: "p1", userId: "u1", category: "General Discussion",
    content: "Anyone up for a study group before the Mobile App Dev quiz next week? Meeting at the CSE lab.",
    image: null, likedBy: ["u2", "u3"], visibility: "Public", createdAt: "2026-07-10T09:30:00Z",
  },
  {
    id: "p2", userId: "u3", category: "Academic Discussion",
    content: "Great question from today's class about the JS bridge vs JSI. Sharing the comparison slide for everyone who missed it.",
    image: postImages[0], likedBy: ["u1", "u2", "u4"], visibility: "Public", createdAt: "2026-07-09T14:00:00Z",
  },
  {
    id: "p3", userId: "u4", category: "Job Circular",
    content: "My company is hiring 2 junior React Native developers. Great fit for final year CSE students!",
    image: postImages[1], likedBy: ["u1"], visibility: "Public", createdAt: "2026-07-08T11:15:00Z",
  },
  {
    id: "p4", userId: "u2", category: "Event",
    content: "Business Club is organizing a career fair next month. Volunteers needed --- comment below!",
    image: postImages[2], likedBy: [], visibility: "Public", createdAt: "2026-07-07T08:00:00Z",
  },
  {
    id: "p5", userId: "u1", category: "Lost & Found",
    content: "Found a blue AIUB ID card near Building B lift. DM me to claim it.",
    image: null, likedBy: ["u2"], visibility: "Public", createdAt: "2026-07-06T17:45:00Z",
  },
];

export default posts;
