"use client"

import ProductsForm from "./_components/ProductsForm";

interface ProductsSetupPageProps {
    params: Promise<{
        storeId: string;
    }>;
}

export default async function ProductsSetupPage({ params }: ProductsSetupPageProps) {
    const { storeId } = await params;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
                <ProductsForm storeId={storeId} />
            </div>
        </div>
    );
}