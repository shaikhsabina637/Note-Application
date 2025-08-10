import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rating: {
    type: Number,
    required: [true, "Please provide a rating"],
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot exceed 5"]
  },
  review: {
    type: String,
    required: [true, "Please provide a review"],
    trim: true,
    minLength: [10, "Review must be at least 10 characters"],
    maxLength: [1000, "Review cannot exceed 1000 characters"]
  }
}, { timestamps: true });

export default mongoose.model("Feedback", feedbackSchema);
