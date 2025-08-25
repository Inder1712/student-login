"use client";

import { useEffect, useState } from "react";
import { useRouter,usePathname } from "next/navigation";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
    const pathname = usePathname();

  // If already signed in, go straight to AdminPanel
 useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      // ✅ Only redirect to /AdminPanel if already logged in *and* currently on login page
      if (user && pathname === "/AdminLogin") {
        router.replace("/AdminPanel");
      }
      setChecking(false);
    });
    return () => unsub();
  }, [router, pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/AdminPanel");
    } catch (err: any) {
      const code = err?.code as string | undefined;
      if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        setError("Invalid email or password.");
      } else if (code === "auth/user-not-found") {
        setError("No user found with this email.");
      } else {
        setError("Login failed. Please try again.");
      }
      setLoading(false);
    }
  };

  if (checking) return <div className="min-h-screen flex items-center justify-center">Checking session…</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 text-gray-800">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-500 mb-6">Admin Login</h1>

        {error && <p className="text-red-600 bg-red-100 px-4 py-2 rounded mb-4 text-center">{error}</p>}

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
