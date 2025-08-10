import React from "react";
import Link from "next/link";
import { Lightbulb, Sparkles, Code, Users, Cloud, Lock } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          About ThoughtVault: Your Digital Sanctuary for Ideas
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          ThoughtVault is more than just a note-taking app; it's your dedicated space for capturing, organizing, and
          nurturing your thoughts with unparalleled ease and security.
        </p>
        <Link
  href="/signup"
  className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
>
  Join ThoughtVault Today
</Link>

      </div>

      {/* Our Mission Section */}
      <div className="max-w-6xl mx-auto mb-16 bg-white shadow-lg rounded-lg p-8 md:p-12">
        <div className="flex flex-col items-center text-center mb-8">
          <Lightbulb className="h-16 w-16 text-purple-600 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
        </div>
        <div className="text-gray-700 text-lg leading-relaxed">
          <p className="mb-4">
            At ThoughtVault, our mission is to empower individuals to unlock their full creative and productive
            potential. We believe that great ideas can strike at any moment, and having a reliable, intuitive, and
            secure platform to capture them is paramount. We strive to provide a seamless experience that adapts to
            your workflow, ensuring your thoughts are always organized, accessible, and safe.
          </p>
          <p>
            From quick memos to detailed projects, ThoughtVault is designed to be the ultimate companion for students,
            professionals, and anyone who values clarity and efficiency in their digital life.
          </p>
        </div>
      </div>

      {/* Key Features Highlight */}
      <div className="max-w-6xl mx-auto mb-16">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-10">What Makes ThoughtVault Unique?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Sparkles}
            title="Intuitive Design"
            description="A clean, user-friendly interface that makes note-taking a joy, not a chore."
          />
          <FeatureCard
            icon={Users}
            title="Seamless Experience"
            description="Effortless login, signup, and password recovery processes for a smooth start."
          />
          <FeatureCard
            icon={Code}
            title="Robust Functionality"
            description="From rich text editing and file uploads to advanced organization, archiving, and trash management."
          />
          <FeatureCard
            icon={Lightbulb}
            title="Personalized Control"
            description="Customize your profile, manage settings, and tailor the app to your preferences."
          />
          <FeatureCard
            icon={Lock}
            title="Uncompromised Security"
            description="Your data is protected with strong authentication and privacy measures."
          />
          <FeatureCard
            icon={Cloud}
            title="Anywhere Access"
            description="Synchronize your notes across all devices, ensuring your ideas are always with you."
          />
        </div>
      </div>

      {/* About the Creator Section */}
      <div className="max-w-6xl mx-auto text-center bg-white shadow-lg rounded-lg p-8 md:p-12">
        <div className="flex flex-col items-center text-center mb-8">
          <Code className="h-16 w-16 text-purple-600 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">About the Creator</h2>
        </div>
<div className="text-gray-700 text-lg leading-relaxed">
  <p className="mb-4">
    Hi, I’m Sabina Shaikh — a passionate full-stack developer who loves building modern, user-friendly, and scalable web applications.  
    ThoughtVault was brought to life by <strong>Sabina Shaikh</strong>. My purpose is to help
    developers and creators like you build beautiful, functional, and modern web applications with ease.
  </p>
  <p className="mb-4">
    Leveraging the latest in Next.js, Tailwind CSS, and other modern tools, I designed and coded ThoughtVault to
    demonstrate how powerful and elegant a note-taking application can be. My goal is to provide a solid
    foundation and inspiration for your projects, showcasing best practices in design, responsiveness, and
    user experience.
  </p>
  <p>
    I am constantly learning and evolving to provide the best possible solutions, and creating applications
    like ThoughtVault is how I help bring your ideas to life, one line of code at a time.
  </p>
</div>

      </div>

      {/* Final Call to Action */}
      <div className="max-w-4xl mx-auto text-center mt-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Experience ThoughtVault?</h2>
        <p className="text-lg text-gray-700 mb-8">
          Start organizing your world today. It's free, fast, and incredibly intuitive.
        </p>
       <Link
  href="/signup"
  className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-lg px-10 py-4 rounded-full shadow-lg transition-transform transform hover:scale-105"
>
  Sign Up for Free
</Link>

      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl duration-300">
      <div className="flex flex-col items-center text-center p-6">
        <Icon className="h-12 w-12 text-purple-600 mb-4" />
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      </div>
      <div className="p-6 pt-0">
        <p className="text-gray-700 text-center">{description}</p>
      </div>
    </div>
  );
}
