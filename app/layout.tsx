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
  title: "College of Wooster Study Rooms",
  description: "Track the occupancy of study rooms at the College of Wooster",
  generator: "v0.dev",
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
