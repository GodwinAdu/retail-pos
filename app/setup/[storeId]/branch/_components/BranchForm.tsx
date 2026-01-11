"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Store, MapPin, User, Phone, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createBranch } from "@/lib/actions/branch.actions";

interface BranchFormProps {
    storeId: string;
}

export default function BranchForm({ storeId }: BranchFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        manager: "",
        phone: "",
        email: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            console.log("Submitting branch form with data:", { storeId, ...formData });
            const result = await createBranch({
                storeId,
                ...formData
            });
            
            if (result.success) {
                router.push(`/dashboard/${storeId}/${result.branch._id}`);
            }
        } catch (error: any) {
            setError(error.message || "Failed to create branch");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-white flex items-center justify-center space-x-3">
                        <Store className="w-8 h-8" />
                        <span>Create Your First Branch</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-300">Branch Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                                    placeholder="Main Store"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-gray-300">Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        id="location"
                                        name="location"
                                        type="text"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-10"
                                        placeholder="123 Main St, City"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="manager" className="text-gray-300">Manager Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        id="manager"
                                        name="manager"
                                        type="text"
                                        value={formData.manager}
                                        onChange={handleInputChange}
                                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-10"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-10"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-10"
                                    placeholder="branch@store.com"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating Branch...
                                </>
                            ) : (
                                "Create Branch"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
}