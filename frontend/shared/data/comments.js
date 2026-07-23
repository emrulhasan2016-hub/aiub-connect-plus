// data/comments.js
// Each comment belongs to a postId. Replies are nested inside `replies`.
const comments = [
  {
    id: "c1", postId: "p1", userId: "u2", text: "Count me in! What time?",
    createdAt: "2026-07-10T10:00:00Z",
    replies: [
      { id: "c1r1", userId: "u1", text: "6 PM works for me, right after class.", createdAt: "2026-07-10T10:05:00Z" },
    ],
  },
  {
    id: "c2", postId: "p1", userId: "u3",
    text: "Nice initiative --- I'll drop some extra practice questions in the group.",
    createdAt: "2026-07-10T11:00:00Z", replies: [],
  },
  {
    id: "c3", postId: "p2", userId: "u1", text: "This clears up so much confusion, thank you sir!",
    createdAt: "2026-07-09T14:30:00Z", replies: [],
  },
  {
    id: "c4", postId: "p3", userId: "u1", text: "Applied! Fingers crossed 🤞",
    createdAt: "2026-07-08T12:00:00Z",
    replies: [
      { id: "c4r1", userId: "u4", text: "Good luck, I'll refer you internally too.", createdAt: "2026-07-08T12:20:00Z" },
    ],
  },
];

export default comments;
