"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminLayout from "../components/AdminLayout";

export default function AdminDashboard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AdminLayout>

    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      

    

      {/* Main Content */}
      <main className="pt-20 px-6">
        <h2 className="text-2xl font-bold text-black mb-6">
          Welcome to the Admin Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(250px,_1fr)]">
          {/* Notifications */}
          <div className="bg-white shadow rounded-lg p-6 flex flex-col justify-between min-h-[300px]">
            <h3 className="text-lg font-semibold mb-4 text-indigo-600">📢 Notifications</h3>
            <ul className="space-y-2 text-gray-700 flex-grow">
              <li>New exam schedule released</li>
              <li>Holiday on Friday</li>
              <li>Workshop registration is open</li>
            </ul>
            <Link href="/Notifications" className="mt-4 text-sm text-indigo-600 hover:underline">
              View all →
            </Link>
          </div>

          {/* Admission Enquiries */}
          <div className="bg-white shadow rounded-lg p-6 flex flex-col justify-between min-h-[300px]">
            <h3 className="text-lg font-semibold mb-4 text-indigo-600">📝 Admission Enquiries</h3>
            <ul className="space-y-2 text-gray-700 flex-grow">
              <li>John Doe - B.Sc Computer Science</li>
              <li>Mary Smith - MBA</li>
              <li>Alex Johnson - B.Tech</li>
            </ul>
            <Link href="/Students" className="mt-4 text-sm text-indigo-600 hover:underline">
              View all →
            </Link>
          </div>

          {/* Current Courses */}
          <div className="bg-white shadow rounded-lg p-6 flex flex-col justify-between min-h-[300px]">
            <h3 className="text-lg font-semibold mb-4 text-indigo-600">🎓 Current Courses</h3>
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
              </AdminLayout>
  );
}
