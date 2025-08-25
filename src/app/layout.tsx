import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import ClientWrapper from "./components/ClientWrapper"; // NEW

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DIEIT",
  description: "Admin Pannel Of Dream Institute of Education and Information Technology",
  icons: {
    icon: "/favicon.ico",        // Standard browser favicon
    shortcut: "/favicon.ico",    // For older browsers
    apple: "/logo.png",          // iOS/Apple devices
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
