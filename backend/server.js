const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./src/config/db");

const app = express();

// Database Call
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Main Routes Placeholder
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/profile", require("./src/routes/profileRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
