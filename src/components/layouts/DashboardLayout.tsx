"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { useSession } from "@/lib/auth-client";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession();
  const user = session?.user;

  const sidebarLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/bookingDash", label: "Appointments" },
    // Add more links as needed
  ];

  return (
    <div className="flex min-h-screen bg-theme-accent-secondary">
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