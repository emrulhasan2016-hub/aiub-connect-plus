// data/notifications.js
// type: "Like" | "Comment" | "Reply" | "Group" | "Notice" | "Job"
const notifications = [
  { id: "nt1", recipientId: "u1", type: "Like", text: "Nusrat Jahan liked your post.", relatedId: "p1", read: false, createdAt: "2026-07-10T10:01:00Z" },
  { id: "nt2", recipientId: "u1", type: "Comment", text: "Dr. Sazid Uddin commented on your post.", relatedId: "p1", read: false, createdAt: "2026-07-10T11:00:00Z" },
  { id: "nt3", recipientId: "u1", type: "Reply", text: "Tanvir Ahmed replied to your comment.", relatedId: "p3", read: true, createdAt: "2026-07-08T12:20:00Z" },
  { id: "nt4", recipientId: "u1", type: "Notice", text: "New notice posted: Mid-term Quiz 2 Schedule Released.", relatedId: "n1", read: false, createdAt: "2026-07-10T08:00:00Z" },
  { id: "nt5", recipientId: "u1", type: "Job", text: "New job circular: Junior React Native Developer at Finzo Technologies.", relatedId: "j1", read: true, createdAt: "2026-07-06T09:00:00Z" },
  { id: "nt6", recipientId: "u1", type: "Group", text: "You were added to Programming Club.", relatedId: "g4", read: true, createdAt: "2026-07-01T09:00:00Z" },
];

export default notifications;
