// src/app/admissions-list/page.tsx
"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AdminLayout from "../components/AdminLayout";

interface Admission {
  id: string;
  name: string;
  email: string;
  course: string;
  message?: string;
  createdAt?: Timestamp;
  dob?: string;
  gender?: string;
  address?: string;
  phone?: string;
  qualification?: string;
}

export default function AdmissionsListPage() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
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
            id: doc.id, // always assign last so it doesn't get overwritten
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

  if (checking) return null;

  return (
    <AdminLayout>
      <div className="bg-slate-50 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white pt-2 pb-2 px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Student Applications</h1>
          <p className="max-w-2xl mx-auto text-lg">
            Review all student admissions submitted through the online form.
          </p>
        </section>

        {/* Cards Section */}
        <section className="max-w-5xl mx-auto py-12 px-6">
          {loading ? (
            <p className="text-center text-gray-600">Loading applications...</p>
          ) : admissions.length === 0 ? (
            <p className="text-center text-gray-600">No applications found.</p>
          ) : (
            <div className="space-y-5">
              {admissions.map((admission) => {
                const appliedDate = admission.createdAt
                  ? admission.createdAt.toDate().toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A";

                return (
                  <div
                    key={admission.id}
                    className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
                  >
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {admission.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Applied on: {appliedDate}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <p className="text-gray-700">
                        <span className="font-semibold">Email:</span>{" "}
                        {admission.email}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Phone:</span>{" "}
                        {admission.phone || "N/A"}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Course:</span>{" "}
                        {admission.course}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Qualification:</span>{" "}
                        {admission.qualification || "N/A"}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">DOB:</span>{" "}
                        {admission.dob || "N/A"}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Gender:</span>{" "}
                        {admission.gender || "N/A"}
                      </p>
                      <p className="text-gray-700 col-span-2">
                        <span className="font-semibold">Address:</span>{" "}
                        {admission.address || "N/A"}
                      </p>
                      {admission.message && (
                        <p className="text-gray-700 col-span-2">
                          <span className="font-semibold">Message:</span>{" "}
                          {admission.message}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
