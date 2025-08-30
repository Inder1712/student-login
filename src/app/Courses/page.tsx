// src/app/courses/page.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import AdminLayout from "../components/AdminLayout";

// Course type
type Course = {
  id?: string;
  heading: string;
  description: string;
  photo?: string; // base64 string
  price?: number;
  rating?: number;
  createdAt?: Timestamp;
};

// helper: convert file to base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
  });
}

export default function CoursesPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState<Course>({
    heading: "",
    description: "",
    photo: "",
    price: 0,
    rating: 0,
  });

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<Course>({
    heading: "",
    description: "",
    photo: "",
    price: 0,
    rating: 0,
  });

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminUser") === "true";
    if (isLoggedIn && pathname === "/AdminPanel") {
      router.replace("/Courses");
    }
    setChecking(false);
  }, [router, pathname]);

  // Real-time listener
  useEffect(() => {
    const q = query(collection(db, "courses"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Course[];
      setCourses(data);
    });
    return () => unsub();
  }, []);

  // Add course
  const addCourse = async () => {
    if (!newCourse.heading.trim() || !newCourse.description.trim()) return;

    await addDoc(collection(db, "courses"), {
      heading: newCourse.heading,
      description: newCourse.description,
      photo: newCourse.photo || "",
      price: newCourse.price || 0,
      rating: newCourse.rating || 0,
      createdAt: serverTimestamp(),
    });

    setNewCourse({ heading: "", description: "", photo: "", price: 0, rating: 0 });
  };

  // Delete course
  const deleteCourse = async (id?: string) => {
    if (!id) return;
    await deleteDoc(doc(db, "courses", id));
  };

  // Start editing
  const startEditing = (index: number) => {
    setEditIndex(index);
    setEditData(courses[index]);
  };

  // Save edit
  const saveEdit = async () => {
    if (editIndex === null) return;
    const current = courses[editIndex];
    if (!current?.id) return;

    await updateDoc(doc(db, "courses", current.id), {
      heading: editData.heading,
      description: editData.description,
      photo: editData.photo || "",
      price: editData.price || 0,
      rating: editData.rating || 0,
    });

    setEditIndex(null);
    setEditData({ heading: "", description: "", photo: "", price: 0, rating: 0 });
  };

  if (checking) return null;

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">📚 Courses</h1>

        {/* Add Course */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Course</h2>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={newCourse.heading}
              onChange={(e) => setNewCourse({ ...newCourse, heading: e.target.value })}
              placeholder="Course Heading"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              value={newCourse.description}
              onChange={(e) =>
                setNewCourse({ ...newCourse, description: e.target.value })
              }
              placeholder="Course Description"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
            <label htmlFor="">Price</label>
            <input
              type="number"
              value={newCourse.price}
              onChange={(e) =>
                setNewCourse({ ...newCourse, price: Number(e.target.value) })
              }
              placeholder="Price"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <label htmlFor="">Rating</label>
            <input
              type="number"
              value={newCourse.rating}
              min={0}
              max={5}
              step={0.1}
              onChange={(e) =>
                setNewCourse({ ...newCourse, rating: Number(e.target.value) })
              }
              placeholder="Rating (0-5)"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div>
              <label className="bg-slate-100 hover:bg-slate-200 rounded-2xl p-2 cursor-pointer text-gray-800">
                {newCourse.photo ? "Change Photo" : "Upload Photo"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      const base64 = await fileToBase64(e.target.files[0]);
                      setNewCourse({ ...newCourse, photo: base64 });
                    }
                  }}
                />
              </label>

              {newCourse.photo && (
                <img
                  src={newCourse.photo}
                  alt="preview"
                  className="w-32 h-32 object-cover mt-2 rounded"
                />
              )}
            </div>

            <button
              onClick={addCourse}
              disabled={!newCourse.heading.trim() || !newCourse.description.trim()}
              className="bg-indigo-600 disabled:opacity-50 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">All Courses</h2>
          {courses.length === 0 ? (
            <p className="text-gray-500">No courses yet.</p>
          ) : (
            <ul className="space-y-6">
              {courses.map((course, index) => (
                <li key={course.id} className="border-b pb-4 last:border-none flex flex-col gap-2">
                  {editIndex === index ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={editData.heading}
                        onChange={(e) => setEditData({ ...editData, heading: e.target.value })}
                        className="border rounded px-3 py-1"
                        placeholder="Heading"
                      />
                      <textarea
                        value={editData.description}
                        onChange={(e) =>
                          setEditData({ ...editData, description: e.target.value })
                        }
                        className="border rounded px-3 py-1"
                        placeholder="Description"
                        rows={2}
                      />
                      <input
                        type="number"
                        value={editData.price}
                        onChange={(e) =>
                          setEditData({ ...editData, price: Number(e.target.value) })
                        }
                        placeholder="Price"
                        className="border rounded px-3 py-1"
                      />
                      <input
                        type="number"
                        value={editData.rating}
                        min={0}
                        max={5}
                        step={0.1}
                        onChange={(e) =>
                          setEditData({ ...editData, rating: Number(e.target.value) })
                        }
                        placeholder="Rating (0-5)"
                        className="border rounded px-3 py-1"
                      />

                      <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100">
                        {editData.photo ? (
                          <img
                            src={editData.photo}
                            alt="preview"
                            className="w-32 h-32 object-cover rounded"
                          />
                        ) : (
                          <span className="text-gray-500">Click to upload</span>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              const base64 = await fileToBase64(e.target.files[0]);
                              setEditData({ ...editData, photo: base64 });
                            }
                          }}
                        />
                      </label>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={saveEdit}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditIndex(null)}
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-bold text-indigo-700">{course.heading}</h3>
                      <p className="text-gray-700">{course.description}</p>
                      <p className="text-sm text-gray-600">💰 Price: ₹{course.price}</p>
                      <p className="text-sm text-gray-600">⭐ Rating: {course.rating}</p>
                      {course.photo && (
                        <img
                          src={course.photo}
                          alt="course"
                          className="w-40 h-40 object-cover mt-2 rounded"
                        />
                      )}
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => startEditing(index)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCourse(course.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
