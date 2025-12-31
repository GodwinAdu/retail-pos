import { CreditCard, Download, Calendar, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BillingPageProps {
    params: Promise<{
        storeId: string;
        branchId: string;
    }>;
}

export default async function BillingPage({ params }: BillingPageProps) {
    const { storeId, branchId } = await params;

    const currentPlan = {
        name: "Retail Pro",
        price: 80,
        status: "active",
        nextBilling: "2024-02-15",
        features: [
            "Unlimited Products",
            "Advanced POS System",
            "Inventory Management",
            "Customer Management",
            "Sales Analytics",
            "Multi-Branch Support",
            "24/7 Support"
        ]
    };

    const billingHistory = [
        { id: 1, date: "2024-01-15", amount: 80, status: "paid", invoice: "INV-001" },
        { id: 2, date: "2023-12-15", amount: 80, status: "paid", invoice: "INV-002" },
        { id: 3, date: "2023-11-15", amount: 80, status: "paid", invoice: "INV-003" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex">
            <div className="flex-1 p-6 overflow-auto">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Billing & Subscription</h1>
                            <p className="text-gray-300 mt-1">Manage your subscription and billing information</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Current Plan */}
                        <div className="lg:col-span-2">
                            <Card className="bg-white/10 backdrop-blur-md border-white/20">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center">
                                        <CreditCard className="w-5 h-5 mr-2" />
                                        Current Plan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">{currentPlan.name}</h3>
                                            <p className="text-gray-300">Perfect for retail businesses</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-white">${currentPlan.price}</div>
                                            <div className="text-gray-300">per month</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <Badge className={`${
                                            currentPlan.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                            currentPlan.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                                            'bg-orange-500/20 text-orange-400'
                                        } border-0`}>
                                            {currentPlan.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                                            {currentPlan.status === 'cancelled' && <AlertCircle className="w-3 h-3 mr-1" />}
                                            {currentPlan.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                                            {currentPlan.status.charAt(0).toUpperCase() + currentPlan.status.slice(1)}
                                        </Badge>
                                        <div className="flex items-center text-gray-300">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Next billing: {new Date(currentPlan.nextBilling).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-white font-semibold mb-3">Plan Features</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {currentPlan.features.map((feature, index) => (
                                                <div key={index} className="flex items-center text-gray-300">
                                                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex space-x-3">
                                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                            Upgrade Plan
                                        </Button>
                                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                            Change Payment Method
                                        </Button>
                                        <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/20">
                                            Cancel Subscription
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Payment Method */}
                        <div>
                            <Card className="bg-white/10 backdrop-blur-md border-white/20">
                                <CardHeader>
                                    <CardTitle className="text-white">Payment Method</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-white">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="text-sm opacity-80">VISA</div>
                                            <div className="text-sm opacity-80">****</div>
                                        </div>
                                        <div className="text-lg font-mono mb-2">**** **** **** 4242</div>
                                        <div className="flex justify-between text-sm opacity-80">
                                            <span>John Doe</span>
                                            <span>12/26</span>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                                        Update Payment Method
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Billing History */}
                    <Card className="bg-white/10 backdrop-blur-md border-white/20">
                        <CardHeader>
                            <CardTitle className="text-white">Billing History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left text-gray-300 font-medium py-3">Date</th>
                                            <th className="text-left text-gray-300 font-medium py-3">Amount</th>
                                            <th className="text-left text-gray-300 font-medium py-3">Status</th>
                                            <th className="text-left text-gray-300 font-medium py-3">Invoice</th>
                                            <th className="text-left text-gray-300 font-medium py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {billingHistory.map((bill) => (
                                            <tr key={bill.id} className="border-b border-white/5">
                                                <td className="py-4 text-white">
                                                    {new Date(bill.date).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 text-white font-medium">
                                                    ${bill.amount}
                                                </td>
                                                <td className="py-4">
                                                    <Badge className={`${
                                                        bill.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                                                        bill.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-orange-500/20 text-orange-400'
                                                    } border-0`}>
                                                        {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 text-gray-300">
                                                    {bill.invoice}
                                                </td>
                                                <td className="py-4">
                                                    <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Download
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Usage Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-white/10 backdrop-blur-md border-white/20">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-300 text-sm">Products</p>
                                        <p className="text-2xl font-bold text-white">247</p>
                                        <p className="text-xs text-gray-400">Unlimited included</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                        <CreditCard className="w-6 h-6 text-blue-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur-md border-white/20">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-300 text-sm">Transactions</p>
                                        <p className="text-2xl font-bold text-white">1,234</p>
                                        <p className="text-xs text-gray-400">This month</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-green-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur-md border-white/20">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-300 text-sm">Storage</p>
                                        <p className="text-2xl font-bold text-white">2.4 GB</p>
                                        <p className="text-xs text-gray-400">of 10 GB used</p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-purple-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}