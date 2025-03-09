'use client';

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/chat/ChatWidget";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAdminPage, setIsAdminPage] = useState(false);
  
  // Check if we're on an admin page based on the pathname
  useEffect(() => {
    // Check both the pathname and the admin-route class
    const isAdmin = pathname?.startsWith('/admin') || 
                   document.documentElement.classList.contains('admin-route');
    setIsAdminPage(isAdmin);
    
    // Add event listener for navigation changes
    const handleRouteChange = () => {
      const isAdminRoute = pathname?.startsWith('/admin') || 
                          document.documentElement.classList.contains('admin-route');
      setIsAdminPage(isAdminRoute);
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [pathname]);

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