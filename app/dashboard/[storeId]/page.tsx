import { redirect } from "next/navigation";
import { currentUser } from "@/lib/helpers/current-user";
import { getBranches } from "@/lib/actions/branch.actions";
import StoreRedirect from "./_components/StoreRedirect";

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

    const branches = await getBranches(storeId);

    if (!branches || branches.length === 0) {
        redirect(`/setup/${storeId}/branch`);
    }

    return <StoreRedirect storeId={storeId} branches={branches} />;
}