import { redirect } from "next/navigation";
import { currentUser } from "@/lib/helpers/current-user";
import { getBranches } from "@/lib/actions/branch.actions";

interface StorePageProps {
    params: Promise<{
        storeId: string;
    }>;
}

export default async function StorePage({ params }: StorePageProps) {
    const { storeId } = await params;
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    if (user.storeId !== storeId) {
        redirect(`/dashboard/${user.storeId}`);
    }

    // Get branches for this store
    const branches = await getBranches(storeId);

    if (branches.length === 0) {
        redirect(`/setup/${storeId}/branch`);
    }

    // Redirect to first branch dashboard
    redirect(`/dashboard/${storeId}/${branches[0]._id}`);
}