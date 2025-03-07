import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Real Estate UAE",
  description: "Find your dream property in UAE",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
