"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getDatabase,
  ref,
  onValue,
  off
} from "firebase/database";
import { getApp } from "firebase/app";

interface Student {
  name: string;
  grade: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const loggedIn = typeof window !== "undefined" &&
      localStorage.getItem("isAdminLoggedIn") === "true";
    if (!loggedIn) {
      router.replace("/admin/login");
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  useEffect(() => {
    if (!checkingAuth) {
      const db = getDatabase(getApp());
      const studentsRef = ref(db, "student");
      onValue(studentsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list = Object.values(data).map((s: any) => ({
            name: s.name,
            grade: s.grade
          }));
          setStudents(list);
        }
      });

      return () => {
        off(studentsRef);
      };
    }
  }, [checkingAuth]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    router.replace("/AdminLogin");
  };

  if (checkingAuth) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-gray-600 text-lg">Loading Admin Panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white py-3 px-6 flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </header>

      <main className="p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Students Overview</h2>
        {students.length === 0 ? (
          <p className="text-gray-600">No students found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((stu, idx) => (
              <div
                key={`${stu.name}-${idx}`}
                className="bg-white rounded-md shadow p-4"
              >
                <p className="text-lg font-medium text-gray-900">{stu.name}</p>
                <p className="text-gray-700">Grade: {stu.grade}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
