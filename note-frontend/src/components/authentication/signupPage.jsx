export default function SignupPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-indigo-100">
      

      {/* Main Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto  bg-opacity-90 rounded-lg  p-8 md:p-6">
        
        {/* Left Side - Text Content */}
        <div className="md:w-1/2 w-full text-center md:text-left md:pr-12 mb-8 md:mb-0">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Organize Your Thoughts, Unleash Your Creativity.
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Capture ideas, manage tasks, and stay productive with our intuitive note-taking application. 
            Your personal space for clarity and focus.
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
              <p className="text-gray-600 mt-1">
                Join us to start managing your notes efficiently.
              </p>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <form className="space-y-2">
                {/* First + Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      id="first-name"
                      name="firstName"
                      placeholder="John"
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      id="last-name"
                      name="lastName"
                      placeholder="Doe"
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none"
                    />
                  </div>
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
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none"
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
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 ease-in-out"
                >
                  Sign Up
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
  );
}
