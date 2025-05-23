"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { useSession } from "@/lib/auth-client";

interface MyPageLayoutProps {
  children: ReactNode;
}

export function MyPageLayout({ children }: MyPageLayoutProps) {
  const { data: session } = useSession();
  const user = session?.user;

  const sidebarLinks = [
    { href: "/myPage", label: "Bookmarkes" },
    { href: "/myPage/booking", label: "My Bookings" },
    { href: "/myPage/history", label: "Booking History" },
    // Add more links as needed
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        links={sidebarLinks} 
        userName={user?.name} 
        userEmail={user?.email}
      />
      
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
} 