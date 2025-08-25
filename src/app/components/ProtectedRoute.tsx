"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      // Firebase has finished checking
      setUser(firebaseUser ?? null);
    });
    return () => unsub();
  }, []);

  if (user === undefined) {
    // Still loading, don’t redirect yet
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  if (user === null) {
    // Redirect AFTER Firebase has confirmed no user
    router.replace("/SignIn");
    return null;
  }

  return <>{children}</>;
}
