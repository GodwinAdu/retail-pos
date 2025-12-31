"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Settings, Receipt, CreditCard, Percent, Users, Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { getBranches } from "@/lib/actions/branch.actions";
import { updatePOSSettings } from "@/lib/actions/pos-settings.actions";

interface POSSettingsFormProps {
    storeId: string;
}

export default function POSSettingsForm({ storeId }: POSSettingsFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    
    const [settings, setSettings] = useState({
        autoReceiptPrint: true,
        showItemImages: true,
        quickPayEnabled: true,
        taxIncluded: false,
        defaultTaxRate: 0.15,
        allowDiscounts: true,
        maxDiscountPercent: 20,
        requireCustomerInfo: false,
        soundEffects: true,
        compactMode: false,
        barcodeScanning: true,
        inventoryTracking: true,
        loyaltyProgram: false,
        multiCurrency: false,
    });

    const handleSettingChange = (key: string, value: boolean | number) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSaveSettings = async () => {
        try {
            setIsLoading(true);
            setError("");

            // Get the first branch for this store
            const branches = await getBranches(storeId);
            if (branches.length === 0) {
                throw new Error("No branch found. Please create a branch first.");
            }

            const branchId = branches[0].id;
            
            await updatePOSSettings({
                branchId,
                ...settings
            });

            router.push(`/dashboard/${storeId}/${branchId}`);
        } catch (error: any) {
            setError(error.message || "Failed to save settings");
        } finally {
            setIsLoading(false);
        }
    };

    const settingsGroups = [
        {
            title: "Receipt & Printing",
            icon: Receipt,
            settings: [
                { key: "autoReceiptPrint", label: "Auto-print receipts", type: "switch" },
                { key: "showItemImages", label: "Show item images on receipt", type: "switch" },
            ]
        },
        {
            title: "Payment & Checkout",
            icon: CreditCard,
            settings: [
                { key: "quickPayEnabled", label: "Enable quick pay buttons", type: "switch" },
                { key: "barcodeScanning", label: "Barcode scanning", type: "switch" },
            ]
        },
        {
            title: "Tax & Discounts",
            icon: Percent,
            settings: [
                { key: "taxIncluded", label: "Tax included in prices", type: "switch" },
                { key: "defaultTaxRate", label: "Default tax rate (%)", type: "number", min: 0, max: 100, step: 0.01 },
                { key: "allowDiscounts", label: "Allow discounts", type: "switch" },
                { key: "maxDiscountPercent", label: "Max discount (%)", type: "number", min: 0, max: 100 },
            ]
        },
        {
            title: "Customer & Loyalty",
            icon: Users,
            settings: [
                { key: "requireCustomerInfo", label: "Require customer info", type: "switch" },
                { key: "loyaltyProgram", label: "Enable loyalty program", type: "switch" },
            ]
        },
        {
            title: "System & Interface",
            icon: Volume2,
            settings: [
                { key: "soundEffects", label: "Sound effects", type: "switch" },
                { key: "compactMode", label: "Compact interface mode", type: "switch" },
                { key: "inventoryTracking", label: "Real-time inventory tracking", type: "switch" },
                { key: "multiCurrency", label: "Multi-currency support", type: "switch" },
            ]
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl space-y-6"
        >
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-white flex items-center justify-center space-x-3">
                        <Settings className="w-8 h-8" />
                        <span>Configure POS Settings</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {settingsGroups.map((group, groupIndex) => (
                        <Card key={groupIndex} className="bg-white/5 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center space-x-2">
                                    <group.icon className="w-5 h-5" />
                                    <span>{group.title}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {group.settings.map((setting, settingIndex) => (
                                    <div key={settingIndex} className="flex items-center justify-between">
                                        <Label className="text-gray-300">{setting.label}</Label>
                                        {setting.type === "switch" ? (
                                            <Switch
                                                checked={settings[setting.key as keyof typeof settings] as boolean}
                                                onCheckedChange={(checked) => handleSettingChange(setting.key, checked)}
                                            />
                                        ) : (
                                            <Input
                                                type="number"
                                                value={settings[setting.key as keyof typeof settings] as number}
                                                onChange={(e) => handleSettingChange(setting.key, parseFloat(e.target.value) || 0)}
                                                min={setting.min}
                                                max={setting.max}
                                                step={setting.step}
                                                className="w-24 bg-white/10 border-white/20 text-white"
                                            />
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}

                    <div className="flex justify-between pt-6">
                        <Button
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                            onClick={() => router.back()}
                        >
                            Back
                        </Button>
                        <Button
                            onClick={handleSaveSettings}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                            size="lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Complete Setup"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}