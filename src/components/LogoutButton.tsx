"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        }
      }
    });
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleLogout}
      className="text-red-500 border-red-500 hover:bg-red-50"
    >
      Logout
    </Button>
  );
} 