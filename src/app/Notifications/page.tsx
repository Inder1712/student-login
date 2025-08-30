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
import imageCompression from "browser-image-compression";

type Notification = {
  id?: string;
  heading: string;
  description: string;
  link?: string;
  image?: string; // base64 image string
  createdAt?: Timestamp;
};

// helper function to convert file -> base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
  });
}

// compress + convert to base64
async function compressAndConvert(file: File): Promise<string> {
  const compressedFile = await imageCompression(file, {
    maxSizeMB: 0.2, // 200KB max
    maxWidthOrHeight: 800, // resize if needed
    useWebWorker: true,
  });
  return await fileToBase64(compressedFile);
}

export default function NotificationsPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newNotification, setNewNotification] = useState<Notification>({
    heading: "",
    description: "",
    link: "",
    image: "",
  });

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<Notification>({
    heading: "",
    description: "",
    link: "",
    image: "",
  });

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminUser") === "true";
    if (isLoggedIn && pathname === "/AdminPanel") {
      router.replace("/Notifications");
    }
    setChecking(false);
  }, [router, pathname]);

  // Real-time listener
  useEffect(() => {
    const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Notification[];
      setNotifications(data);
    });
    return () => unsub();
  }, []);

  // Add new notification
  const addNotification = async () => {
    if (!newNotification.heading.trim() || !newNotification.description.trim()) return;

    await addDoc(collection(db, "notifications"), {
      heading: newNotification.heading,
      description: newNotification.description,
      link: newNotification.link || "",
      image: newNotification.image || "",
      createdAt: serverTimestamp(),
    });

    setNewNotification({ heading: "", description: "", link: "", image: "" });
  };

  // Delete
  const deleteNotification = async (id?: string) => {
    if (!id) return;
    await deleteDoc(doc(db, "notifications", id));
  };

  // Start editing
  const startEditing = (index: number) => {
    setEditIndex(index);
    setEditData(notifications[index]);
  };

  // Save edit
  const saveEdit = async () => {
    if (editIndex === null) return;
    const current = notifications[editIndex];
    if (!current?.id) return;

    await updateDoc(doc(db, "notifications", current.id), {
      heading: editData.heading,
      description: editData.description,
      link: editData.link || "",
      image: editData.image || "",
    });

    setEditIndex(null);
    setEditData({ heading: "", description: "", link: "", image: "" });
  };

  return (
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
              onChange={(e) => setNewNotification({ ...newNotification, heading: e.target.value })}
              placeholder="Heading"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              value={newNotification.description}
              onChange={(e) =>
                setNewNotification({ ...newNotification, description: e.target.value })
              }
              placeholder="Description"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
            <input
              type="url"
              value={newNotification.link}
              onChange={(e) => setNewNotification({ ...newNotification, link: e.target.value })}
              placeholder="Optional link (https://...)"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div>
              <label className="bg-slate-100 hover:bg-slate-200 rounded-2xl p-2 cursor-pointer text-gray-800 mt-8">
                {newNotification.image ? "Change Image" : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      const compressedBase64 = await compressAndConvert(e.target.files[0]);
                      setNewNotification({ ...newNotification, image: compressedBase64 });
                    }
                  }}
                />
              </label>

              {newNotification.image && (
                <img
                  src={newNotification.image}
                  alt="preview"
                  className="w-32 h-32 object-cover mt-2"
                />
              )}
            </div>

            <button
              onClick={addNotification}
              disabled={!newNotification.heading.trim() || !newNotification.description.trim()}
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
                <li key={note.id} className="border-b pb-4 last:border-none flex flex-col gap-2">
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
                        type="url"
                        value={editData.link}
                        onChange={(e) => setEditData({ ...editData, link: e.target.value })}
                        className="border rounded px-3 py-1"
                        placeholder="Link"
                      />
                      <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100">
                        {editData.image ? (
                          <img
                            src={editData.image}
                            alt="preview"
                            className="w-32 h-32 object-cover"
                          />
                        ) : (
                          <span className="text-gray-500">Click to upload</span>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden "
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              const compressedBase64 = await compressAndConvert(e.target.files[0]);
                              setEditData({ ...editData, image: compressedBase64 });
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
                      <h3 className="text-lg font-bold text-indigo-700">{note.heading}</h3>
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
                      {note.image && (
                        <img
                          src={note.image}
                          alt="notification"
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
  );
}
