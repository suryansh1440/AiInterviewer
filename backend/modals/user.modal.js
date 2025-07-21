import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
      select:false,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google','github'],
      default: 'local',
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
      default: "USER",
    },
    freeInterview: {
      type: String,
      enum: {
        values: ["claimed", "not_claimed"],
        message: "Free interview is either claimed or not claimed",
      },
      default: "not_claimed",
    },
    subscription: {
      type: String,
      enum: {
        values: ["none","starter", "pro"],
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
