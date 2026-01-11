import { getBranches } from "@/lib/actions/branch.actions";
import { currentUser } from "@/lib/helpers/current-user";
import { redirect } from "next/navigation";
import BranchesClient from "./BranchesClient";

interface BranchesPageProps {
    params: Promise<{
        storeId: string;
    }>;
}

export default async function BranchesPage({ params }: BranchesPageProps) {
    const { storeId } = await params;
    const user = await currentUser();
    
    if (!user || user.role !== "owner") {
        redirect(`/dashboard/${storeId}`);
    }
    
    const branches = await getBranches(storeId);

    return <BranchesClient storeId={storeId} branches={branches} />;
}