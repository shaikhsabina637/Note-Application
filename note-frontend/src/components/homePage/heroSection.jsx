"use client" // This is needed for client-side interactivity like animations

import Link from "next/link"
import { motion } from "framer-motion" // For animations

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-4">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-100"></div>

      {/* Main Content - Reduced top padding */}
      <motion.div
        className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto px-4 py-6 md:py-16 backdrop-blur-sm gap-8 md:gap-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Side - Text Content */}
        <div className="md:w-1/2 w-full text-center md:text-left">
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6"
            variants={itemVariants}
          >
            <span className="block">Capture Every Idea.</span>
            <span className="block text-purple-700">Organize Your World.</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-700 mb-10 max-w-2xl md:max-w-none mx-auto"
            variants={itemVariants}
          >
            ThoughtVault is your intuitive digital notebook, designed to help you effortlessly save, manage, and
            retrieve all your thoughts, tasks, and inspirations.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-4"
            variants={itemVariants}
          >
            <Link href="/signup">
              <button className="bg-purple-600 hover:bg-purple-700 text-white text-lg md:text-xl font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300">
                Start for Free
              </button>
            </Link>
            <Link href="/features">
              <button className="bg-transparent border-2 border-purple-600 text-purple-700 hover:bg-purple-50 text-lg md:text-xl font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300">
                Learn More
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Right Side - Note Page Icon */}
        <motion.div
          className="md:w-1/2 w-full flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
        >
          <img
            src="/image/note2.png"
            alt="Open Notebook with Pen and Ideas"
            className="max-w-full h-auto rounded-lg shadow-xl"
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
