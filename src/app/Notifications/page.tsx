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
import ProtectedRoute from "../components/ProtectedRoute";
import AdminLayout from "../components/AdminLayout";

type Notification = {
  id?: string;
  heading: string;
  description: string;
  link?: string;
  createdAt?: Timestamp; // Firestore Timestamp
};

export default function NotificationsPage() {
  const router = useRouter(); // ✅ FIXED: added router hook

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newNotification, setNewNotification] = useState<Notification>({
    heading: "",
    description: "",
    link: "",
  });
  
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<Notification>({
    heading: "",
    description: "",
    link: "",
  });

  // ✅ Protect route (only allow if logged in)
const pathname=usePathname()
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminUser") === "true";

    if (isLoggedIn && pathname === "/AdminPanel") {
      router.replace("/Notifications");
    }
    setChecking(false);
  }, [router, pathname]);

  // ✅ Real-time listener with ordering
  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Notification[];
      setNotifications(data);
    });

    return () => unsub();
  }, []);

  // ✅ Add new notification
  const addNotification = async () => {
    if (!newNotification.heading.trim() || !newNotification.description.trim())
      return;

    await addDoc(collection(db, "notifications"), {
      heading: newNotification.heading,
      description: newNotification.description,
      link: newNotification.link || "",
      createdAt: serverTimestamp(),
    });

    setNewNotification({ heading: "", description: "", link: "" });
  };

  // ✅ Delete
  const deleteNotification = async (id?: string) => {
    if (!id) return;
    await deleteDoc(doc(db, "notifications", id));
  };

  // ✅ Start editing
  const startEditing = (index: number) => {
    setEditIndex(index);
    setEditData(notifications[index]);
  };

  // ✅ Save edit
  const saveEdit = async () => {
    if (editIndex === null) return;
    const current = notifications[editIndex];
    if (!current?.id) return;

    await updateDoc(doc(db, "notifications", current.id), {
      heading: editData.heading,
      description: editData.description,
      link: editData.link || "",
    });

    setEditIndex(null);
    setEditData({ heading: "", description: "", link: "" });
  };

  return (
    <ProtectedRoute>
      <AdminLayout>

    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">📢 Notifications</h1>

      {/* Add Notification */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Notification</h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={newNotification.heading}
            onChange={(e) =>
              setNewNotification({ ...newNotification, heading: e.target.value })
            }
            placeholder="Heading"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            value={newNotification.description}
            onChange={(e) =>
              setNewNotification({
                ...newNotification,
                description: e.target.value,
              })
            }
            placeholder="Description"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={3}
          />
          <input
            type="url"
            value={newNotification.link}
            onChange={(e) =>
              setNewNotification({ ...newNotification, link: e.target.value })
            }
            placeholder="Optional link (https://...)"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={addNotification}
            disabled={
              !newNotification.heading.trim() ||
              !newNotification.description.trim()
            }
            className="bg-indigo-600 disabled:opacity-50 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
            Add
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">All Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications yet.</p>
        ) : (
          <ul className="space-y-6">
            {notifications.map((note, index) => (
              <li
                key={note.id}
                className="border-b pb-4 last:border-none flex flex-col gap-2"
              >
                {editIndex === index ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={editData.heading}
                      onChange={(e) =>
                        setEditData({ ...editData, heading: e.target.value })
                      }
                      className="border rounded px-3 py-1"
                      placeholder="Heading"
                    />
                    <textarea
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                      className="border rounded px-3 py-1"
                      placeholder="Description"
                      rows={2}
                      />
                    <input
                      type="url"
                      value={editData.link}
                      onChange={(e) =>
                        setEditData({ ...editData, link: e.target.value })
                      }
                      className="border rounded px-3 py-1"
                      placeholder="Link"
                      />
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
                    <h3 className="text-lg font-bold text-indigo-700">
                      {note.heading}
                    </h3>
                    <p className="text-gray-700">{note.description}</p>
                    {note.link && (
                      <a
                      href={note.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-red-600 underline break-all"
                      >
                        {note.link}
                      </a>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => startEditing(index)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteNotification(note.id)}
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
                      </ProtectedRoute>
  );
}
