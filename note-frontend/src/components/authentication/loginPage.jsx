"use client"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { login, setLoader } from "../../../slices/authSlice"
import axios from "axios"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import Spinner from "@/components/common/spinner"

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const loader = useSelector((state) => state.auth.loader)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(setLoader(true))

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        },
      )

      if (response?.data.success) {
        // Dispatch login action
        dispatch(
          login({
            user: response.data.checkUserExist,
            token: response.data.token,
            isAuthenticated: true,
          }),
        )
        setEmail("")
        setPassword("")
        router.push("/note")
      } else {
        toast.error(response?.data?.message || "Logged in failed")
      }
    } catch (error) {
      console.log("Login Error:", error.response?.data || error.message)
      toast.error(error.response?.data?.message || error.message || "Logged in failed")
    } finally {
      dispatch(setLoader(false))
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-2 bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto bg-opacity-90 rounded-lg p-8 md:p-12">
        {/* Left Side - Login Form */}
        <div className="md:w-1/2 w-full mb-8 md:mb-0 md:mt-0">
          <div className="shadow-lg border-none bg-white bg-opacity-95 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 text-center">
              <h2 className="text-4xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-600 mt-1">Log in to access your notes and stay organized.</p>
            </div>

            <div className="p-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loader}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loader}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  {/* Forgot Password Link */}
                  <div className="text-right mt-1">
                    <a href="/forgetpassword" className="text-sm text-purple-600 hover:underline">
                      Forgot Password?
                    </a>
                  </div>
                </div>

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
                      <span>Logging in...</span>
                    </>
                  ) : (
                    "Log In"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <a href="/signup" className="font-medium text-purple-600 hover:underline">
                  Sign up
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Text Content */}
        <div className="md:w-1/2 w-full text-center md:text-left md:pl-12">
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            Welcome Back to Your Productivity Hub
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Access your notes anytime, anywhere. Stay organized, stay focused, and bring your ideas to life
            effortlessly.
          </p>
          <p className="text-md text-gray-600 mb-4">
            With seamless syncing and secure storage, your creativity never has to take a back seat.
          </p>
          <ul className="list-disc list-inside text-left text-gray-700 space-y-2">
            <li>Quick access to all your notes</li>
            <li>Secure login to protect your data</li>
            <li>Cross-device synchronization</li>
            <li>Simple & intuitive interface</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
