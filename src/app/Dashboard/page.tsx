"use client";

import { useEffect, useState } from "react";
import { getDatabase, ref, get, child } from "firebase/database";
import { getApp } from "firebase/app";
import { onAuthStateChanged, getAuth, User as FirebaseUser } from "firebase/auth";

interface StudentData {
  name: string;
  grade: string;
  rollNo: string;
  email: string;
  enrollmentDate:string;
}

export default function Dashboard() {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.email) return;

    const fetchStudent = async () => {
      const db = getDatabase(getApp());
      const dbRef = ref(db);

      try {
        const snapshot = await get(child(dbRef, "students"));
        if (snapshot.exists()) {
          const students = snapshot.val();
          const currentStudent = Object.values(students).find(
            (s: any) => s.email === user.email
          ) as StudentData | undefined;

          if (currentStudent) {
            setStudentData(currentStudent);
          } else {
            console.warn("No student data found for email:", user.email);
          }
        } else {
          console.log("No student data found.");
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudent();
  }, [user?.email]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-gray-500 text-lg animate-pulse">Checking authentication...</p>
      </div>
    );
  if (!user)
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-red-500 text-lg font-semibold">User not logged in.</p>
      </div>
    );
  if (!studentData)
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-gray-500 text-lg animate-pulse">Loading student data...</p>
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-8 ring-1 ring-blue-300">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-4 text-center">
          Welcome <span className="underline decoration-blue-400">{studentData.name}</span>
        </h1>

        <div className="space-y-4">
          <div className="flex justify-between items-center bg-blue-50 rounded-md p-4 shadow-inner">
            <span className="text-blue-800 font-semibold text-lg">Course</span>
            <span className="text-blue-600 text-lg">{studentData.grade}</span>
          </div>

          <div className="flex justify-between items-center bg-blue-50 rounded-md p-4 shadow-inner">
            <span className="text-blue-800 font-semibold text-lg">Enrollment Date </span>
            <span className="text-blue-600 text-lg">{studentData.enrollmentDate}</span>
          </div>

          <div className="flex justify-between items-center bg-blue-50 rounded-md p-4 shadow-inner break-all">
            <span className="text-blue-800 font-semibold text-lg">Email</span>
            <span className="text-blue-600 text-lg">{studentData.email}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
