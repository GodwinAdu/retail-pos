import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/helpers/current-user";

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