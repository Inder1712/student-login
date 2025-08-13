"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); // Prevents early redirect flicker

  // ✅ Fixed admin credentials
  const FIXED_ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID;
  const FIXED_ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
      if (isAdminLoggedIn === "tfrue") {
        router.replace("/AdminPanel");
      } else {
        setCheckingAuth(false);
      }
    }
  }, [router]);

  // ✅ Handle form submit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (adminId === FIXED_ADMIN_ID && password === FIXED_ADMIN_PASSWORD) {
      localStorage.setItem("isAdminLoggedIn", "true");
      router.replace("/AdminPanel");
    } else {
      setError("Invalid Admin ID or Password");
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Checking admin session...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 text-gray-800">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Admin Login
        </h1>

        {error && (
          <p className="text-red-600 bg-red-100 px-4 py-2 rounded mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="adminId" className="block text-sm font-medium mb-1">
              Admin ID
            </label>
            <input
              id="adminId"
              type="text"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="Enter Admin ID"
              required
              className="w-full px-4 py-2 border rounded text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
              className="w-full px-4 py-2 border rounded text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 rounded transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
      </div>
    </div>
  );
}
