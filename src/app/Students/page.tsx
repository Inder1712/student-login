// src/app/admissions-list/page.tsx
"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { collection, getDocs, Timestamp, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AdminLayout from "../components/AdminLayout";

interface Admission {
  id: string;
  name: string;
  email: string;
  course: string;
  institute?: string;
  session?: string;
  message?: string;
  createdAt?: Timestamp;
  dob?: string;
  gender?: string;
  address?: string;
  phone?: string;
  qualification?: string;
  photo?: string;
  aadhar?: string;
  qualificationDoc?: string;
}

export default function AdmissionsListPage() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  const [selectedCourse, setSelectedCourse] = useState<string>("All");
  const [selectedInstitute, setSelectedInstitute] = useState<string>("All");
  const [selectedSession, setSelectedSession] = useState<string>("All");
  const [selectedStudent, setSelectedStudent] = useState<Admission | null>(null);

  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminUser") === "true";
    if (isLoggedIn && pathname === "/AdminPanel") {
      router.replace("/Students");
    }
    setChecking(false);
  }, [router, pathname]);

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Admissions"));
        const data = querySnapshot.docs.map((doc) => {
          const docData = doc.data() as Omit<Admission, "id">;
          return {
            ...docData,
            id: doc.id,
            createdAt: docData.createdAt,
          };
        }) as Admission[];
        setAdmissions(data);
      } catch (error) {
        console.error("Error fetching admissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissions();
  }, []);

  // Unique filters
  const courses = useMemo(() => ["All", ...new Set(admissions.map((a) => a.course).filter(Boolean))], [admissions]);
  const institutes = useMemo(() => ["All", ...new Set(admissions.map((a) => a.institute).filter(Boolean))], [admissions]);
  const sessions = useMemo(() => ["All", ...new Set(admissions.map((a) => a.session).filter(Boolean))], [admissions]);

  // Filtering
  const filteredAdmissions = useMemo(() => {
    return admissions.filter((a) => {
      const matchCourse = selectedCourse === "All" || a.course === selectedCourse;
      const matchInstitute = selectedInstitute === "All" || a.institute === selectedInstitute;
      const matchSession = selectedSession === "All" || a.session === selectedSession;
      return matchCourse && matchInstitute && matchSession;
    });
  }, [admissions, selectedCourse, selectedInstitute, selectedSession]);

  if (checking) return null;

  return (
    <AdminLayout>
      <div className="bg-slate-50 min-h-screen text-gray-800">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white pt-6 pb-6 px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Student Applications</h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg">
            Review all student admissions submitted through the online form.
          </p>
        </section>

        {/* Filter Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 text-gray-700">
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6">
            {/* Course Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <label className="font-semibold text-gray-700">Course:</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full sm:w-auto"
              >
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            {/* Institute Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <label className="font-semibold text-gray-700">Institute:</label>
              <select
                value={selectedInstitute}
                onChange={(e) => setSelectedInstitute(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full sm:w-auto"
              >
                {institutes.map((inst) => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
              </select>
            </div>

            {/* Session Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <label className="font-semibold text-gray-700">Session:</label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full sm:w-auto"
              >
                {sessions.map((session) => (
                  <option key={session} value={session}>
                    {session}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Table Section */}
        <section className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
          {loading ? (
            <p className="text-center text-gray-600">Loading applications...</p>
          ) : filteredAdmissions.length === 0 ? (
            <p className="text-center text-gray-600">No applications found.</p>
          ) : (
            <div className="overflow-x-auto bg-white shadow-md rounded-xl border">
              <table className="w-full min-w-[600px] border-collapse text-sm sm:text-base">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-3 sm:p-4 border-b">Profile</th>
                    <th className="p-3 sm:p-4 border-b">Name</th>
                    <th className="p-3 sm:p-4 border-b">Course</th>
                    <th className="p-3 sm:p-4 border-b">Institute</th>
                    <th className="p-3 sm:p-4 border-b">Session</th>
                    <th className="p-3 sm:p-4 border-b text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmissions.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="p-3 sm:p-4 border-b">
                        {student.photo ? (
                          <img
                            src={student.photo}
                            alt={student.name}
                            className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg border"
                          />
                        ) : (
                          <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gray-100 text-gray-400 border rounded-lg text-xs">
                            No Photo
                          </div>
                        )}
                      </td>
                      <td className="p-3 sm:p-4 border-b font-medium">{student.name}</td>
                      <td className="p-3 sm:p-4 border-b">{student.course}</td>
                      <td className="p-3 sm:p-4 border-b">{student.institute || "N/A"}</td>
                      <td className="p-3 sm:p-4 border-b">{student.session || "N/A"}</td>
                      <td className="p-3 sm:p-4 border-b text-center">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Popup Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-2">
            <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 max-w-3xl w-full relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>

              <h2 className="text-xl sm:text-2xl font-bold mb-4">Student Details</h2>

              {/* Student Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-gray-700 mb-6 text-sm sm:text-base">
                <p><span className="font-semibold">Name:</span> {selectedStudent.name}</p>
                <p><span className="font-semibold">Email:</span> {selectedStudent.email}</p>
                <p><span className="font-semibold">Phone:</span> {selectedStudent.phone || "N/A"}</p>
                <p><span className="font-semibold">Course:</span> {selectedStudent.course}</p>
                <p><span className="font-semibold">Institute:</span> {selectedStudent.institute || "N/A"}</p>
                <p><span className="font-semibold">Session:</span> {selectedStudent.session || "N/A"}</p>
                <p><span className="font-semibold">Qualification:</span> {selectedStudent.qualification || "N/A"}</p>
                <p><span className="font-semibold">DOB:</span> {selectedStudent.dob || "N/A"}</p>
                <p><span className="font-semibold">Gender:</span> {selectedStudent.gender || "N/A"}</p>
                <p className="col-span-2"><span className="font-semibold">Address:</span> {selectedStudent.address || "N/A"}</p>
                {selectedStudent.message && (
                  <p className="col-span-2"><span className="font-semibold">Message:</span> {selectedStudent.message}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 sm:gap-4">
                <button
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete this application?")) {
                      try {
                        await deleteDoc(doc(db, "Admissions", selectedStudent.id));
                        setAdmissions((prev) => prev.filter((s) => s.id !== selectedStudent.id));
                        setSelectedStudent(null);
                        alert("Application deleted successfully!");
                      } catch (error) {
                        console.error("Error deleting application:", error);
                        alert("Failed to delete application.");
                      }
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
