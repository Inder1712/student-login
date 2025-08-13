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
  grade: string;      // you can rename to 'course' if needed
  course: string;
  feesPending: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [totalFeesPending, setTotalFeesPending] = useState(0);

  useEffect(() => {
    const loggedIn =
      typeof window !== "undefined" &&
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
      const studentsRef = ref(db, "students");

      onValue(studentsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list: Student[] = Object.values(data).map((s: any) => ({
            name: s.name,
            grade: s.grade || s.course || "N/A",
            course: s.course || s.grade || "N/A",
            feesPending: parseFloat(s.feesPending) || 0,
          }));
          setStudents(list);

          // Calculate total pending fees
          const total = list.reduce((acc, curr) => acc + curr.feesPending, 0);
          setTotalFeesPending(total);
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
      <header className="bg-indigo-500 text-white py-4 px-6 flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </header>

      <main className="p-6 space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-sm text-gray-600">Total Students</p>
            <p className="text-2xl font-semibold text-indigo-500">
              {students.length}
            </p>
          </div>

          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-sm text-gray-600">Total Fees Pending</p>
            <p className="text-2xl font-semibold text-red-600">
              ₹ {totalFeesPending.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="bg-white p-4 rounded shadow text-center">
            <p className="text-sm text-gray-600">Unique Courses</p>
            <p className="text-2xl font-semibold text-green-600">
              {new Set(students.map((s) => s.course)).size}
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
            Students Overview
          </h2>

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
                  <p className="text-gray-700">Course: {stu.course}</p>
                  <p className="text-gray-700">
                    Fees Pending: ₹ {stu.feesPending.toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
