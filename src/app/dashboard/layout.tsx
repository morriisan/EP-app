import { requireAdmin } from "@/lib/auth-utils"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/nav/SidebarNav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will either return the session or redirect if not admin
  await requireAdmin();
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="relative flex min-h-screen">
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center gap-4 border-b px-4 py-2">
            <SidebarTrigger />
            <h1 className="font-semibold">Dashboard</h1>
          </div>
          <div className="p-4">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

  


