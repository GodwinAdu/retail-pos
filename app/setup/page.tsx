import { getCurrentUser } from "@/lib/utils/auth";
import { redirect } from "next/navigation";


export default async function SetupRootPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    if (!user.storeId) {
        redirect("/sign-up");
    }

    redirect(`/setup/${user.storeId}`);
}