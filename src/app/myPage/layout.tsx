import { requireAuth } from "@/lib/auth-utils";
import { MyPageLayout as PageLayout } from "@/components/layouts/MyPageLayout";

export default async function MyPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    void await requireAuth();
    return <PageLayout>{children}</PageLayout>;
}

