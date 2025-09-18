"use client"
import { useState } from "react"
import axios from "axios"
import Spinner from "@/components/common/spinner"
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import { setLoader } from "../../../slices/authSlice"

export default function SignupPage() {
  const loader = useSelector((state) => state.auth.loader)
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const submitFormData = async (e) => {
    e.preventDefault()

    // Add password confirmation validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!")
      return
    }
    dispatch(setLoader(true))
    console.log("form submitted")

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/signup`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })

      toast.success("Signup Successfully!")
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      })
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message)
      toast.error(error.response?.data?.message || error.message || "Signup failed")
    } finally {
      dispatch(setLoader(false))
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      })
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Main Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto bg-opacity-90 rounded-lg p-8 md:p-6">
        {/* Left Side - Text Content */}
        <div className="md:w-1/2 w-full text-center md:text-left md:pr-12 mb-8 md:mb-0">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Organize Your Thoughts, Unleash Your Creativity.
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Capture ideas, manage tasks, and stay productive with our intuitive note-taking application. Your personal
            space for clarity and focus.
          </p>
          <ul className="list-disc list-inside text-left text-gray-700 space-y-2">
            <li>Effortless Note Creation</li>
            <li>Cross-Device Synchronization</li>
            <li>Powerful Search & Organization</li>
            <li>Secure & Private</li>
          </ul>
        </div>

        {/* Right Side - Signup Form */}
        <div className="md:w-1/2 w-full">
          <div className="shadow-lg border-none bg-white bg-opacity-95 rounded-lg overflow-hidden">
            {/* Card Header */}
            <div className="p-6 border-b border-gray-200 text-center">
              <h2 className="text-3xl font-bold text-gray-900">Create Your Account</h2>
              <p className="text-gray-600 mt-1">Join us to start managing your notes efficiently.</p>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <form className="space-y-4" onSubmit={submitFormData}>
                {/* First + Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      id="first-name"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      onChange={changeHandler}
                      value={formData.firstName}
                      required
                      disabled={loader}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      id="last-name"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      onChange={changeHandler}
                      value={formData.lastName}
                      required
                      disabled={loader}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    onChange={changeHandler}
                    value={formData.email}
                    required
                    disabled={loader}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    onChange={changeHandler}
                    value={formData.password}
                    required
                    disabled={loader}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    onChange={changeHandler}
                    value={formData.confirmPassword}
                    required
                    disabled={loader}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loader}
                  className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300 ease-in-out flex items-center justify-center gap-2 ${
                    loader ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {loader ? (
                    <>
                      <Spinner />
                      <span>Signing Up...</span>
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </form>

              {/* Already have account */}
              <div className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <a href="/login" className="font-medium text-purple-600 hover:underline">
                  Log in
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
