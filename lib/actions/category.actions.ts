"use server";

import { connectToDB } from "@/lib/mongoose";
import Category from "@/lib/models/category.models";

export async function getCategories(storeId: string) {
  try {
    await connectToDB();
    const categories = await Category.find({ store: storeId }).lean();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function createCategory(categoryData: any) {
  try {
    await connectToDB();
    const category = await Category.create(categoryData);
    return JSON.parse(JSON.stringify(category));
  } catch (error) {
    console.error("Error creating category:", error);
    return null;
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    await connectToDB();
    await Category.findByIdAndDelete(categoryId);
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    return false;
  }
}