"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  // undefined = still checking, null = no user, User = logged in

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null);
    });
    return () => unsub();
  }, []);

  if (user === undefined) {
    // ✅ Don’t redirect yet, just show loading until Firebase finishes
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  if (user === null) {
    // ✅ Only redirect once we *know* there is no user
    router.replace("/SignIn");
    return null;
  }

  // ✅ Logged in
  return <>{children}</>;
}
