"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

type Props = { children: ReactNode };

export default function ProtectedRoute({ children }: Props) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/"); // unify route names
      }
      setChecking(false);
    });
    return () => unsub();
  }, [router]);

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center">Checking…</div>;
  }

  return <>{children}</>;
}
