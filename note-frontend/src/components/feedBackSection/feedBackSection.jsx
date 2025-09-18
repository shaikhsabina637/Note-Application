"use client"
  import axios from "axios"
import { useState } from "react"
import { Star, Send, MessageCircle, ThumbsUp } from "lucide-react"
import Spinner from "@/components/common/spinner"
import { useSelector } from "react-redux"
export default function FeedbackSection() {
  const token =  useSelector((state)=>state.auth.token)
  const [feedback, setFeedback] = useState({
    rating: 0,
    message: "",
    email: "",
    category: "General Feedback",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const categories = [
    { value: "General Feedback", label: "General Feedback" },
    { value: "Feature Request", label: "Feature Request" },
    { value: "Bug Report", label: "Bug Report" },
    { value: "Improvement Suggestion", label: "Improvement Suggestion" },
  ]

  const handleRatingClick = (rating) => {
    setFeedback((prev) => ({ ...prev, rating }))
  }



const handleSubmit = async (e) => {
  e.preventDefault()
  if (!feedback.message.trim() || feedback.rating === 0) return

  setIsSubmitting(true)

  try {
    // API call using axios
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/userfeedback`, // apna backend URL
      {
        rating: feedback.rating,
        review: feedback.message,
        categoryFeedback: feedback.category, // backend schema field
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // agar token use kar rahi ho
        },
      }
    )

    console.log("Feedback submitted:", data)

    setSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false)
      setFeedback({ rating: 0, message: "", email: "", category: "General Feedback" })
    }, 3000)
  } catch (error) {
    console.error("Error submitting feedback:", error.response?.data || error.message)
    alert(error.response?.data?.message || "Failed to submit feedback. Please try again.")
  } finally {
    setIsSubmitting(false)
  }
}



  if (submitted) {
    return (
      <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <ThumbsUp className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
            <p className="text-gray-600">
              Your feedback has been submitted successfully. We appreciate your input and will use it to improve
              ThoughtVault.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-r from-purple-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 rounded-full p-3">
              <MessageCircle className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">We Value Your Feedback</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help us improve ThoughtVault by sharing your thoughts, suggestions, or reporting any issues you've
            encountered.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How would you rate your experience with ThoughtVault?
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    disabled={isSubmitting}
                    className={`p-1 transition-colors duration-200 ${
                      star <= feedback.rating
                        ? "text-yellow-400 hover:text-yellow-500"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                  >
                    <Star className="h-8 w-8 fill-current" />
                  </button>
                ))}
              </div>
              {feedback.rating > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {feedback.rating === 1 && "We're sorry to hear that. Please let us know how we can improve."}
                  {feedback.rating === 2 && "We appreciate your feedback. How can we make it better?"}
                  {feedback.rating === 3 && "Thank you for the feedback. What would make it great?"}
                  {feedback.rating === 4 && "Great! What can we do to make it perfect?"}
                  {feedback.rating === 5 && "Awesome! We're thrilled you love ThoughtVault!"}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Category</label>
              <select
                value={feedback.category}
                onChange={(e) => setFeedback((prev) => ({ ...prev, category: e.target.value }))}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Feedback <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                placeholder="Share your thoughts, suggestions, or report any issues..."
                value={feedback.message}
                onChange={(e) => setFeedback((prev) => ({ ...prev, message: e.target.value }))}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-y"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email (optional)</label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={feedback.email}
                onChange={(e) => setFeedback((prev) => ({ ...prev, email: e.target.value }))}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                Provide your email if you'd like us to follow up on your feedback
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting || !feedback.message.trim() || feedback.rating === 0}
                className={`px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
                  isSubmitting ? "opacity-75" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Spinner />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Your feedback helps us build a better note-taking experience for everyone. Thank you for taking the time to
            share your thoughts!
          </p>
        </div>
      </div>
    </section>
  )
}
