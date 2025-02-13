import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  avatar: { type: String },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  blocked: { type: Boolean, default: false },
  api_key: { type: String, },
});

export const User = mongoose.model("User", userSchema);
