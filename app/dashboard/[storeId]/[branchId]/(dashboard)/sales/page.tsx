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

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const today = new Date();

    const [sales, stats] = await Promise.all([
        getSales(storeId, branchId, 50, oneMonthAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]),
        getSaleStats(storeId, branchId, oneMonthAgo.toISOString().split('T')[0], today.toISOString().split('T')[0])
    ]);

    console.log('SalesPage sales count:', sales.length);
    console.log('SalesPage stats:', stats);
    
    console.log('SalesPage params:', { storeId, branchId });

    return (
        <SalesClient 
            storeId={storeId}
            branchId={branchId}
            initialSales={sales}
            initialStats={stats}
        />
    );
}