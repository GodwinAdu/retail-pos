"use server";

import { connectToDB } from "../mongoose";
import Store from "../models/store.models";
import Branch from "../models/branch.models";
import User from "../models/user.models";

export async function getStoreSettings(storeId: string) {
    try {
        await connectToDB();
        const store = await Store.findById(storeId);
        return store;
    } catch (error) {
        console.error("Error fetching store settings:", error);
        throw new Error("Failed to fetch store settings");
    }
}

export async function getBranchSettings(branchId: string) {
    try {
        await connectToDB();
        const branch = await Branch.findById(branchId);
        return branch;
    } catch (error) {
        console.error("Error fetching branch settings:", error);
        throw new Error("Failed to fetch branch settings");
    }
}

export async function updateStoreSettings(storeId: string, data: {
    name?: string;
    description?: string;
    phone?: string;
    email?: string;
}) {
    try {
        await connectToDB();
        const updatedStore = await Store.findByIdAndUpdate(
            storeId,
            { $set: data },
            { new: true }
        );
        return updatedStore;
    } catch (error) {
        console.error("Error updating store settings:", error);
        throw new Error("Failed to update store settings");
    }
}

export async function updateBranchSettings(branchId: string, data: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    manager?: string;
    posSettings?: any;
    inventorySettings?: any;
    operatingHours?: any[];
}) {
    try {
        await connectToDB();
        const updatedBranch = await Branch.findByIdAndUpdate(
            branchId,
            { $set: data },
            { new: true }
        );
        return updatedBranch;
    } catch (error) {
        console.error("Error updating branch settings:", error);
        throw new Error("Failed to update branch settings");
    }
}

export async function updateUserProfile(userId: string, data: {
    fullName?: string;
    email?: string;
    phone?: string;
}) {
    try {
        await connectToDB();
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: data },
            { new: true }
        );
        return updatedUser;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw new Error("Failed to update user profile");
    }
}