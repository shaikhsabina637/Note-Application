"use client"

import { useState } from "react"
import { setLoader } from "../../../slices/authSlice"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import Spinner from "@/components/common/spinner"
import axios from "axios"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const loader = useSelector((state) => state.auth.loader)
  const dispatch = useDispatch()
  const [email, setEmail] = useState("")

  const forgetPasswordHandler = async (e) => {
    e.preventDefault()
    dispatch(setLoader(true))
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/forgetpassword`, {
        email,
      })
      console.log(response.data)
      toast.success("Email sent successfully!")
      router.push(`/otp?email=${encodeURIComponent(email)}`)
    } catch (error) {
      console.log(`Forget Password Error : `, error.response?.data?.message || error.message)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setEmail("")
      dispatch(setLoader(false))
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-indigo-100">

      {/* Main Content - Centered Card */}
      <div className="relative z-10 w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto bg-white bg-opacity-90 rounded-lg shadow-xl p-8 md:p-12 text-center">
        <div className="shadow-lg border-none bg-white bg-opacity-95 rounded-lg overflow-hidden">
          {/* Card Header */}
          <div className="space-y-1 p-6 border-b border-gray-200">
            <h2 className="text-4xl font-bold text-gray-900 text-center">Forgot Your Password?</h2>
            <p className="text-gray-600">
              Enter your email address below and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Card Content */}
          <div className="p-6">
            <form className="space-y-6" onSubmit={forgetPasswordHandler}>
              {/* Email */}
              <div className="space-y-2 text-left">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center text-sm text-gray-500">
              Remember your password?{" "}
              <a href="/login" className="font-medium text-purple-600 hover:underline">
                Back to Log In
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
