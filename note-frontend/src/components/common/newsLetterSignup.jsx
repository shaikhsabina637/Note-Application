"use client"

import { useState } from "react"
import { Mail, CheckCircle } from "lucide-react"
import Spinner from "@/components/common/spinner"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Newsletter signup:", email)
      // Here you would send the email to your newsletter service

      setIsSubscribed(true)
      setEmail("")

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false)
      }, 3000)
    } catch (error) {
      console.error("Newsletter signup error:", error)
      alert("Failed to subscribe. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubscribed) {
    return (
      <div className="flex items-center gap-2 text-green-400">
        <CheckCircle className="h-5 w-5" />
        <span className="text-sm">Successfully subscribed!</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-white placeholder-gray-400"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !email.trim()}
        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 font-medium flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Spinner />
            Subscribing...
          </>
        ) : (
          "Subscribe"
        )}
      </button>
    </form>
  )
}
