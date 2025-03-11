"use client";

import { useSession } from "@/lib/auth-client";
import { LogoutButton } from "@/components/LogoutButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function Dashboard() {
  const { data: session } = useSession();
  

  return (
    <ProtectedRoute>
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      
      {session ? (
        <div>
          <p>Welcome, {session.user.name || session.user.email}!</p>
          <p>You are logged in.</p>
        </div>
      ) : (
        <p>Loading session...</p>
      )}

    <LogoutButton />

    </div>
    </ProtectedRoute>
  );
}
