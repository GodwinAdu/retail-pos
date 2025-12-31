"use server"

import { connectToDB } from "../mongoose";
import Branch from "../models/branch.models";
import { Types } from "mongoose";

interface UpdatePOSSettingsData {
    branchId: string;
    autoReceiptPrint: boolean;
    showItemImages: boolean;
    quickPayEnabled: boolean;
    taxIncluded: boolean;
    defaultTaxRate: number;
    allowDiscounts: boolean;
    maxDiscountPercent: number;
    requireCustomerInfo: boolean;
    soundEffects: boolean;
    compactMode: boolean;
    barcodeScanning: boolean;
    inventoryTracking: boolean;
    loyaltyProgram: boolean;
    multiCurrency: boolean;
}

export async function updatePOSSettings(data: UpdatePOSSettingsData) {
    try {
        await connectToDB();

        const updatedBranch = await Branch.findByIdAndUpdate(
            data.branchId,
            {
                $set: {
                    posSettings: {
                        autoReceiptPrint: data.autoReceiptPrint,
                        showItemImages: data.showItemImages,
                        quickPayEnabled: data.quickPayEnabled,
                        taxIncluded: data.taxIncluded,
                        defaultTaxRate: data.defaultTaxRate,
                        allowDiscounts: data.allowDiscounts,
                        maxDiscountPercent: data.maxDiscountPercent,
                        requireCustomerInfo: data.requireCustomerInfo,
                        soundEffects: data.soundEffects,
                        compactMode: data.compactMode,
                        barcodeScanning: data.barcodeScanning,
                        inventoryTracking: data.inventoryTracking,
                        loyaltyProgram: data.loyaltyProgram,
                        multiCurrency: data.multiCurrency,
                    }
                }
            },
            { new: true }
        );

        return {
            success: true,
            branch: {
                id: updatedBranch?._id.toString(),
                name: updatedBranch?.name,
            }
        };
    } catch (error) {
        console.error("Update POS settings error:", error);
        throw error;
    }
}

export async function getPOSSettings(branchId: string) {
    try {
        await connectToDB();
        
        const branch = await Branch.findById(branchId);
        
        if (!branch) {
            throw new Error("Branch not found");
        }
        
        return branch.posSettings;
    } catch (error) {
        console.error("Get POS settings error:", error);
        throw error;
    }
}