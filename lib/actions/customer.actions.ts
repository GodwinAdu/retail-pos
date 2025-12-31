"use server";

import { connectToDB } from "@/lib/mongoose";
import Customer from "@/lib/models/customer.models";
import Sale from "@/lib/models/sale.models";

export async function getCustomers(storeId: string, branchId?: string) {
  try {
    await connectToDB();
    const query = branchId ? { storeId, branchId } : { storeId };
    const customers = await Customer.find(query).lean();
    return JSON.parse(JSON.stringify(customers));
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

export async function getCustomerStats(storeId: string, branchId?: string) {
  try {
    await connectToDB();
    const query = branchId ? { storeId, branchId } : { storeId };
    const totalCustomers = await Customer.countDocuments(query);
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const newThisMonth = await Customer.countDocuments({ 
      ...query,
      createdAt: { $gte: thisMonth } 
    });
    const vipCustomers = await Customer.countDocuments({ 
      ...query,
      totalPurchases: { $gte: 1000 } 
    });
    const avgSpend = await Customer.aggregate([
      { $match: query },
      { $group: { _id: null, avg: { $avg: "$totalPurchases" } } }
    ]);
    
    return {
      totalCustomers,
      newThisMonth,
      vipCustomers,
      avgSpend: avgSpend[0]?.avg || 0
    };
  } catch (error) {
    console.error("Error fetching customer stats:", error);
    return { totalCustomers: 0, newThisMonth: 0, vipCustomers: 0, avgSpend: 0 };
  }
}

export async function createCustomer(customerData: {
  storeId: string;
  branchId?: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}) {
  try {
    await connectToDB();
    const customer = await Customer.create({
      ...customerData,
      loyaltyPoints: 0,
      totalPurchases: 0
    });
    return JSON.parse(JSON.stringify(customer));
  } catch (error) {
    console.error("Error creating customer:", error);
    return null;
  }
}

export async function updateCustomer(customerId: string, customerData: {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}) {
  try {
    await connectToDB();
    const customer = await Customer.findByIdAndUpdate(
      customerId,
      customerData,
      { new: true }
    );
    return { success: true, customer: JSON.parse(JSON.stringify(customer)) };
  } catch (error) {
    console.error("Error updating customer:", error);
    return { success: false, error: "Failed to update customer" };
  }
}

export async function deleteCustomer(customerId: string) {
  try {
    await connectToDB();
    await Customer.findByIdAndDelete(customerId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting customer:", error);
    return { success: false, error: "Failed to delete customer" };
  }
}

export async function getCustomerDetails(customerId: string) {
  try {
    await connectToDB();
    const customer = await Customer.findById(customerId).lean();
    const sales = await Sale.find({ customerId }).sort({ createdAt: -1 }).limit(10).lean();
    return {
      customer: JSON.parse(JSON.stringify(customer)),
      sales: JSON.parse(JSON.stringify(sales))
    };
  } catch (error) {
    console.error("Error fetching customer details:", error);
    return { customer: null, sales: [] };
  }
}

export async function updateCustomerLoyaltyPoints(customerId: string, points: number) {
  try {
    await connectToDB();
    await Customer.findByIdAndUpdate(customerId, { $inc: { loyaltyPoints: points } });
    return true;
  } catch (error) {
    console.error("Error updating loyalty points:", error);
    return false;
  }
}