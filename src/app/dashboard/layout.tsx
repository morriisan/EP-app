import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { requireAdmin } from "@/lib/auth-utils";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  void await requireAdmin();
  return <DashboardLayout>{children}</DashboardLayout>;
} 