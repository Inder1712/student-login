"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminUser") === "true";
    if (!isLoggedIn) {
      router.replace("/AdminLogin");
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking authentication…
      </div>
    );
  }

  return <>{children}</>;
}
