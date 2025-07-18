import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "USER",
    },
    freeInterview: {
      type: String,
      default: "not_claimed",
    },
    subscription: {
      type: String,
      default: "none",
    },
    stats: {
      totalInterviews: { type: Number, default: 0 },
      averageScore: { type: String, default: "0%" },
      level: {type: Number,default: 1},
      levelProgress: {type: Number,default: 0},
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    interviewLeft: {
      type: Number,
      default: 0,
    },
    interviewLeftExpire: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
export default User;