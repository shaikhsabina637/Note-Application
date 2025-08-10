"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lightbulb, Menu, X } from "lucide-react";

export default function Navbar({ isLoggedIn = false }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm py-4 px-6 md:px-8 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors duration-200"
        >
          <Lightbulb className="h-7 w-7" />
          <span className="text-2xl font-bold tracking-tight">ThoughtVault</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {isLoggedIn ? (
            <>
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/notes">My Notes</NavLink>
              <NavLink href="/settings">Settings</NavLink>
              <button className="px-4 py-2 text-purple-600 hover:text-purple-800 transition-colors duration-200 font-medium bg-transparent rounded-md">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink href="/">Home</NavLink>
              <NavLink href="/features">Features</NavLink>
              <NavLink href="/about">About</NavLink>
              <Link
                href="/login"
                className="px-4 py-2 border border-purple-600 text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200 rounded-md"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            className="p-2 rounded-md text-gray-700 hover:text-purple-600 transition-colors duration-200"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-3 items-center">
          {isLoggedIn ? (
            <>
              <MobileNavLink href="/dashboard" onClick={toggleMobileMenu}>
                Dashboard
              </MobileNavLink>
              <MobileNavLink href="/notes" onClick={toggleMobileMenu}>
                My Notes
              </MobileNavLink>
              <MobileNavLink href="/settings" onClick={toggleMobileMenu}>
                Settings
              </MobileNavLink>
              <button className="w-full px-4 py-2 text-purple-600 hover:text-purple-800 transition-colors duration-200 font-medium bg-transparent rounded-md">
                Logout
              </button>
            </>
          ) : (
            <>
              <MobileNavLink href="/" onClick={toggleMobileMenu}>
                Home
              </MobileNavLink>
              <MobileNavLink href="/features" onClick={toggleMobileMenu}>
                Features
              </MobileNavLink>
              <MobileNavLink href="/pricing" onClick={toggleMobileMenu}>
                About
              </MobileNavLink>
              <Link
                href="/login"
                className="w-full text-center px-4 py-2 border border-purple-600 text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200 rounded-md"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="w-full text-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

// Helper components for links
function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block w-full text-center py-2 text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium"
    >
      {children}
    </Link>
  );
}
