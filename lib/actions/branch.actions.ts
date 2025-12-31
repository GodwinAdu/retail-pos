"use server";

import { connectToDB } from "@/lib/mongoose";
import Branch from "@/lib/models/branch.models";

export async function getBranches(storeId: string) {
  try {
    await connectToDB();
    const branches = await Branch.find({ storeId }).lean();
    console.log("Fetched branches:", branches);
    return JSON.parse(JSON.stringify(branches));
  } catch (error) {
    console.error("Error fetching branches:", error);
    return [];
  }
}

export async function createBranch(branchData: any) {
  try {
    await connectToDB();
    const branch = await Branch.create(branchData);
    return JSON.parse(JSON.stringify(branch));
  } catch (error) {
    console.error("Error creating branch:", error);
    return null;
  }
}