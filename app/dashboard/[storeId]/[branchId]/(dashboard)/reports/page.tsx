import ReportsClient from "./ReportsClient";
import { getReportStats, getSalesChart, getCategoryStats } from "@/lib/actions/report.actions";

interface ReportsPageProps {
    params: Promise<{
        storeId: string;
        branchId: string;
    }>;
}

export default async function ReportsPage({ params }: ReportsPageProps) {
    const { storeId, branchId } = await params;

    const [stats, salesChart, categoryStats] = await Promise.all([
        getReportStats(storeId, branchId),
        getSalesChart(storeId, branchId),
        getCategoryStats(storeId, branchId)
    ]);

    return (
        <ReportsClient 
            storeId={storeId}
            branchId={branchId}
            initialStats={stats}
            initialSalesChart={salesChart}
            initialCategoryStats={categoryStats}
        />
    );
}