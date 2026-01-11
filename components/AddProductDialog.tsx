"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Tag } from "lucide-react";
import { toast } from "sonner";
import { getCategories, createCategory } from "@/lib/actions/category.actions";
import { createProduct } from "@/lib/actions/product.actions";
import CreateCategoryDialog from "@/components/CreateCategoryDialog";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { useSubscriptionHandler } from "@/hooks/use-subscription-handler";

interface AddProductDialogProps {
  storeId: string;
  branchId: string;
  onProductAdded?: () => void;
}

export default function AddProductDialog({ storeId, branchId, onProductAdded }: AddProductDialogProps) {
  const { inventorySettings } = useSettings();
  const { executeWithSubscriptionCheck } = useSubscriptionHandler();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    barcode: "",
    minStock: "",
    costPrice: ""
  });

  useEffect(() => {
    const loadCategories = async () => {
      const categoriesData = await getCategories(storeId);
      setCategories(categoriesData);
    };
    if (open) {
      loadCategories();
    }
  }, [open, storeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) {
      toast.error("Name, price, and stock are required");
      return;
    }

    setLoading(true);
    
    const result = await executeWithSubscriptionCheck(async () => {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        minStock: formData.minStock ? parseInt(formData.minStock) : inventorySettings.lowStockThreshold,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : 0,
        branchId: branchId,
        categoryId: formData.category
      };
      
      return await createProduct(storeId, productData);
    }, "Failed to add product");
    
    if (result) {
      toast.success("Product added successfully");
      setOpen(false);
      setFormData({
        name: "",
        sku: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        barcode: "",
        minStock: "",
        costPrice: ""
      });
      onProductAdded?.();
    }
    
    setLoading(false);
  };

  const handleCategoryCreated = async () => {
    const categoriesData = await getCategories(storeId);
    setCategories(categoriesData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="iPhone 15 Pro"
                required
              />
            </div>
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                placeholder="IPH15P"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="category">Category</Label>
              <CreateCategoryDialog storeId={storeId} onCategoryCreated={handleCategoryCreated} />
            </div>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="costPrice">Cost Price</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                value={formData.costPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, costPrice: e.target.value }))}
                placeholder="500.00"
              />
            </div>
            <div>
              <Label htmlFor="price">Selling Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="999.99"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                placeholder="25"
                required
              />
            </div>
            <div>
              <Label htmlFor="minStock">Minimum Stock Alert</Label>
              <Input
                id="minStock"
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData(prev => ({ ...prev, minStock: e.target.value }))}
                placeholder={inventorySettings.lowStockThreshold.toString()}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="barcode">Barcode</Label>
            <Input
              id="barcode"
              value={formData.barcode}
              onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
              placeholder="123456789012"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Product description..."
              rows={3}
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}