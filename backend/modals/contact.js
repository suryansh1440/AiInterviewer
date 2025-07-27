import mongoose from "mongoose";
import validator from "validator";

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    validate: [validator.isAlpha, "Please provide a valid name"],
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate: [validator.isEmail, "Please provide valid email"],
    lowercase: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const Contacts = mongoose.model("Contacts", contactSchema);

export default Contacts;
