require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { notFound, errorHandler } = require("./src/middleware/errorHandler");

require("./src/database/db");

const authRoutes = require("./src/routes/auth.routes");
const postsRoutes = require("./src/routes/posts.routes");
const groupsRoutes = require("./src/routes/groups.routes");
const noticesRoutes = require("./src/routes/notices.routes");
const jobsRoutes = require("./src/routes/jobs.routes");
const profileRoutes = require("./src/routes/profile.routes");
const notificationsRoutes = require("./src/routes/notifications.routes");
const adminRoutes = require("./src/routes/admin.routes");
const usersRoutes = require("./src/routes/users.routes");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
app.use(cors({ origin: allowedOrigins.length > 0 ? allowedOrigins : true }));
app.use(express.json());
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid JSON in request body." });
  }
  next(err);
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "AIUB Connect+ backend is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/notices", noticesRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", usersRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`AIUB Connect+ backend listening on http://localhost:${PORT}`);
});
