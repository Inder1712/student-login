"use client";

import { usePathname } from "next/navigation";
import SignInPage from "../SignIn/page";
 // Adjust path if needed

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/" ? <SignInPage /> : children}
    </>
  );
}
