"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, Plus, Tag, DollarSign, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createCategory } from "@/lib/actions/category.actions";

interface ProductsFormProps {
    storeId: string;
}

export default function ProductsForm({ storeId }: ProductsFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState<string[]>([]);
    const [newCategory, setNewCategory] = useState("");

    const defaultCategories = [
        "Electronics", "Clothing", "Food & Beverages", "Home & Garden", 
        "Sports & Outdoors", "Books", "Health & Beauty", "Toys & Games"
    ];

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;
        
        try {
            setIsLoading(true);
            await createCategory({
                storeId,
                name: newCategory.trim()
            });
            setCategories([...categories, newCategory.trim()]);
            setNewCategory("");
        } catch (error: any) {
            setError(error.message || "Failed to add category");
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickSetup = async () => {
        try {
            setIsLoading(true);
            
            // Create default categories
            for (const category of defaultCategories) {
                await createCategory({
                    storeId,
                    name: category
                });
            }
            
            router.push(`/setup/${storeId}/pos-settings`);
        } catch (error: any) {
            setError(error.message || "Failed to create categories");
        } finally {
            setIsLoading(false);
        }
    };

    const handleContinue = () => {
        router.push(`/setup/${storeId}/pos-settings`);
    };

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
                        <Package className="w-8 h-8" />
                        <span>Set Up Your Product Catalog</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Quick Setup Option */}
                    <div className="text-center space-y-4">
                        <h3 className="text-xl font-semibold text-white">Quick Setup</h3>
                        <p className="text-gray-300">
                            Get started quickly with pre-made categories, or create your own custom categories below.
                        </p>
                        <Button
                            onClick={handleQuickSetup}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                            size="lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Setting up...
                                </>
                            ) : (
                                <>
                                    <Tag className="w-4 h-4 mr-2" />
                                    Create Default Categories
                                </>
                            )}
                        </Button>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-400">
                            {defaultCategories.map((category, index) => (
                                <div key={index} className="p-2 bg-white/5 rounded">
                                    {category}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex-1 h-px bg-white/20"></div>
                        <span className="text-gray-400">OR</span>
                        <div className="flex-1 h-px bg-white/20"></div>
                    </div>

                    {/* Custom Categories */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">Create Custom Categories</h3>
                        
                        <div className="flex space-x-2">
                            <Input
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Enter category name"
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                            />
                            <Button
                                onClick={handleAddCategory}
                                disabled={!newCategory.trim() || isLoading}
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        {categories.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-gray-300">Added Categories:</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {categories.map((category, index) => (
                                        <div key={index} className="p-2 bg-green-500/20 border border-green-500/30 rounded text-green-200 text-sm">
                                            {category}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between pt-6">
                        <Button
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                            onClick={() => router.back()}
                        >
                            Back
                        </Button>
                        <Button
                            onClick={handleContinue}
                            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                        >
                            Continue Setup
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}