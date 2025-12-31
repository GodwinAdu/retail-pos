import CustomersClient from "./CustomersClient";
import { getCustomers, getCustomerStats } from "@/lib/actions/customer.actions";

interface CustomersPageProps {
    params: Promise<{
        storeId: string;
        branchId: string;
    }>;
}

export default async function CustomersPage({ params }: CustomersPageProps) {
    const { storeId, branchId } = await params;

    const [customers, stats] = await Promise.all([
        getCustomers(storeId),
        getCustomerStats(storeId)
    ]);

    return (
        <CustomersClient 
            storeId={storeId}
            branchId={branchId}
            initialCustomers={customers}
            initialStats={stats}
        />
    );
}