import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import { Providers } from "@/app/_providers/client/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next YNAB Assistant",
  description: "A personal helper for budgeting needs.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
