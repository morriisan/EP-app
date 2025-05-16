import { requireAuth } from "@/lib/auth-utils";

export default async function MyPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    void await requireAuth();
    return <>{children}</>;
}

