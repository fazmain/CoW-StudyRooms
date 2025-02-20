// This is the root layout component that wraps all pages in the Next.js application

// Import necessary dependencies
import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Import Inter font from Google Fonts
import { Toaster } from "@/components/ui/toaster"; // Toast notification component

// Initialize Inter font with Latin character subset
const inter = Inter({ subsets: ["latin"] });

// Define metadata for SEO and page information
export const metadata: Metadata = {
  title: "CoW Study Room Finder",
  description: "Find available study rooms at The College of Wooster",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

// Root layout component that wraps all pages
export default function RootLayout({
  children, // children represents the page content
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Include Leaflet CSS for map functionality */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
          crossOrigin=""
        />
      </head>
      {/* Apply Inter font and dark theme colors to body */}
      <body className={`${inter.className} bg-gray-900 text-white`}>
        {children}
        <Toaster /> {/* Toast notifications container */}
      </body>
    </html>
  );
}

import "./globals.css";
