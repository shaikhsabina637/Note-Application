"use client"
import Link from "next/link"
import { Mail, Phone, MapPin, Send } from "lucide-react" // Importing icons from lucide-react
import { useState } from "react"
import { toast } from "react-toastify"
import { setLoader } from "../../../slices/authSlice"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import Spinner from "@/components/common/spinner"

export default function ContactPage() {
  const dispatch = useDispatch()
  const loader = useSelector((state) => state.auth.loader)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const sendMessageHandler = async (e) => {
    e.preventDefault()
    if (!name || !email || !message) {
      toast.error("All fileds are required")
      return
    }
    dispatch(setLoader(true))
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/contact`, {
        fullName: name,
        email,
        message,
      })
      toast.success("Message sent Successfully!")
      setEmail("")
      setName("")
      setMessage("")
    } catch (error) {
      console.error("Contact Error:", error.response?.data || error.message)
      toast.error(error.response?.data?.message || error.message || "Contact failed")
    } finally {
      dispatch(setLoader(false))
      setName("")
      setEmail("")
      setMessage("")
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">Get in Touch with ThoughtVault</h1>
        <p className="text-xl text-gray-700 mb-8">
          We're here to help! Whether you have a question, feedback, or need support, feel free to reach out to us.
        </p>
      </div>

      {/* Contact Information & Form Container */}
      <div className="relative z-10 flex flex-col lg:flex-row items-stretch justify-center w-full max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Left Side - Contact Information */}
        <div className="lg:w-1/2 w-full p-8 md:p-12 bg-purple-700 text-white flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-6">Contact Information</h2>
          <p className="text-lg mb-8 opacity-90">
            Our team is ready to assist you. Reach out through any of the channels below.
          </p>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Mail className="h-8 w-8 text-purple-200" />
              <div>
                <h3 className="text-xl font-semibold">Email Us</h3>
                <p className="text-lg opacity-90">shaikhsabina637@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="h-8 w-8 text-purple-200" />
              <div>
                <h3 className="text-xl font-semibold">Call Us</h3>
                <p className="text-lg opacity-90">+91 9321778441</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <MapPin className="h-8 w-8 text-purple-200" />
              <div>
                <h3 className="text-xl font-semibold">Visit Us</h3>
                <p className="text-lg opacity-90">Bandra West , Mumbai Maharashtra</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="lg:w-1/2 w-full p-8 md:p-12 bg-white">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center lg:text-left">Send Us a Message</h2>
          <form className="space-y-6" onSubmit={sendMessageHandler}>
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sabina Shaikh"
                required
                disabled={loader}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loader}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-lg font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={loader}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none text-gray-900 resize-y disabled:bg-gray-100 disabled:cursor-not-allowed"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loader}
              className={`w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-300 ease-in-out ${
                loader ? "opacity-75" : ""
              }`}
            >
              {loader ? (
                <>
                  <Spinner />
                  <span>Sending Message...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Back to Home/Login */}
      <div className="mt-12 text-center">
        <Link href="/" className="text-lg font-medium text-purple-600 hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  )
}
