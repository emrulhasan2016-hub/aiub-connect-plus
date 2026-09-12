const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Student", "Faculty", "Alumni", "Admin"],
      default: "Student",
    },
    department: { type: String, required: true },
    bio: { type: String, default: "" },
    status: { type: String, enum: ["active", "banned"], default: "active" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
