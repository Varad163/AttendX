import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "student" }, // student, teacher
  classId: { type: String, default: null }
});

export const User = models.User || mongoose.model("User", userSchema);
