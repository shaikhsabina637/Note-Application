import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please enter a valid email address"
    ]
  },
  otpCode: {
    type: String,
    required: [true, "OTP code is required"],
    trim: true,
    length: 6  
  },
  expiresAt: {
    type: Date,
    required: [true, "Expiry time is required"]
  }
}, { timestamps: true });

export default mongoose.model("Otp", otpSchema);
