"use client";

import { useSession } from "@/lib/auth-client";
import { AuthPanel } from "./AuthPanel";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { data: session, isPending } = useSession();
  
  // If the session is still loading, show a loading state
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary">  
          
        </div>
      </div>
    );
  }

  // If authenticated, check if admin is required
  if (session) {
    if (requireAdmin && session.user.role !== "admin") {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
          <p className="mb-6">You need admin privileges to access this page.</p>
          <AuthPanel 
          trigger={<Button size="lg">Sign In</Button>}
          />
        </div>
      );
    }
    return <>{children}</>;
  }

  // If not authenticated, show the auth panel
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
      <p className="mb-6">You need to sign in to access this page.</p>
      <AuthPanel 
        trigger={<Button size="lg">Sign In</Button>}
      />
    </div>
  );
} 