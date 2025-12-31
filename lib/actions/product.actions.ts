"use server";

import { connectToDB } from "@/lib/mongoose";
import Product from "@/lib/models/product.models";
import Category from "../models/category.models";

export async function getProducts(storeId: string, branchId: string) {
  try {
    await connectToDB();
    const products = await Product.find({ storeId,branchId })
      .populate({path:'categoryId',model:Category, select:'name'})
      .lean();
      console.log(products);
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function createProduct(productData: any) {
  try {
    await connectToDB();
    const product = await Product.create(productData);
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error("Error creating product:", error);
    return null;
  }
}

export async function updateProduct(productId: string, updateData: any) {
  try {
    await connectToDB();
    const product = await Product.findByIdAndUpdate(productId, updateData, { new: true });
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error("Error updating product:", error);
    return null;
  }
}

export async function deleteProduct(productId: string) {
  try {
    await connectToDB();
    await Product.findByIdAndDelete(productId);
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
}

export async function getProductByBarcode(barcode: string, storeId: string) {
  try {
    await connectToDB();
    const product = await Product.findOne({ barcode, storeId }).lean();
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error("Error fetching product by barcode:", error);
    return null;
  }
}

export async function updateProductStock(productId: string, quantity: number) {
  try {
    await connectToDB();
    await Product.findByIdAndUpdate(productId, { $inc: { stock: -quantity } });
    return true;
  } catch (error) {
    console.error("Error updating product stock:", error);
    return false;
  }
}