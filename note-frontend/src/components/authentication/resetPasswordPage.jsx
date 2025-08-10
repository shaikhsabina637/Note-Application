"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background */}
      {/* Removed the black overlay div */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto  bg-gradient-to-br from-purple-50 to-indigo-100 rounded-lg shadow-xl p-8 md:p-12">
        {/* Left Side - Text Content */}
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
        {/* Right Side - Reset Password Form */}
        <div className="md:w-1/2 w-full">
          <Card className="shadow-lg border-none bg-white rounded-lg overflow-hidden">
            {/* Card Header */}
            <CardHeader className="space-y-1 text-center p-6 border-b border-gray-200">
              <CardTitle className="text-3xl font-bold text-gray-900">Reset Your Password</CardTitle>
              <CardDescription className="text-gray-600">
                Enter your new password below to regain access to your account.
              </CardDescription>
            </CardHeader>
            {/* Card Content */}
            <CardContent className="p-6">
              <form className="space-y-6">
                {/* New Password */}
                <div className="space-y-2 text-left">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    name="newPassword"
                    type="password"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none"
                  />
                </div>
                {/* Confirm New Password */}
                <div className="space-y-2 text-left">
                  <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                  <Input
                    id="confirm-new-password"
                    name="confirmNewPassword"
                    type="password"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none"
                  />
                </div>
                {/* Submit Button */}
                <Button
                  type="button"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 ease-in-out"
                >
                  Reset Password
                </Button>
              </form>
              {/* Back to Login */}
              <div className="mt-6 text-center text-sm text-gray-500">
                <a href="/login" className="font-medium text-purple-600 hover:underline">
                  Back to Log In
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
