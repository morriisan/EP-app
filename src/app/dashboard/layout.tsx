'use client';

import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useSession } from "@/lib/auth-client";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
} 