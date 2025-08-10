import Link from "next/link"
import { PencilLine, Tags, Archive, Trash2, Cloud, Lock, UserCog, Share2, LayoutGrid } from "lucide-react"

export default function FeaturesPage() {
  const features = [
    {
      icon: PencilLine,
      title: "Intuitive Note Creation",
      description:
        "Craft your thoughts with a rich text editor, and easily embed images or files to make your notes comprehensive.",
    },
    {
      icon: Tags,
      title: "Powerful Organization",
      description:
        "Categorize and tag your notes for effortless retrieval. Use the search bar and filters to find exactly what you need, instantly.",
    },
    {
      icon: LayoutGrid,
      title: "Flexible Viewing Options",
      description:
        "Switch between grid and list views to display your notes just the way you like. Pin important notes for quick access.",
    },
    {
      icon: Archive,
      title: "Streamlined Workflow",
      description:
        "Manage your notes with ease: save as drafts, archive old notes to declutter, or restore them when needed.",
    },
    {
      icon: Trash2,
      title: "Secure Data Recovery",
      description:
        "Deleted notes are moved to the Trash, giving you a grace period to restore them before permanent deletion.",
    },
    {
      icon: Cloud,
      title: "Seamless Cross-Device Sync",
      description:
        "Access your notes anytime, anywhere. Your data is automatically synchronized across all your devices.",
    },
    {
      icon: Lock,
      title: "Robust Security & Privacy",
      description:
        "Your notes are protected with secure authentication and encryption, ensuring your personal thoughts remain private.",
    },
    {
      icon: UserCog,
      title: "Personalized Experience",
      description:
        "Customize your profile, manage account settings, and tailor the app to your preferences, including theme options.",
    },
    {
      icon: Share2,
      title: "Effortless Collaboration",
      description:
        "Share notes with colleagues or friends and collaborate in real-time (if shared notes feature is enabled).",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          Unlock Your Productivity with ThoughtVault
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Discover the powerful features designed to help you capture, organize, and manage your ideas effortlessly.
        </p>
        <Link
          href="/signup"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
        >
          Start Your Free Trial
        </Link>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl duration-300"
          >
            <div className="flex flex-col items-center text-center p-6">
              <feature.icon className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
            </div>
            <div className="p-6 pt-0">
              <p className="text-gray-700 text-center">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="max-w-4xl mx-auto text-center mt-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Transform Your Note-Taking?</h2>
        <p className="text-lg text-gray-700 mb-8">
          Join thousands of users who are already boosting their productivity with ThoughtVault.
        </p>
        <Link
          href="/signup"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-lg px-10 py-4 rounded-full shadow-lg transition-transform transform hover:scale-105"
        >
          Sign Up Now
        </Link>
      </div>
    </div>
  )
}
