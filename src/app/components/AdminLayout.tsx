"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const ok = typeof window !== "undefined" && localStorage.getItem("isLoggedIn") === "true";
    if (!ok) {
      router.replace("/");
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Checking access…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 h-16 bg-white text-black z-50 shadow flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle sidebar"
            className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            {isOpen ? (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          <h1 className="text-xl font-bold">DIEIT</h1>
        </div>

        <Image
          src="/Images/logo/logo.png"
          alt="Logo"
          width={40}
          height={40}
          className="object-contain"
        />
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 text-black bg-white z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <nav className="p-4 space-y-2 overflow-y-auto">
          <Link href="https://dieit.in/" target="_blank" className="block px-3 py-2 rounded hover:bg-indigo-500 hover:text-white transition">
            Main Website
          </Link>
          <Link href="/Notifications" className="block px-3 py-2 rounded hover:bg-indigo-500 hover:text-white transition">
            Notifications
          </Link>
          <Link href="/Students" className="block px-3 py-2 rounded hover:bg-indigo-500 hover:text-white transition">
            Students
          </Link>
          <Link href="/courses" className="block px-3 py-2 rounded hover:bg-indigo-500 hover:text-white transition">
            Courses
          </Link>
          <Link href="/reports" className="block px-3 py-2 rounded hover:bg-indigo-500 hover:text-white transition">
            Reports
          </Link>
          <button
            onClick={() => {
              localStorage.setItem("isLoggedIn", "false");
              router.replace("/SignIn");
            }}
            className="w-full text-left px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <button
          aria-label="Close sidebar overlay"
          onClick={() => setIsOpen(false)}
          className="fixed inset-x-0 top-16 bottom-0 bg-black/50 z-30"
        />
      )}

      {/* Main */}
      <main className="pt-20 px-6">{children}</main>
    </div>
  );
}
