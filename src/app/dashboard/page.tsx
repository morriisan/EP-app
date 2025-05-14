"use client";

import { useSession } from "@/lib/auth-client";
import { AdminDashboard } from "@/components/AdminDashboard";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="p-0">
      {session && (


      <DashboardLayout>
      <AdminDashboard />
      </DashboardLayout>
          
        
      )}
      
    </div>
  );
}
