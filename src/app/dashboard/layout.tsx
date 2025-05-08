import { requireAdmin } from "@/lib/auth-utils"

export default async function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    // This will either return the session or redirect if not admin
    await requireAdmin();
    
    return <>{children}</>;
  }




