"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Optional: reset flag when SignIn mounts
  useEffect(() => {
    localStorage.setItem("isLoggedIn", "false");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (
        email === process.env.NEXT_PUBLIC_ADMIN_ID &&
        password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      ) {
        localStorage.setItem("isLoggedIn", "true");
        router.replace("/AdminPanel"); // go to your first admin page
      } else {
        localStorage.setItem("isLoggedIn", "false");
        setError("Invalid email or password.");
        setLoading(false);
      }
    } catch {
      localStorage.setItem("isLoggedIn", "false");
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 text-gray-800">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-500 mb-6">
          Admin Login
        </h1>

        {error && (
          <p className="text-red-600 bg-red-100 px-4 py-2 rounded mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="admin@yourapp.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-blue-800 text-white font-medium py-2 rounded transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
