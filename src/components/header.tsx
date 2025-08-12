"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo / Institute Name */}
        <Link href="/" className="text-xl font-bold">
          Institute Portal
        </Link>

        {/* Navigation Links */}
        <nav className="flex gap-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/login" className="hover:underline">
            Login
          </Link>
          <Link href="/signup" className="hover:underline">
            Signup
          </Link>
        </nav>
      </div>
    </header>
  );
}
