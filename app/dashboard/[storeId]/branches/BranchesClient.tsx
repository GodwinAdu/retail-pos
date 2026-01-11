"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Store, Edit, Trash2, Plus, MapPin, User, Phone, Mail } from "lucide-react";
import { deleteBranch } from "@/lib/actions/branch.actions";

interface Branch {
    _id: string;
    name: string;
    address?: string;
    manager?: string;
    phone?: string;
    email?: string;
    isActive: boolean;
}

interface BranchesClientProps {
    storeId: string;
    branches: Branch[];
}

export default function BranchesClient({ storeId, branches }: BranchesClientProps) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (branchId: string) => {
        if (!confirm("Are you sure you want to delete this branch?")) return;
        
        setDeletingId(branchId);
        try {
            const result = await deleteBranch(storeId, branchId);
            if (result.success) {
                router.refresh();
            } else {
                alert(result.error || "Failed to delete branch");
            }
        } catch (error) {
            alert("Failed to delete branch");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Branch Management</h1>
                    <p className="text-gray-400">Manage all your store branches</p>
                </div>
                <Button 
                    onClick={() => router.push(`/setup/${storeId}/branch`)}
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Branch
                </Button>
            </div>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                    <CardTitle className="text-white flex items-center">
                        <Store className="w-5 h-5 mr-2" />
                        All Branches ({branches.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {branches.length === 0 ? (
                        <div className="text-center py-8">
                            <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-400">No branches found</p>
                            <Button 
                                onClick={() => router.push(`/setup/${storeId}/branch`)}
                                className="mt-4 bg-gradient-to-r from-blue-600 to-green-600"
                            >
                                Create Your First Branch
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/20">
                                    <TableHead className="text-gray-300">Name</TableHead>
                                    <TableHead className="text-gray-300">Address</TableHead>
                                    <TableHead className="text-gray-300">Manager</TableHead>
                                    <TableHead className="text-gray-300">Contact</TableHead>
                                    <TableHead className="text-gray-300">Status</TableHead>
                                    <TableHead className="text-gray-300">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {branches.map((branch) => (
                                    <TableRow key={branch._id} className="border-white/10">
                                        <TableCell className="text-white font-medium">
                                            <div className="flex items-center">
                                                <Store className="w-4 h-4 mr-2 text-blue-400" />
                                                {branch.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-300">
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                                {branch.address || "Not set"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-300">
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 mr-2 text-gray-400" />
                                                {branch.manager || "Not assigned"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-300">
                                            <div className="space-y-1">
                                                {branch.phone && (
                                                    <div className="flex items-center text-sm">
                                                        <Phone className="w-3 h-3 mr-1 text-gray-400" />
                                                        {branch.phone}
                                                    </div>
                                                )}
                                                {branch.email && (
                                                    <div className="flex items-center text-sm">
                                                        <Mail className="w-3 h-3 mr-1 text-gray-400" />
                                                        {branch.email}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                branch.isActive 
                                                    ? "bg-green-500/20 text-green-400" 
                                                    : "bg-red-500/20 text-red-400"
                                            }`}>
                                                {branch.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => router.push(`/dashboard/${storeId}/${branch._id}/settings`)}
                                                    className="border-blue-500 text-blue-400 hover:bg-blue-500/20"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDelete(branch._id)}
                                                    disabled={deletingId === branch._id}
                                                    className="border-red-500 text-red-400 hover:bg-red-500/20"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}