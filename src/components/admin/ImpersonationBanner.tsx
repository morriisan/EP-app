import { Button } from "@/components/ui/button";

interface ImpersonationBannerProps {
  onStopImpersonating: () => Promise<void>;
}

export function ImpersonationBanner({ onStopImpersonating }: ImpersonationBannerProps) {
  return (
    <div className="bg-yellow-100 p-4 rounded-md mb-6 flex justify-between items-center">
      <p className="text-yellow-800">
        You are currently impersonating a user. Any actions you take will be as this user.
      </p>
      <Button variant="outline" onClick={onStopImpersonating}>
        Stop Impersonating
      </Button>
    </div>
  );
} 