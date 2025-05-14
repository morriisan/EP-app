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
    { href: "/dashboard/appointments", label: "Appointments" },
    { href: "/dashboard/settings", label: "Settings" },
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