import { SettingsProvider } from "@/lib/contexts/SettingsContext";

interface DashboardLayoutProps {
    children: React.ReactNode;
    params: Promise<{ storeId: string; branchId: string }>;
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
    const { storeId, branchId } = await params;
    return (
        <SettingsProvider branchId={branchId}>
            <div className="w-full">
                {children}
            </div>
        </SettingsProvider>
    );
}