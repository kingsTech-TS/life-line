"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import {
  ShoppingBag,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Package,
  X,
  Upload,
  Loader2,
  Tag as TagIcon,
  DollarSign,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

export default function VendorProducts() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    images: [] as string[],
    variants: [] as { type: string; options: string[] }[],
  });

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };

  const fetchItems = async () => {
    try {
      const res = await fetch(`/api/vendor/products?t=${Date.now()}`);
      const data = await res.json();

      if (!res.ok) {
        console.error("Vendor products API error:", res.status, data);
        if (res.status === 401) {
          toast.error("Session expired. Please log in again.");
          router.push("/vendor/login");
          return;
        }
        toast.error(data?.error || "Failed to load products.");
        return;
      }

      if (Array.isArray(data)) {
        setItems(data);
      } else {
        console.error("Unexpected response shape:", data);
        toast.error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Failed to fetch shop items", error);
      toast.error("Network error — could not load products.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      slug: item.slug || slugify(item.name),
      description: item.description,
      price: item.price,
      stock: item.stock,
      category: item.category,
      images: item.images || (item.image ? [item.image] : []),
      variants: item.variants || [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this shop item?")) return;

    try {
      const res = await fetch(`/api/vendor/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Item deleted successfully");
        fetchItems();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete item");
      }
    } catch (error) {
      toast.error("Error deleting item");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = editingItem ? "PUT" : "POST";
      const body = editingItem ? { ...formData, _id: editingItem._id } : formData;

      const res = await fetch("/api/vendor/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(`Item ${editingItem ? "updated" : "created"} successfully`);
        setIsDialogOpen(false);
        fetchItems();
        resetForm();
      } else {
        const data = await res.json();
        toast.error(data.error || "Operation failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      images: [],
      variants: [],
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedImages: string[] = [...formData.images];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (res.ok) {
          const data = await res.json();
          uploadedImages.push(data.url);
        }
      }
      setFormData((prev) => ({ ...prev, images: uploadedImages }));
      toast.success("Images uploaded");
    } catch (error) {
      toast.error("Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            My Products
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Manage your store inventory and product listings.
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all group"
        >
          <Plus className="mr-2 group-hover:scale-110 transition-transform" />
          Add New Product
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <Input
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 rounded-2xl bg-card border-border/50 shadow-sm focus-visible:ring-primary/20"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-80 rounded-[2.5rem] bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 opacity-50">
          <Package size={56} className="text-muted-foreground" />
          <h3 className="text-xl font-black tracking-tight">
            {items.length === 0 ? "No products yet" : "No products match your search"}
          </h3>
          <p className="text-muted-foreground text-sm font-medium max-w-xs">
            {items.length === 0
              ? "Click \"Add New Product\" above to list your first product."
              : "Try a different search term."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item._id}
              className="group rounded-[2.5rem] border-border/50 bg-card overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={item.images?.[0] || item.image || "/placeholder.jpg"}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 rounded-xl bg-white/90 backdrop-blur-md shadow-lg hover:bg-primary hover:text-white transition-all"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 rounded-xl bg-white/90 backdrop-blur-md shadow-lg hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-black text-lg tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-2xl font-black text-primary">
                      ₦{item.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Package size={14} />
                      <span className="text-xs font-bold">
                        {item.stock} in stock
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col rounded-[3rem] p-8 overflow-hidden">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-3xl font-black tracking-tight">
              {editingItem ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2 mt-6 custom-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">
                  Product Name
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="h-12 rounded-xl bg-muted/30 border-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">
                  Category
                </label>
                <Input
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="h-12 rounded-xl bg-muted/30 border-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">
                Description
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-4 rounded-xl bg-muted/30 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">
                  Price (₦)
                </label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                  <Input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value),
                      })
                    }
                    className="pl-10 h-12 rounded-xl bg-muted/30 border-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">
                  Stock Quantity
                </label>
                <div className="relative">
                  <Package
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                  <Input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: parseInt(e.target.value),
                      })
                    }
                    className="pl-10 h-12 rounded-xl bg-muted/30 border-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">
                Product Images
              </label>
              <div className="grid grid-cols-4 gap-4">
                {formData.images.map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-xl overflow-hidden group"
                  >
                    <Image
                      src={img}
                      alt="Product"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <label className="aspect-square rounded-xl bg-muted/30 border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-all group">
                  {isUploading ? (
                    <Loader2 className="animate-spin text-primary" />
                  ) : (
                    <>
                      <Upload
                        size={20}
                        className="text-muted-foreground group-hover:text-primary transition-colors"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">
                        Upload
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all mt-4"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : editingItem ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
