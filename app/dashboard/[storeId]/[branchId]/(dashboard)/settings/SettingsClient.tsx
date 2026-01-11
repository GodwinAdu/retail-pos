"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, MapPin, User, Save, Loader2, Settings2, ShoppingCart, Package, Trash2, AlertTriangle } from "lucide-react";
import { updateStoreSettings, updateBranchSettings, updateUserProfile } from "@/lib/actions/settings.actions";
import { deleteBranch } from "@/lib/actions/branch.actions";
import { useRouter } from "next/navigation";
import SettingsSummary from "@/components/SettingsSummary";

interface SettingsClientProps {
    user: any;
    store: any;
    branch: any;
    storeId: string;
    branchId: string;
}

export default function SettingsClient({ user, store, branch, storeId, branchId }: SettingsClientProps) {
    const router = useRouter();
    const [loading, setLoading] = useState({ store: false, branch: false, user: false, delete: false });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    const [storeData, setStoreData] = useState({
        name: store?.name || "",
        description: store?.description || "",
        phone: store?.phone || "",
        email: store?.email || ""
    });

    const [branchData, setBranchData] = useState({
        name: branch?.name || "",
        address: branch?.address || "",
        phone: branch?.phone || "",
        email: branch?.email || "",
        manager: branch?.manager || ""
    });

    const [posSettings, setPosSettings] = useState({
        autoReceiptPrint: branch?.posSettings?.autoReceiptPrint ?? true,
        showItemImages: branch?.posSettings?.showItemImages ?? true,
        quickPayEnabled: branch?.posSettings?.quickPayEnabled ?? true,
        taxIncluded: branch?.posSettings?.taxIncluded ?? false,
        defaultTaxRate: branch?.posSettings?.defaultTaxRate ?? 0.15,
        allowDiscounts: branch?.posSettings?.allowDiscounts ?? true,
        maxDiscountPercent: branch?.posSettings?.maxDiscountPercent ?? 20,
        requireCustomerInfo: branch?.posSettings?.requireCustomerInfo ?? false,
        soundEffects: branch?.posSettings?.soundEffects ?? true,
        compactMode: branch?.posSettings?.compactMode ?? false,
        barcodeScanning: branch?.posSettings?.barcodeScanning ?? true,
        inventoryTracking: branch?.posSettings?.inventoryTracking ?? true,
        loyaltyProgram: branch?.posSettings?.loyaltyProgram ?? false,
        multiCurrency: branch?.posSettings?.multiCurrency ?? false
    });

    const [inventorySettings, setInventorySettings] = useState({
        lowStockAlert: branch?.inventorySettings?.lowStockAlert ?? true,
        lowStockThreshold: branch?.inventorySettings?.lowStockThreshold ?? 10,
        autoReorder: branch?.inventorySettings?.autoReorder ?? false,
        reorderPoint: branch?.inventorySettings?.reorderPoint ?? 5,
        trackExpiry: branch?.inventorySettings?.trackExpiry ?? true,
        batchTracking: branch?.inventorySettings?.batchTracking ?? false,
        serialNumberTracking: branch?.inventorySettings?.serialNumberTracking ?? false
    });

    const [userData, setUserData] = useState({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phone: user?.phone || ""
    });

    const handleStoreUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(prev => ({ ...prev, store: true }));

        try {
            await updateStoreSettings(storeId, storeData);
            router.refresh();
        } catch (error) {
            console.error("Error updating store:", error);
            alert("Failed to update store settings");
        } finally {
            setLoading(prev => ({ ...prev, store: false }));
        }
    };

    const handleBranchUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(prev => ({ ...prev, branch: true }));

        try {
            await updateBranchSettings(branchId, {
                ...branchData,
                posSettings,
                inventorySettings
            });
            router.refresh();
        } catch (error) {
            console.error("Error updating branch:", error);
            alert("Failed to update branch settings");
        } finally {
            setLoading(prev => ({ ...prev, branch: false }));
        }
    };

    const handleUserUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(prev => ({ ...prev, user: true }));

        try {
            await updateUserProfile(user._id, userData);
            router.refresh();
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile");
        } finally {
            setLoading(prev => ({ ...prev, user: false }));
        }
    };

    return (
        <div className="space-y-8">
            <SettingsSummary />
            
            <Tabs defaultValue="general" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-slate-800/80 via-slate-700/80 to-slate-800/80 backdrop-blur-xl border border-slate-600/50 rounded-2xl p-2">
                <TabsTrigger value="general" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:shadow-lg text-gray-300 data-[state=active]:text-white rounded-xl transition-all duration-300">
                    <Store className="w-4 h-4 mr-2" />
                    General
                </TabsTrigger>
                <TabsTrigger value="pos" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:shadow-lg text-gray-300 data-[state=active]:text-white rounded-xl transition-all duration-300">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    POS
                </TabsTrigger>
                <TabsTrigger value="inventory" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:shadow-lg text-gray-300 data-[state=active]:text-white rounded-xl transition-all duration-300">
                    <Package className="w-4 h-4 mr-2" />
                    Inventory
                </TabsTrigger>
                <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:shadow-lg text-gray-300 data-[state=active]:text-white rounded-xl transition-all duration-300">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
                <Card className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center">
                            <Store className="w-5 h-5 mr-2" />
                            Store Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleStoreUpdate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="storeName" className="text-gray-300">Store Name</Label>
                                    <Input
                                        id="storeName"
                                        value={storeData.name}
                                        onChange={(e) => setStoreData({...storeData, name: e.target.value})}
                                        className="bg-slate-800 border-slate-600 text-white"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="storePhone" className="text-gray-300">Phone</Label>
                                    <Input
                                        id="storePhone"
                                        value={storeData.phone}
                                        onChange={(e) => setStoreData({...storeData, phone: e.target.value})}
                                        className="bg-slate-800 border-slate-600 text-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="storeEmail" className="text-gray-300">Email</Label>
                                <Input
                                    id="storeEmail"
                                    type="email"
                                    value={storeData.email}
                                    onChange={(e) => setStoreData({...storeData, email: e.target.value})}
                                    className="bg-slate-800 border-slate-600 text-white"
                                />
                            </div>
                            <div>
                                <Label htmlFor="storeDescription" className="text-gray-300">Description</Label>
                                <Textarea
                                    id="storeDescription"
                                    value={storeData.description}
                                    onChange={(e) => setStoreData({...storeData, description: e.target.value})}
                                    className="bg-slate-800 border-slate-600 text-white"
                                    rows={3}
                                />
                            </div>
                            <Button type="submit" disabled={loading.store} className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300">
                                {loading.store ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                Save Store Settings
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center">
                            <MapPin className="w-5 h-5 mr-2" />
                            Branch Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                    <form onSubmit={handleBranchUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="branchName" className="text-gray-300">Branch Name</Label>
                                <Input
                                    id="branchName"
                                    value={branchData.name}
                                    onChange={(e) => setBranchData({...branchData, name: e.target.value})}
                                    className="bg-slate-800 border-slate-600 text-white"
                                />
                            </div>
                            <div>
                                <Label htmlFor="branchPhone" className="text-gray-300">Phone</Label>
                                <Input
                                    id="branchPhone"
                                    value={branchData.phone}
                                    onChange={(e) => setBranchData({...branchData, phone: e.target.value})}
                                    className="bg-slate-800 border-slate-600 text-white"
                                />
                            </div>
                            <div>
                                <Label htmlFor="branchEmail" className="text-gray-300">Email</Label>
                                <Input
                                    id="branchEmail"
                                    type="email"
                                    value={branchData.email}
                                    onChange={(e) => setBranchData({...branchData, email: e.target.value})}
                                    className="bg-slate-800 border-slate-600 text-white"
                                />
                            </div>
                            <div>
                                <Label htmlFor="branchManager" className="text-gray-300">Manager</Label>
                                <Input
                                    id="branchManager"
                                    value={branchData.manager}
                                    onChange={(e) => setBranchData({...branchData, manager: e.target.value})}
                                    className="bg-slate-800 border-slate-600 text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="branchAddress" className="text-gray-300">Address</Label>
                            <Textarea
                                id="branchAddress"
                                value={branchData.address}
                                onChange={(e) => setBranchData({...branchData, address: e.target.value})}
                                className="bg-slate-800 border-slate-600 text-white"
                                rows={2}
                            />
                        </div>
                        

                        
                            <Button type="submit" disabled={loading.branch} className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all duration-300">
                                {loading.branch ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                Save Branch Info
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                
                {/* Danger Zone */}
                <Card className="bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent backdrop-blur-xl border border-red-400/30 shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-red-400 flex items-center">
                            <AlertTriangle className="w-5 h-5 mr-2" />
                            Danger Zone
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <h4 className="text-red-400 font-semibold mb-2">Delete Branch</h4>
                            <p className="text-gray-300 text-sm mb-4">
                                Permanently delete this branch. This action cannot be undone.
                            </p>
                            <Button 
                                onClick={() => {
                                    if (!showDeleteConfirm) {
                                        setShowDeleteConfirm(true);
                                    } else {
                                        setLoading(prev => ({ ...prev, delete: true }));
                                        deleteBranch(storeId, branchId).then(result => {
                                            if (result.success) {
                                                router.push(`/dashboard/${storeId}`);
                                            } else {
                                                alert(result.error || "Failed to delete branch");
                                            }
                                        }).finally(() => {
                                            setLoading(prev => ({ ...prev, delete: false }));
                                            setShowDeleteConfirm(false);
                                        });
                                    }
                                }}
                                disabled={loading.delete}
                                variant={showDeleteConfirm ? "destructive" : "outline"}
                                className={showDeleteConfirm ? "" : "border-red-500 text-red-400 hover:bg-red-500/20"}
                            >
                                {loading.delete ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                                {showDeleteConfirm ? "Confirm Delete" : "Delete Branch"}
                            </Button>
                            {showDeleteConfirm && (
                                <Button 
                                    onClick={() => setShowDeleteConfirm(false)}
                                    variant="outline"
                                    className="ml-2 border-gray-500 text-gray-400"
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="pos" className="space-y-6">
                <Card className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent backdrop-blur-xl border border-emerald-400/30 shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center">
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            POS Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-800/60 to-slate-700/40 backdrop-blur-sm rounded-2xl border border-slate-600/30 hover:border-emerald-400/50 transition-all duration-300">
                                <div>
                                    <Label className="text-white font-medium">Auto Receipt Print</Label>
                                    <p className="text-gray-400 text-sm">Automatically print receipts after payment</p>
                                </div>
                                <Switch
                                    checked={posSettings.autoReceiptPrint}
                                    onCheckedChange={(checked) => setPosSettings({...posSettings, autoReceiptPrint: checked})}
                                />
                            </div>
                            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-800/60 to-slate-700/40 backdrop-blur-sm rounded-2xl border border-slate-600/30 hover:border-emerald-400/50 transition-all duration-300">
                                <div>
                                    <Label className="text-white font-medium">Show Item Images</Label>
                                    <p className="text-gray-400 text-sm">Display product images in POS</p>
                                </div>
                                <Switch
                                    checked={posSettings.showItemImages}
                                    onCheckedChange={(checked) => setPosSettings({...posSettings, showItemImages: checked})}
                                />
                            </div>
                            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-800/60 to-slate-700/40 backdrop-blur-sm rounded-2xl border border-slate-600/30 hover:border-emerald-400/50 transition-all duration-300">
                                <div>
                                    <Label className="text-white font-medium">Quick Pay</Label>
                                    <p className="text-gray-400 text-sm">Enable quick payment options</p>
                                </div>
                                <Switch
                                    checked={posSettings.quickPayEnabled}
                                    onCheckedChange={(checked) => setPosSettings({...posSettings, quickPayEnabled: checked})}
                                />
                            </div>
                            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-800/60 to-slate-700/40 backdrop-blur-sm rounded-2xl border border-slate-600/30 hover:border-emerald-400/50 transition-all duration-300">
                                <div>
                                    <Label className="text-white font-medium">Barcode Scanning</Label>
                                    <p className="text-gray-400 text-sm">Enable barcode scanner support</p>
                                </div>
                                <Switch
                                    checked={posSettings.barcodeScanning}
                                    onCheckedChange={(checked) => setPosSettings({...posSettings, barcodeScanning: checked})}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-gray-300">Default Tax Rate (%)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={posSettings.defaultTaxRate * 100}
                                    onChange={(e) => setPosSettings({...posSettings, defaultTaxRate: parseFloat(e.target.value) / 100})}
                                    className="bg-slate-800 border-slate-600 text-white mt-2"
                                />
                            </div>
                            <div>
                                <Label className="text-gray-300">Max Discount (%)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={posSettings.maxDiscountPercent}
                                    onChange={(e) => setPosSettings({...posSettings, maxDiscountPercent: parseInt(e.target.value)})}
                                    className="bg-slate-800 border-slate-600 text-white mt-2"
                                />
                            </div>
                        </div>
                        <Button onClick={handleBranchUpdate} disabled={loading.branch} className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all duration-300">
                            {loading.branch ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save POS Settings
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-6">
                <Card className="bg-gradient-to-br from-orange-500/10 via-red-500/5 to-transparent backdrop-blur-xl border border-orange-400/30 shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center">
                            <Package className="w-5 h-5 mr-2" />
                            Inventory Management
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-800/60 to-slate-700/40 backdrop-blur-sm rounded-2xl border border-slate-600/30 hover:border-orange-400/50 transition-all duration-300">
                                <div>
                                    <Label className="text-white font-medium">Low Stock Alerts</Label>
                                    <p className="text-gray-400 text-sm">Get notified when stock is low</p>
                                </div>
                                <Switch
                                    checked={inventorySettings.lowStockAlert}
                                    onCheckedChange={(checked) => setInventorySettings({...inventorySettings, lowStockAlert: checked})}
                                />
                            </div>
                            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-800/60 to-slate-700/40 backdrop-blur-sm rounded-2xl border border-slate-600/30 hover:border-orange-400/50 transition-all duration-300">
                                <div>
                                    <Label className="text-white font-medium">Track Expiry</Label>
                                    <p className="text-gray-400 text-sm">Monitor product expiration dates</p>
                                </div>
                                <Switch
                                    checked={inventorySettings.trackExpiry}
                                    onCheckedChange={(checked) => setInventorySettings({...inventorySettings, trackExpiry: checked})}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-gray-300">Low Stock Threshold</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={inventorySettings.lowStockThreshold}
                                    onChange={(e) => setInventorySettings({...inventorySettings, lowStockThreshold: parseInt(e.target.value)})}
                                    className="bg-slate-800 border-slate-600 text-white mt-2"
                                />
                            </div>
                            <div>
                                <Label className="text-gray-300">Reorder Point</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={inventorySettings.reorderPoint}
                                    onChange={(e) => setInventorySettings({...inventorySettings, reorderPoint: parseInt(e.target.value)})}
                                    className="bg-slate-800 border-slate-600 text-white mt-2"
                                />
                            </div>
                        </div>
                        <Button onClick={handleBranchUpdate} disabled={loading.branch} className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 hover:from-orange-600 hover:via-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300">
                            {loading.branch ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Inventory Settings
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">

                <Card className="bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent backdrop-blur-xl border border-violet-400/30 shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center">
                            <User className="w-5 h-5 mr-2" />
                            Profile Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUserUpdate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="fullName" className="text-gray-300">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        value={userData.fullName}
                                        onChange={(e) => setUserData({...userData, fullName: e.target.value})}
                                        className="bg-slate-800 border-slate-600 text-white"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="userPhone" className="text-gray-300">Phone</Label>
                                    <Input
                                        id="userPhone"
                                        value={userData.phone}
                                        onChange={(e) => setUserData({...userData, phone: e.target.value})}
                                        className="bg-slate-800 border-slate-600 text-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="userEmail" className="text-gray-300">Email</Label>
                                <Input
                                    id="userEmail"
                                    type="email"
                                    value={userData.email}
                                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                                    className="bg-slate-800 border-slate-600 text-white"
                                />
                            </div>
                            <Button type="submit" disabled={loading.user} className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-600 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-700 shadow-lg hover:shadow-xl transition-all duration-300">
                                {loading.user ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                Save Profile
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </TabsContent>
            </Tabs>
        </div>
    );
}