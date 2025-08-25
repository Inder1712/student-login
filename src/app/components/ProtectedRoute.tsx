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
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/"); // go to login
      } else {
        setAuthorized(true);
      }
      setChecking(false); // ✅ only after Firebase answers
    });

    return () => unsub();
  }, [router]);

  if (checking) {
    // 🚫 Don't show admin UI at all
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Checking session…
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}
