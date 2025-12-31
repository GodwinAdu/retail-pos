"use server";

import { connectToDB } from "../mongoose";
import User from "../models/user.models";

export async function getStaffMembers(branchId: string) {
    try {
        await connectToDB();
        
        const staff = await User.find({ 
            accessLocation: branchId,
            role: { $in: ['manager', 'sales_associate', 'cashier', 'inventory_manager'] }
        }).select('fullName email role phoneNumber isActive createdAt');
        
        return staff;
    } catch (error) {
        console.error("Error fetching staff:", error);
        throw new Error("Failed to fetch staff members");
    }
}

export async function getStaffStats(branchId: string) {
    try {
        await connectToDB();
        
        const totalStaff = await User.countDocuments({ 
            accessLocation: branchId,
            role: { $in: ['manager', 'sales_associate', 'cashier', 'inventory_manager'] }
        });
        
        const activeStaff = await User.countDocuments({ 
            accessLocation: branchId,
            role: { $in: ['manager', 'sales_associate', 'cashier', 'inventory_manager'] },
            isActive: true
        });
        
        return {
            totalStaff,
            activeStaff,
            onBreak: Math.floor(Math.random() * 3), // Mock data
            avgHours: 38.7
        };
    } catch (error) {
        console.error("Error fetching staff stats:", error);
        throw new Error("Failed to fetch staff statistics");
    }
}

export async function createStaffMember(data: {
    fullName: string;
    email: string;
    phone: string;
    role: string;
    password: string;
    storeId: string;
    branchId: string;
}) {
    try {
        await connectToDB();
        
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            throw new Error("User with this email already exists");
        }
        
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(data.password, 12);
        
        const username = data.email.split('@')[0].toLowerCase();
        
        const newUser = new User({
            username,
            fullName: data.fullName,
            email: data.email,
            phoneNumber: data.phone,
            role: data.role,
            password: hashedPassword,
            storeId: data.storeId,
            accessLocation: [data.branchId],
            isActive: true
        });
        
        await newUser.save();
        return newUser;
    } catch (error) {
        console.error("Error creating staff member:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to create staff member");
    }
}

export async function updateStaffMember(userId: string, data: {
    fullName?: string;
    email?: string;
    phone?: string;
    role?: string;
    isActive?: boolean;
}) {
    try {
        await connectToDB();
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: data },
            { new: true }
        );
        
        if (!updatedUser) {
            throw new Error("Staff member not found");
        }
        
        return updatedUser;
    } catch (error) {
        console.error("Error updating staff member:", error);
        throw new Error("Failed to update staff member");
    }
}

export async function deleteStaffMember(userId: string) {
    try {
        await connectToDB();
        
        const deletedUser = await User.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            throw new Error("Staff member not found");
        }
        
        return deletedUser;
    } catch (error) {
        console.error("Error deleting staff member:", error);
        throw new Error("Failed to delete staff member");
    }
}