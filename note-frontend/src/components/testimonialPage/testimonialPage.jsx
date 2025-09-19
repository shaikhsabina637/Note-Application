"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"
export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [testimonials, setTestimonials] = useState([])

  // ✅ Fetch feedbacks from backend
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/getFeedback`) // apna backend API endpoint dalna
        if (res.data.success) {
          console.log("feedback response",res.data)
          const mappedData = res.data.userFeedbacks.map((fb, index) => ({
            id: fb._id,
            name: `${fb.user.firstName} ${fb.user.lastName}`,
            role: fb.feedBackCategory,
            company: "User Feedback",
            avatar: fb.user.image || "/placeholder.svg",
            rating: fb.rating,
            content: fb.review,
            date: fb.createdAt,
          }))
          setTestimonials(mappedData)
        }
      } catch (error) {
        console.log(`Error while fetching feed back : `,error.response?.data?.message|| error.message)
                  toast.error(error.response?.data?.message|| error.message)
      }
    }

    fetchFeedbacks()
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-purple-50 overflow-hidden overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 rounded-full p-3">
              <Quote className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied users who have transformed their note-taking experience with ThoughtVault
          </p>
        </motion.div>

        {/* Main Testimonial Display */}
        {testimonials.length > 0 && (
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mx-auto max-w-4xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-center"
                >
                  {/* Quote Icon */}
                  <div className="flex justify-center mb-6">
                    <Quote className="h-12 w-12 text-purple-200" />
                  </div>

                  {/* Rating */}
                  <div className="flex justify-center mb-6">{renderStars(testimonials[currentIndex].rating)}</div>

                  {/* Content */}
                  <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 italic">
                    "{testimonials[currentIndex].content}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <img
                      src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                      alt={testimonials[currentIndex].name}
                      className="w-16 h-16 rounded-full border-4 border-purple-100"
                    />
                    <div className="text-center md:text-left">
                      <h4 className="text-lg font-semibold text-gray-900">{testimonials[currentIndex].name}</h4>
                      <p className="text-purple-600 font-medium">{testimonials[currentIndex].role}</p>
                      <p className="text-gray-500 text-sm">{testimonials[currentIndex].company}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-600 hover:text-purple-600 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-600 hover:text-purple-600 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-purple-600 scale-125" : "bg-gray-300 hover:bg-purple-300"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
