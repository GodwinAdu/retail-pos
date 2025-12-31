import SalesClient from "./SalesClient";
import { getSales, getSaleStats } from "@/lib/actions/sale.actions";

interface SalesPageProps {
    params: Promise<{
        storeId: string;
        branchId: string;
    }>;
}

export default async function SalesPage({ params }: SalesPageProps) {
    const { storeId, branchId } = await params;

    const [sales, stats] = await Promise.all([
        getSales(storeId, branchId, 50),
        getSaleStats(storeId, branchId)
    ]);

    return (
        <SalesClient 
            storeId={storeId}
            branchId={branchId}
            initialSales={sales}
            initialStats={stats}
        />
    );
}