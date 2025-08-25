"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/");
        return;
      }
      setAuthorized(true);
      setChecking(false);
    });

    return () => unsub();
  }, [router]);

  // 🚫 Don’t render children until auth is confirmed
  if (checking) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Checking session…
      </div>
    );
  }

  // ✅ Only render if authorized
  return authorized ? <>{children}</> : null;
}
