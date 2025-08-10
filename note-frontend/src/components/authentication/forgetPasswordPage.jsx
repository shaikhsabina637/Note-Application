"use client";

export default function ForgotPasswordPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/placeholder.svg?height=1080&width=1920")',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Main Content - Centered Card */}
      <div className="relative z-10 w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto bg-white bg-opacity-90 rounded-lg shadow-xl p-8 md:p-12 text-center">

        <div className="shadow-lg border-none bg-white bg-opacity-95 rounded-lg overflow-hidden">
          {/* Card Header */}
          <div className="space-y-1 p-6 border-b border-gray-200">
            <h2 className="text-4xl font-bold text-gray-900 text-center whitespace-nowrap">
  Forgot Your Password?
</h2>

            <p className="text-gray-600">
              Enter your email address below and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Card Content */}
          <div className="p-6">
            <form className="space-y-6">
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
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 ease-in-out"
              >
                Send Reset Link
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
  );
}
