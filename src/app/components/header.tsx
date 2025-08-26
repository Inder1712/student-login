"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo / Institute Name */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/Images/logo/logo.png"
            alt="Institute Logo"
            className="h-12"
          />
          <span className="text-xl font-bold text-[#222c44]">DIEIT</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center font-medium text-[#57595f]">
          <Link
            href="https://dieit.in/"
            target="_blank"
            className="text-lg px-4 py-2 rounded-full bg-[#6556ff] text-white text-center hover:bg-[#4a43d6] transition-colors duration-300"
          >
            Main Website
          </Link>
          <Link
            href="/Students"
            className="text-lg px-4 py-2 rounded-full bg-[#f0f0f0] text-[#222c44] text-center hover:bg-[#e0e0e0] transition-colors duration-300"
          >
            Students
          </Link>
          <Link
            href="/Notifications"
            className="text-lg px-4 py-2 rounded-full bg-[#f0f0f0] text-[#222c44] text-center hover:bg-[#e0e0e0] transition-colors duration-300"
          >
            Notifications
          </Link>
          <Link
            href="/"
            className="text-lg px-4 py-2 rounded-full bg-red-500 text-white text-center hover:bg-red-600 transition-colors duration-300"
          >
            Logout
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded hover:bg-[#ede9ff]"
          onClick={toggleMenu}
        >
          {isOpen ? (
            <X className="text-[#6556ff]" />
          ) : (
            <Menu className="text-[#6556ff]" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-72 bg-white z-50 flex flex-col shadow-lg p-6">
          {/* Top bar with logo and close button */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/Images/logo/logo.png"
                alt="Institute Logo"
                className="h-12"
              />
              <span className="text-xl font-bold text-[#222c44]">DIEIT</span>
            </Link>
            <button onClick={toggleMenu} className="p-2 rounded hover:bg-gray-200">
              <X className="text-[#6556ff]" />
            </button>
          </div>

          {/* Mobile Menu Items */}
          <nav className="flex flex-col gap-4 font-medium text-[#222c44]">
            <Link
              href="https://dieit.in/"
              target="_blank"
              onClick={toggleMenu}
              className="text-lg px-4 py-2 rounded-full bg-[#6556ff] text-white text-center hover:bg-[#4a43d6] transition-colors duration-300"
            >
              Main Website
            </Link>
            <Link
              href="/Students"
              onClick={toggleMenu}
              className="text-lg px-4 py-2 rounded-full bg-[#f0f0f0] text-[#222c44] text-center hover:bg-[#e0e0e0] transition-colors duration-300"
            >
              Students
            </Link>
            <Link
              href="/Notifications"
              onClick={toggleMenu}
              className="text-lg px-4 py-2 rounded-full bg-[#f0f0f0] text-[#222c44] text-center hover:bg-[#e0e0e0] transition-colors duration-300"
            >
              Notifications
            </Link>
            <Link
              href="/"
              onClick={toggleMenu}
              className="text-lg px-4 py-2 rounded-full bg-red-500 text-white text-center hover:bg-red-600 transition-colors duration-300"
            >
              Logout
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
