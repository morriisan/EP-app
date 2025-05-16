import { requireAdmin } from "@/lib/auth-utils";

export default async function UploaderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
     await requireAdmin();
    return <>{children}</>;
}

