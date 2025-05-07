"use client";

import { useSession } from "@/lib/auth-client";
import { AdminDashboard } from "@/components/AdminDashboard";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      
      {session && (
        <div>
          <p>Welcome, {session.user.name || session.user.email}!</p>
          <p>You are logged in as an {session.user.role}.</p>
        </div>
      )}

      <AdminDashboard />
    </div>
  );
}
