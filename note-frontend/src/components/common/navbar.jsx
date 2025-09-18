"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lightbulb, Menu, X, AlignRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../slices/authSlice";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const logoutHandler = (e) => {
    e.preventDefault();
    dispatch({ type: "auth/logout" });
    router.push("/"); 
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white shadow-sm py-4 px-6 md:px-8 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors duration-200"
          >
            <Lightbulb className="h-7 w-7" />
            <span className="text-2xl font-bold tracking-tight">
              ThoughtVault
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 relative">
            {isAuthenticated ? (
              <>
                <NavLink href="/">Home</NavLink>        
                <NavLink href="/about">About</NavLink>  {/* Added */}
                <NavLink href="/note">My Notes</NavLink>
                <button
                  className="px-4 py-2 text-purple-600 hover:text-purple-800 transition-colors duration-200 font-medium bg-transparent rounded-md"
                  onClick={logoutHandler}
                >
                  Logout
                </button>

                {/* Profile Image + Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2"
                  >
                    <img
                      src={user?.image}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full border border-gray-300"
                    />
                    <AlignRight className="h-6 w-6 text-gray-700" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-3 space-y-2 z-50">
                      <SidebarLink href="/note" onClick={() => setIsDropdownOpen(false)}>My Notes</SidebarLink>
                      <SidebarLink href="/trash" onClick={() => setIsDropdownOpen(false)}>Trash</SidebarLink>
                      <SidebarLink href="/archive" onClick={() => setIsDropdownOpen(false)}>Archived</SidebarLink>
                      <SidebarLink href="/profile" onClick={() => setIsDropdownOpen(false)}>Profile</SidebarLink>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <NavLink href="/">Home</NavLink>
                <NavLink href="/features">Features</NavLink>
                <NavLink href="/about">About</NavLink>
                <NavLink href="/contact">Contact</NavLink>
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
          <div className="md:hidden flex items-center space-x-3">
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
          <div className="md:hidden mt-4 flex flex-col space-y-3 items-center w-full">
            {isAuthenticated && (
              <div className="flex flex-col items-center mb-2">
                <img
                  src={user?.image}
                  alt="User Avatar"
                  className="w-16 h-16 rounded-full border border-gray-300 mb-2"
                />
                <span className="font-medium text-gray-700">{user?.name}</span>
              </div>
            )}

            {isAuthenticated ? (
              <>
                <MobileNavLink href="/" onClick={toggleMobileMenu}>
                  Home
                </MobileNavLink>        
                <MobileNavLink href="/about" onClick={toggleMobileMenu}>
                  About
                </MobileNavLink>       
                <MobileNavLink href="/note" onClick={toggleMobileMenu}>
                  My Notes
                </MobileNavLink>
                <MobileNavLink href="/trash" onClick={toggleMobileMenu}>
                  Trash
                </MobileNavLink>
                <MobileNavLink href="/archive" onClick={toggleMobileMenu}>
                  Archived
                </MobileNavLink>
                <MobileNavLink href="/profile" onClick={toggleMobileMenu}>
                  Profile
                </MobileNavLink>
                <button
                  onClick={logoutHandler}
                  className="w-full px-4 py-2 text-purple-600 hover:text-purple-800 transition-colors duration-200 font-medium bg-transparent rounded-md"
                >
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
                <MobileNavLink href="/about" onClick={toggleMobileMenu}>
                  About
                </MobileNavLink>
                <MobileNavLink href="/contact" onClick={toggleMobileMenu}>
                  Contact
                </MobileNavLink>
                <Link
                  href="/login"
                  onClick={toggleMobileMenu}
                  className="w-full text-center px-4 py-2 border border-purple-600 text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200 rounded-md"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={toggleMobileMenu}
                  className="w-full text-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

// Helper Components
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

function SidebarLink({ href, children, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}   // Close dropdown on click
      className="block text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200"
    >
      {children}
    </Link>
  );
}
