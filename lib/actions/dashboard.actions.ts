"use server";

import { connectToDB } from "../mongoose";
import Sale from "../models/sale.models";
import Product from "../models/product.models";
import Customer from "../models/customer.models";
import User from "../models/user.models";
import { Types } from "mongoose";
import Category from "../models/category.models";
import { withSubscriptionCheckByStoreId } from "@/lib/utils/subscription-wrapper";

export const getDashboardData = withSubscriptionCheckByStoreId(async (storeId: string, branchId: string, startDate?: Date, endDate?: Date) => {
  try {
    await connectToDB();

    const start = startDate || new Date(new Date().setHours(0, 0, 0, 0));
    const end = endDate || new Date(new Date().setHours(23, 59, 59, 999));
    const yesterday = new Date(start.getTime() - 24 * 60 * 60 * 1000);

    // Today's sales and revenue
    console.log('Dashboard query params:', { storeId, branchId, start, end });
    
    const todaySales = await Sale.find({
      storeId: new Types.ObjectId(storeId),
      branchId: new Types.ObjectId(branchId),
      createdAt: { $gte: start, $lte: end }
    });

    const yesterdaySales = await Sale.find({
      storeId: new Types.ObjectId(storeId),
      branchId: new Types.ObjectId(branchId),
      createdAt: { $gte: yesterday, $lt: start }
    });
    
    console.log('Found sales:', { todayCount: todaySales.length, yesterdayCount: yesterdaySales.length });

    const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    const yesterdayRevenue = yesterdaySales.reduce((sum, sale) => sum + sale.total, 0);
    const revenueChange = yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100) : 0;

    // Products and stock
    const products = await Product.find({
      storeId,
      branchId,
    }).populate({path:'categoryId',model:Category});

    const lowStockProducts = products.filter(p => p.stock <= (p.minStock || 5) && p.stock > 0);
    const outOfStockProducts = products.filter(p => p.stock === 0);

    // Customers
    const totalCustomers = await Customer.countDocuments({
      storeId
    });

    const newCustomers = await Customer.countDocuments({
      storeId,
      createdAt: { $gte: start, $lte: end }
    });

    // Weekly revenue (last 7 days)
    const weeklyRevenue = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(start.getTime() - i * 24 * 60 * 60 * 1000);
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000 - 1);
      
      const daySales = await Sale.find({
        storeId: new Types.ObjectId(storeId),
        branchId: new Types.ObjectId(branchId),
        createdAt: { $gte: dayStart, $lte: dayEnd }
      });

      const dayRevenue = daySales.reduce((sum, sale) => sum + sale.total, 0);
      weeklyRevenue.push({
        day: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: dayRevenue
      });
    }

    // Popular products (from sales)
    const salesWithProducts = await Sale.find({
      storeId: new Types.ObjectId(storeId),
      branchId: new Types.ObjectId(branchId),
      createdAt: { $gte: start, $lte: end }
    });

    console.log('Sales for popular products:', salesWithProducts.length);

    const productSales = new Map();
    salesWithProducts.forEach(sale => {
      sale.items.forEach((item: any) => {
        const key = item.name;
        if (productSales.has(key)) {
          const existing = productSales.get(key);
          existing.quantity += item.quantity;
          existing.revenue += item.price * item.quantity;
        } else {
          productSales.set(key, {
            name: item.name,
            quantity: item.quantity,
            revenue: item.price * item.quantity
          });
        }
      });
    });

    const popularProducts = Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Recent sales
    const recentSales = await Sale.find({
      storeId: new Types.ObjectId(storeId),
      branchId: new Types.ObjectId(branchId)
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('saleNumber total status createdAt');

    // Active staff
    const activeStaff = await User.countDocuments({
      storeId,
      isActive: true,
      role: { $in: ['admin', 'manager', 'sales_associate', 'cashier', 'inventory_manager'] }
    });

    return {
      sales: {
        today: todaySales.length,
        change: yesterdaySales.length > 0 ? ((todaySales.length - yesterdaySales.length) / yesterdaySales.length * 100) : 0,
        target: 50 // Daily sales target
      },
      revenue: {
        today: todayRevenue,
        change: Math.round(revenueChange),
        target: 10000 // Daily revenue target
      },
      products: {
        total: products.length,
        lowStock: lowStockProducts.length,
        outOfStock: outOfStockProducts.length
      },
      customers: {
        total: totalCustomers,
        new: newCustomers,
        goal: 1000 // Customer goal
      },
      performance: {
        avgSaleTime: 3,
        customerSatisfaction: 4.7,
        weeklyRevenue
      },
      popularProducts,
      recentSales,
      staff: {
        active: activeStaff
      }
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
});