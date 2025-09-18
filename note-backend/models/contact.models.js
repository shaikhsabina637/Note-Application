import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please enter your name"],
    trim: true,
    minLength: [2, "Name must be at least 2 characters"],
    maxLength: [50, "Name cannot exceed 50 characters"]
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please enter a valid email address"
    ]
  },
  message: {
    type: String,
    required: [true, "Please enter your message"],
    trim: true,
    minLength: [10, "Message must be at least 10 characters"],
    maxLength: [1000, "Message cannot exceed 1000 characters"]
  }
}, { timestamps: true });

export default mongoose.model("Contact", contactSchema);
