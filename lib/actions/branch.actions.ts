"use server";

import { connectToDB } from "@/lib/mongoose";
import Branch from "@/lib/models/branch.models";
import { withSubscriptionCheckByStoreId } from "@/lib/utils/subscription-wrapper";

export const getBranches = withSubscriptionCheckByStoreId(async (storeId: string) => {
  try {
    await connectToDB();
    const branches = await Branch.find({ storeId }).lean();
    console.log("Fetched branches:", branches);
    return JSON.parse(JSON.stringify(branches));
  } catch (error) {
    console.error("Error fetching branches:", error);
    return [];
  }
});

export const createBranch = async (branchData: {
  storeId: string;
  name: string;
  location?: string;
  manager?: string;
  phone?: string;
  email?: string;
  [key: string]: any;
}) => {
  try {
    const { currentUser } = await import("@/lib/helpers/current-user");
    const user = await currentUser();
    
    if (!user || user.role !== "owner") {
      return { success: false, error: "Access denied. Only owners can create branches." };
    }
    
    console.log('createBranch called with:', branchData);
    const result = await withSubscriptionCheckByStoreId(async (storeId: string, data: any) => {
      try {
        await connectToDB();
        console.log('Creating branch with storeId:', storeId, 'and data:', data);
        const branch = await Branch.create({ ...data, storeId });
        console.log('Branch created successfully:', branch);
        return { success: true, branch: JSON.parse(JSON.stringify(branch)) };
      } catch (error) {
        console.error("Error creating branch:", error);
        return { success: false, error: error instanceof Error ? error.message : 'Failed to create branch' };
      }
    })(branchData.storeId, branchData);
    
    console.log('createBranch result:', result);
    return result;
  } catch (error) {
    console.error("Error in createBranch wrapper:", error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create branch' };
  }
};

export const deleteBranch = withSubscriptionCheckByStoreId(async (storeId: string, branchId: string) => {
  try {
    const { currentUser } = await import("@/lib/helpers/current-user");
    const user = await currentUser();
    
    if (!user || user.role !== "owner") {
      return { success: false, error: "Access denied. Only owners can delete branches." };
    }
    
    await connectToDB();
    const deletedBranch = await Branch.findOneAndDelete({ _id: branchId, storeId });
    if (!deletedBranch) {
      return { success: false, error: "Branch not found" };
    }
    return { success: true, message: "Branch deleted successfully" };
  } catch (error) {
    console.error("Error deleting branch:", error);
    return { success: false, error: "Failed to delete branch" };
  }
});