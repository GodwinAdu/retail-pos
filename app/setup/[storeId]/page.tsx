"use client"

import { motion } from "framer-motion";
import { ShoppingCart, Store, MapPin, Clock, Settings, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface SetupPageProps {
    params:Promise <{
        storeId: string;
    }>;
}

export default async function SetupPage({ params }: SetupPageProps) {
    const { storeId } = await params;

    const setupSteps = [
        {
            icon: Store,
            title: "Create Your First Branch",
            description: "Set up your main store location with operating hours and contact information.",
            href: `/setup/${storeId}/branch`,
            completed: false
        },
        {
            icon: ShoppingCart,
            title: "Add Products & Categories",
            description: "Build your product catalog with categories, pricing, and inventory tracking.",
            href: `/setup/${storeId}/products`,
            completed: false
        },
        {
            icon: Settings,
            title: "Configure POS Settings",
            description: "Customize your point of sale system with payment methods and receipt settings.",
            href: `/setup/${storeId}/pos-settings`,
            completed: false
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <motion.div 
                    className="absolute top-10 left-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div 
                    className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1.1, 1, 1.1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 14,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
                <div className="w-full max-w-4xl">
                    {/* Header */}
                    <motion.div 
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center justify-center space-x-3 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl">
                                <ShoppingCart className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white">Welcome to RetailPOS!</h1>
                                <p className="text-blue-400 font-medium">Let's set up your store</p>
                            </div>
                        </div>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Complete these quick setup steps to start managing your retail business like a pro.
                        </p>
                    </motion.div>

                    {/* Setup Steps */}
                    <div className="space-y-6">
                        {setupSteps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                            >
                                <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-600 rounded-2xl flex items-center justify-center">
                                                    <step.icon className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white mb-1">{step.title}</h3>
                                                    <p className="text-gray-300">{step.description}</p>
                                                </div>
                                            </div>
                                            <Link href={step.href}>
                                                <Button 
                                                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                                                    size="lg"
                                                >
                                                    {step.completed ? "Edit" : "Set Up"}
                                                    <ArrowRight className="ml-2 w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Start Option */}
                    <motion.div 
                        className="mt-12 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                            <CardContent className="p-8">
                                <h3 className="text-2xl font-bold text-white mb-4">Want to Skip Setup?</h3>
                                <p className="text-gray-300 mb-6">
                                    You can always configure these settings later from your dashboard.
                                </p>
                                <Link href={`/dashboard/${storeId}`}>
                                    <Button 
                                        variant="outline" 
                                        size="lg"
                                        className="border-white/20 text-white hover:bg-white/10"
                                    >
                                        Go to Dashboard
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}