"use client"
import { setLoader } from "../../../slices/authSlice"
import { useState, useRef, useEffect } from "react"
import { Shield, ArrowLeft, RefreshCw } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "react-toastify"
import Spinner from "../common/spinner"
export default function OTPPage() {
const router = useRouter()
  const loader = useSelector((state)=>state.auth.loader)
  const dispatch = useDispatch()
  const searchParams = useSearchParams();
  const email = searchParams.get("email")
  console.log(email)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef([])

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Handle OTP input change
  const handleChange = (index, value) => {
    if (value.length > 1) return // Prevent multiple characters

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)

    // Auto-focus next input
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const newOtp = [...otp]

    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }

    setOtp(newOtp)

    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, 5)
    inputRefs.current[nextIndex]?.focus()
  }

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    const otpString = otp.join("")

    if (otpString.length !== 6) {
      alert("Please enter all 6 digits")
      return
    }
       dispatch(setLoader(true))
          try{
          const response =await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verifyotp`,{
            email,
            otp:otpString
          })
          console.log(response.data)
          toast.success("Otp verified Successfully!")
          router.push(`/resetpassword?email=${encodeURIComponent(email)}`)
      }catch(error){
          console.log(`OTP verify Error : `,error.response?.data?.message|| error.message)
          toast.error(error.response?.data?.message|| error.message)
      }finally{
        setOtp(["", "", "", "", "", ""])
        dispatch(setLoader(false))

      }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    dispatch(setLoader(true))
    setCanResend(false)
    setTimeLeft(300) // Reset timer to 5 minutes
    setOtp(["", "", "", "", "", ""]) // Clear current OTP
          try{
          const response =await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/forgetpassword`,{
            email
          })
          console.log(response.data)
                    inputRefs.current[0]?.focus()

          toast.success("Email sent successfully!")
      }catch(error){
          console.log(`Error while sending OTP : `,error.response?.data?.message|| error.message)
          toast.error(error.response?.data?.message|| error.message)
      }finally{
        dispatch(setLoader(false))

      }
  
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
        {loader && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <Spinner />
  </div>
)}
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button className="flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-6 transition-colors duration-200">
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Verify Your Account</h1>
            <p className="text-gray-600">We've sent a 6-digit verification code to</p>
            <p className="font-semibold text-gray-900">{email}</p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            {/* OTP Input Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter Verification Code
              </label>
              <div className="flex justify-center gap-3 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 md:w-14 md:h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-200"
                    disabled={loader}
                  />
                ))}
              </div>
            </div>

            {/* Timer */}
            <div className="text-center">
              {timeLeft > 0 ? (
                <p className="text-sm text-gray-600">
                  Code expires in <span className="font-semibold text-purple-600">{formatTime(timeLeft)}</span>
                </p>
              ) : (
                <p className="text-sm text-red-600">Code has expired</p>
              )}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loader || otp.join("").length !== 6}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loader ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>
          </form>

          {/* Resend Section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
            <button
              onClick={handleResendOTP}
              disabled={!canResend || loader}
              className="text-purple-600 hover:text-purple-800 disabled:text-gray-400 disabled:cursor-not-allowed font-medium text-sm flex items-center justify-center gap-2 mx-auto transition-colors duration-200"
            >
              <RefreshCw className={`h-4 w-4 ${loader ? "animate-spin" : ""}`} />
              {canResend ? "Resend Code" : `Resend in ${formatTime(timeLeft)}`}
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Having trouble?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Check your spam/junk folder</li>
              <li>• Make sure your email address is correct</li>
              <li>• Wait a few minutes for the code to arrive</li>
              <li>• Contact support if issues persist</li>
            </ul>
          </div>
        </div>

        
      </div>
    </div>
  )
}
