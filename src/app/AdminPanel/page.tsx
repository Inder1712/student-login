"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AdminDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (isAdminLoggedIn !== "true") {
      router.replace("/SignIn"); // redirect to login if not logged in
    }
  }, [router]);

  return (
    <ProtectedRoute>

    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed inset-x-0 top-0 h-16 bg-white text-black z-50 shadow flex items-center justify-between px-6">
        {/* Left Section: Hamburger + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle sidebar"
            className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
            {isOpen ? (
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          <h1 className="text-xl font-bold">DIEIT</h1>
        </div>

        {/* Right Side: Logo */}
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
          <Link href="/students" className="block px-3 py-2 rounded hover:bg-indigo-500 hover:text-white transition">
            Students Details
          </Link>
          <Link href="/Notifications" className="block px-3 py-2 rounded hover:bg-indigo-500 hover:text-white transition">
            Notifications
          </Link>
          <Link href="/admissions" className="block px-3 py-2 rounded hover:bg-indigo-500 hover:text-white transition">
            Admissions
          </Link>
          <Link href="/courses" className="block px-3 py-2 rounded hover:bg-indigo-500 hover:text-white transition">
            Courses
          </Link>
          <Link href="/reports" className="block px-3 py-2 rounded hover:bg-indigo-500 hover:text-white transition">
            Reports
          </Link>
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

      {/* Main Content */}
      <main className="pt-20 px-6">
        <h2 className="text-2xl font-bold text-black mb-6">
          Welcome to the Admin Dashboard
        </h2>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(250px,_1fr)]">
          {/* Notifications */}
          <div className="bg-white shadow rounded-lg p-6 flex flex-col justify-between min-h-[300px]">
            <h3 className="text-lg font-semibold mb-4 text-indigo-600">
              📢 Notifications
            </h3>
            <ul className="space-y-2 text-gray-700 flex-grow">
              <li>New exam schedule released</li>
              <li>Holiday on Friday</li>
              <li>Workshop registration is open</li>
            </ul>
            <button className="mt-4 text-sm text-indigo-600 hover:underline">
              View all →
            </button>
          </div>

          {/* Admission Enquiries */}
          <div className="bg-white shadow rounded-lg p-6 flex flex-col justify-between min-h-[300px]">
            <h3 className="text-lg font-semibold mb-4 text-indigo-600">
              📝 Admission Enquiries
            </h3>
            <ul className="space-y-2 text-gray-700 flex-grow">
              <li>John Doe - B.Sc Computer Science</li>
              <li>Mary Smith - MBA</li>
              <li>Alex Johnson - B.Tech</li>
            </ul>
            <button className="mt-4 text-sm text-indigo-600 hover:underline">
              View all →
            </button>
          </div>

          {/* Current Courses */}
          <div className="bg-white shadow rounded-lg p-6 flex flex-col justify-between min-h-[300px]">
            <h3 className="text-lg font-semibold mb-4 text-indigo-600">
              🎓 Current Courses
            </h3>
            <ul className="space-y-2 text-gray-700 flex-grow">
              <li>Web Development Bootcamp</li>
              <li>Data Science with Python</li>
              <li>Digital Marketing</li>
            </ul>
            <button className="mt-4 text-sm text-indigo-600 hover:underline">
              View all →
            </button>
          </div>
        </div>
      </main>
    </div>
          </ProtectedRoute>
  );
}
