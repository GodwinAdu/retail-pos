import { getStaffMembers, getStaffStats } from "@/lib/actions/staff.actions";
import { getCurrentUser } from "@/lib/utils/auth";
import StaffPageClient from "./StaffPageClient";

interface StaffPageProps {
    params: Promise<{
        storeId: string;
        branchId: string;
    }>;
}

export default async function StaffPage({ params }: StaffPageProps) {
    const { storeId, branchId } = await params;

    const [staff, stats, user] = await Promise.all([
        getStaffMembers(storeId, branchId),
        getStaffStats(storeId, branchId),
        getCurrentUser()
    ]);

    return (
        <StaffPageClient 
            storeId={storeId} 
            branchId={branchId} 
            staff={staff} 
            stats={stats}
            user={user}
        />
    );
}