"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { getBranches } from "@/lib/actions/branch.actions";

interface Branch {
  _id: string;
  name: string;
  address: string;
}

export default function BranchSwitcher() {
  const router = useRouter();
  const params = useParams();
  const storeId = params.storeId as string;
  const branchId = params.branchId as string;
  
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBranches = async () => {
      if (storeId) {
        try {
          const branchesData = await getBranches(storeId);
          setBranches(branchesData);
          const current = branchesData.find((b: Branch) => b._id === branchId);
          setCurrentBranch(current || null);
        } catch (error) {
          console.error("Error loading branches:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadBranches();
  }, [storeId, branchId]);

  const handleBranchChange = (newBranchId: string) => {
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(`/${branchId}`, `/${newBranchId}`);
    router.push(newPath);
  };

  if (loading || branches.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <MapPin className="w-4 h-4 text-blue-400" />
      <Select value={branchId} onValueChange={handleBranchChange}>
        <SelectTrigger className="w-48 ">
          <SelectValue placeholder="Select Branch">
            {currentBranch ? currentBranch.name : "Select Branch"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent >
          {branches.map((branch) => (
            <SelectItem key={branch._id} value={branch._id} className="">
              <div>
                <div className="font-medium">{branch.name}</div>
                <div className="text-xs text-gray-400">{branch.address}</div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}