// src/components/ImpersonationFloatingButton.tsx
"use client";

import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { stopImpersonating } from "@/services/AdminServices";
import { UserIcon } from "lucide-react";

export function ImpersonationFloatingButton() {
  const { data } = useSession();
  
  // The impersonation info is in data.session.impersonatedBy
  const isImpersonating = data?.session?.impersonatedBy;
  
  if (!isImpersonating) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        onClick={() => stopImpersonating()}
        variant="destructive"
        className="flex items-center gap-2 shadow-lg"
      >
        <UserIcon size={16} />
        End Impersonation
      </Button>
    </div>
  );
}