"use client"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams, useRouter } from "next/navigation"
import { setLoader } from "../../../slices/authSlice"
import axios from "axios"
import { toast } from "react-toastify"
import Spinner from "@/components/common/spinner"

export default function ResetPasswordPage() {
  useEffect(() => {
    console.log("Component mounted")
  }, [])

  const loader = useSelector((state) => state.auth.loader)
  const dispatch = useDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")

  const updatePasswordHandler = async (e) => {
    e.preventDefault()

    // Add password confirmation validation
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match!")
      return
    }

    dispatch(setLoader(true))
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/updatepassword`, {
        newPassword,
        confirmNewPassword,
        email,
      })
      console.log(response.data)
      toast.success("Password updated successfully!")
      router.push("/login")
    } catch (error) {
      console.log(`Update Password Error : `, error.response?.data?.message || error.message)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setNewPassword("")
      setConfirmNewPassword("")
      dispatch(setLoader(false))
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {loader && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <Spinner />
        </div>
      )}

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto bg-gradient-to-br from-purple-50 to-indigo-100 rounded-lg shadow-xl p-8 md:p-12">
        {/* Left Side */}
        <div className="md:w-1/2 w-full text-center md:text-left md:pr-12 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Secure Your Account, Regain Access.
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Choose a strong, new password to protect your notes and ensure your account's security.
          </p>
          <p className="text-md text-gray-600 mb-4">
            It's important to use a unique password that you haven't used before. Make it memorable for you, but hard
            for others to guess.
          </p>
          <ul className="list-disc list-inside text-left text-gray-700 space-y-2">
            <li>Use a combination of uppercase and lowercase letters.</li>
            <li>Include numbers and special characters.</li>
            <li>Aim for at least 8-12 characters.</li>
            <li>Avoid easily guessable information like birthdays or names.</li>
          </ul>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 w-full">
          <div className="shadow-lg border-none bg-white rounded-lg overflow-hidden">
            {/* Header */}
            <div className="space-y-1 text-center p-6 border-b border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900">Reset Your Password</h2>
              <p className="text-gray-600">Enter your new password below to regain access to your account.</p>
            </div>

            {/* Form */}
            <div className="p-6">
              <form onSubmit={updatePasswordHandler} className="space-y-6">
                {/* New Password */}
                <div className="space-y-2 text-left">
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    id="new-password"
                    name="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={loader}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2 text-left">
                  <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-new-password"
                    name="confirmNewPassword"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    disabled={loader}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Submit */}
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
                      <span>Resetting Password...</span>
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>

              {/* Back Link */}
              <div className="mt-6 text-center text-sm text-gray-500">
                <a href="/login" className="font-medium text-purple-600 hover:underline">
                  Back to Log In
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
