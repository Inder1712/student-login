"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(undefined); 
  // undefined = loading, null = no user, User = logged in

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null);
    });
    return () => unsub();
  }, []);

  // Still checking session
  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  // Not logged in
  if (user === null) {
    router.replace("/SignIn");
    return null;
  }

  // Logged in ✅
  return <>{children}</>;
}
