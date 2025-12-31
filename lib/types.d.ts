import { Document, Schema } from "mongoose";

// User Types
export interface IUser extends Document {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  password: string;
  role: string;
  avatarUrl?: string;
  isActive: boolean;
  storeId: Schema.Types.ObjectId;
  accessLocation: Schema.Types.ObjectId[];
  isVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Store Types
export interface IStore extends Document {
  _id: string;
  name: string;
  avatar?: string;
  owner: Schema.Types.ObjectId;
  storeEmail: string;
  storePhone?: string;
  storeAddress?: string;
  numberOfBranches: number;
  subscriptionPlan: {
    period: { name: string; value: number };
    subscriptionExpiry: Date;
    paymentStatus: string;
    trialEndsAt: Date;
    isBlocked: boolean;
    blockedAt?: Date;
  };
  paymentHistory: {
    reference: string;
    amount: number;
    status: string;
    paidAt: Date;
    paymentMethod: string;
    transactionId: string;
  }[];
  banned: boolean;
  branchIds: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Branch Types
export interface IBranch extends Document {
  _id: Schema.Types.ObjectId;
  storeId: Schema.Types.ObjectId;
  name: string;
  address?: string;
  manager?: string;
  phone?: string;
  email?: string;
  operatingHours: {
    day: string;
    openingTime: string;
    closingTime: string;
  }[];
  posSettings: {
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
  };
  inventorySettings: {
    lowStockAlert: boolean;
    lowStockThreshold: number;
    autoReorder: boolean;
    reorderPoint: number;
    trackExpiry: boolean;
    batchTracking: boolean;
    serialNumberTracking: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Category Types
export interface ICategory extends Document {
  _id: string;
  storeId: Schema.Types.ObjectId;
  branchId: Schema.Types.ObjectId;
  name: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// Product Types
export interface IProduct extends Document {
  _id: string;
  storeId: Schema.Types.ObjectId;
  branchId: Schema.Types.ObjectId;
  categoryId: Schema.Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  sku: string;
  barcode?: string;
  stock: number;
  minStock: number;
  maxStock: number;
  supplier?: string;
  variations: {
    name: string;
    price: number;
    isAvailable: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Customer Types
export interface ICustomer extends Document {
  _id: string;
  storeId: Schema.Types.ObjectId;
  branchId: Schema.Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  loyaltyPoints: number;
  totalPurchases: number;
  lastVisit?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Sale Types
export interface ISale extends Document {
  _id: string;
  storeId: Schema.Types.ObjectId;
  branchId: Schema.Types.ObjectId;
  saleNumber: string;
  customerId?: Schema.Types.ObjectId;
  customerName?: string;
  customerPhone?: string;
  saleType: 'in-store' | 'online' | 'phone';
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  items: {
    productId: Schema.Types.ObjectId;
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
  paymentStatus: 'pending' | 'partial' | 'paid';
  paymentMethod?: string;
  notes?: string;
  cashierId?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}