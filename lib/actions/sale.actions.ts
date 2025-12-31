"use server";

import { connectToDB } from "@/lib/mongoose";
import Sale from "@/lib/models/sale.models";
import Customer from "@/lib/models/customer.models";

export async function getSales(storeId: string, branchId: string, limit?: number) {
  try {
    await connectToDB();
    const query = Sale.find({ storeId, branchId })
      .populate('customerId', 'name email phone')
      .sort({ createdAt: -1 });
    
    if (limit) {
      query.limit(limit);
    }
    
    const sales = await query.lean();
    return JSON.parse(JSON.stringify(sales));
  } catch (error) {
    console.error("Error fetching sales:", error);
    return [];
  }
}

export async function getSaleStats(storeId: string, branchId: string) {
  try {
    await connectToDB();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    // Today's sales
    const todaySales = await Sale.find({
      storeId,
      branchId,
      createdAt: { $gte: today }
    }).lean();
    
    // Yesterday's sales
    const yesterdaySales = await Sale.find({
      storeId,
      branchId,
      createdAt: { $gte: yesterday, $lt: today }
    }).lean();
    
    // This month's sales
    const thisMonthSales = await Sale.find({
      storeId,
      branchId,
      createdAt: { $gte: thisMonth }
    }).lean();
    
    const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    const yesterdayRevenue = yesterdaySales.reduce((sum, sale) => sum + sale.total, 0);
    const thisMonthRevenue = thisMonthSales.reduce((sum, sale) => sum + sale.total, 0);
    
    const todayTransactions = todaySales.length;
    const yesterdayTransactions = yesterdaySales.length;
    
    const avgSale = todayTransactions > 0 ? todayRevenue / todayTransactions : 0;
    
    return {
      todayRevenue,
      todayTransactions,
      avgSale,
      thisMonthRevenue,
      revenueGrowth: yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100) : 0,
      transactionGrowth: yesterdayTransactions > 0 ? ((todayTransactions - yesterdayTransactions) / yesterdayTransactions * 100) : 0
    };
  } catch (error) {
    console.error("Error fetching sale stats:", error);
    return {
      todayRevenue: 0,
      todayTransactions: 0,
      avgSale: 0,
      thisMonthRevenue: 0,
      revenueGrowth: 0,
      transactionGrowth: 0
    };
  }
}

export async function createSale(saleData: {
  storeId: string;
  branchId: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    variations?: string[];
    discount?: number;
  }[];
  subtotal: number;
  tax: number;
  taxType?: 'percentage' | 'fixed';
  discount: number;
  discountType?: 'percentage' | 'fixed';
  total: number;
  paymentMethod?: string;
  notes?: string;
  cashierId?: string;
}) {
  try {
    console.log('createSale called with:', saleData);
    await connectToDB();
    
    // Generate sale number
    const saleCount = await Sale.countDocuments({ storeId: saleData.storeId, branchId: saleData.branchId });
    const saleNumber = `S${String(saleCount + 1).padStart(6, '0')}`;
    
    console.log('Creating sale with number:', saleNumber);
    const sale = await Sale.create({
      ...saleData,
      saleNumber,
      status: 'completed',
      paymentStatus: 'paid'
    });
    
    console.log('Sale created successfully:', sale._id);
    
    // Update customer total purchases and loyalty points if customer exists
    if (saleData.customerId) {
      await Customer.findByIdAndUpdate(saleData.customerId, {
        $inc: {
          totalPurchases: saleData.total,
          loyaltyPoints: Math.floor(saleData.total / 10) // 1 point per $10
        },
        lastVisit: new Date()
      });
    }
    
    return { success: true, sale: JSON.parse(JSON.stringify(sale)) };
  } catch (error) {
    console.error("Error creating sale:", error);
    console.error("Sale data that failed:", saleData);
    return { success: false, error: error.message || "Failed to create sale" };
  }
}

export async function updateSaleStatus(saleId: string, status: 'pending' | 'completed' | 'cancelled' | 'refunded') {
  try {
    await connectToDB();
    const sale = await Sale.findByIdAndUpdate(
      saleId,
      { status },
      { new: true }
    );
    return { success: true, sale: JSON.parse(JSON.stringify(sale)) };
  } catch (error) {
    console.error("Error updating sale status:", error);
    return { success: false, error: "Failed to update sale status" };
  }
}

export async function getSaleDetails(saleId: string) {
  try {
    await connectToDB();
    const sale = await Sale.findById(saleId)
      .populate('customerId', 'name email phone')
      .populate('items.productId', 'name image')
      .lean();
    return JSON.parse(JSON.stringify(sale));
  } catch (error) {
    console.error("Error fetching sale details:", error);
    return null;
  }
}

export async function refundSale(saleId: string, refundAmount?: number) {
  try {
    await connectToDB();
    const sale = await Sale.findById(saleId);
    if (!sale) {
      return { success: false, error: "Sale not found" };
    }
    
    const actualRefundAmount = refundAmount || sale.total;
    
    await Sale.findByIdAndUpdate(saleId, {
      status: 'refunded',
      paymentStatus: 'refunded'
    });
    
    // Deduct from customer total purchases and loyalty points if customer exists
    if (sale.customerId) {
      await Customer.findByIdAndUpdate(sale.customerId, {
        $inc: {
          totalPurchases: -actualRefundAmount,
          loyaltyPoints: -Math.floor(actualRefundAmount / 10)
        }
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error refunding sale:", error);
    return { success: false, error: "Failed to refund sale" };
  }
}

export async function getTodaysSales(storeId: string, branchId: string) {
  try {
    await connectToDB();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sales = await Sale.find({
      storeId,
      branchId,
      createdAt: { $gte: today }
    }).lean();
    
    const todaySales = sales.length;
    const todayRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    
    return { todaySales, todayRevenue };
  } catch (error) {
    console.error("Error fetching today's sales:", error);
    return { todaySales: 0, todayRevenue: 0 };
  }
}