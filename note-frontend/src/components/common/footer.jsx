"use client"
import NewsletterSignup from "./newsLetterSignup"
import { Linkedin, Github, Phone } from "lucide-react" // icons

const Footer = () => {
  return (
    <footer className="text-white bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-gray-300 mb-4">
                 I am a passionate developer specializing in building web applications using modern technologies.
            </p>
            <p className="text-gray-300 mb-4">
              Founded in 2025, we have grown to become a leading company in our industry.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-300 mb-4">Email: shaikhsabina637@gmail.com</p>
            <p className="text-gray-300 mb-4">Phone: +91 9321778441</p>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-6">
              <a
                href="https://www.linkedin.com/in/shaikhsabina/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://github.com/shaikhsabina637"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400"
              >
                <Github size={24} />
              </a>
              <a
                href="https://wa.me/919321778441"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400"
              >
                <Phone size={24} />
              </a>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="lg:ml-auto">
            <h3 className="text-lg font-semibold mb-4 text-purple-400">Stay Updated</h3>
            <p className="text-gray-300 mb-4 text-sm">
              Get the latest updates, tips, and features delivered straight to your inbox.
            </p>
            <NewsletterSignup />
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="mt-4 pb-6 border-t border-gray-800 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Made by <span className="text-purple-400">Sabina Shaikh</span>. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
