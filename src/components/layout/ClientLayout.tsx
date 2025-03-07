'use client';

import { usePathname } from "next/navigation";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/chat/ChatWidget";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Navigation />}
      <main className="min-h-screen">
        {children}
      </main>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <ChatWidget />}
    </>
  );
} 