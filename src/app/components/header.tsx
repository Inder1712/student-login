// src/components/Layout/Header.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo / Institute Name */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Institute Logo" className="h-10 w-10" />
          <span className="text-lg font-bold">ABC Institute</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/" className="hover:text-yellow-300">Home</Link>
          <Link href="/about" className="hover:text-yellow-300">About</Link>
          <Link href="/contact" className="hover:text-yellow-300">Contact</Link>
          <Link href="/signin" className="bg-white text-blue-700 px-3 py-1 rounded hover:bg-yellow-300">
            Sign In
          </Link>
          <Link href="/signup" className="bg-yellow-400 text-blue-900 px-3 py-1 rounded hover:bg-yellow-500">
            Sign Up
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded hover:bg-blue-600"
          onClick={toggleMenu}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-blue-800 px-4 py-3 space-y-3">
          <Link href="/" className="block hover:text-yellow-300">Home</Link>
          <Link href="/about" className="block hover:text-yellow-300">About</Link>
          <Link href="/contact" className="block hover:text-yellow-300">Contact</Link>
          <Link href="/signin" className="block bg-white text-blue-700 px-3 py-1 rounded hover:bg-yellow-300">
            Sign In
          </Link>
          <Link href="/signup" className="block bg-yellow-400 text-blue-900 px-3 py-1 rounded hover:bg-yellow-500">
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
