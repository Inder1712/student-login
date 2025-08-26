"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const ok = typeof window !== "undefined" && localStorage.getItem("isLoggedIn") === "true";
    if (!ok) {
      router.replace("/");
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Checking access…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
     

      {/* Main */}
      <main className="pt-2 px-6">{children}</main>
    </div>
  );
}
