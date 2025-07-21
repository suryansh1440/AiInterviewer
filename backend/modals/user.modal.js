import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    profilePic: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    resume: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: {
        values: ["USER", "ADMIN"],
        message: "Please provide valid user role",
      },
      default: "USER",
    },
    freeInterview: {
      type: String,
      enum: {
        values: ["Claimed", "Not Claimed"],
        message: "Free interview is either claimed or not claimed",
      },
      default: "Not Claimed",
    },
    subscription: {
      type: String,
      enum: {
        values: ["Free", "Starter", "Pro"],
        message: "Please provide valid subscription type",
      },
      default: "none",
    },
    stats: {
      totalInterviews: { type: Number, default: 0 },
      averageScore: { type: String, default: "0%" },
      level: { type: Number, default: 1 },
      levelProgress: { type: Number, default: 0 },
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    interviewStartDates: {
      type: [Date],
      default: [],
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
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const User = mongoose.model("User", userSchema);
export default User;
