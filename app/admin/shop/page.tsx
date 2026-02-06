"use client";

import { useEffect, useState } from "react";
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

export default function AdminShop() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    image: "",
  });

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/shop");
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch shop items", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this shop item?")) return;

    try {
      const res = await fetch(`/api/admin/shop?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Item deleted successfully");
        fetchItems();
      } else {
        toast.error("Failed to delete item");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, image: data.url }));
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error("Please upload an image first");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Product added to shop!");
        setIsDialogOpen(false);
        fetchItems();
        setFormData({
          name: "",
          description: "",
          price: 0,
          stock: 0,
          category: "",
          image: "",
        });
      } else {
        toast.error("Failed to add product");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = items.filter(
    (i) =>
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
            Shop Inventory
          </h1>
          <p className="text-foreground/60 text-lg">
            Add and manage products in the LifeLine shop.
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="rounded-2xl h-12 px-6 flex items-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={20} /> <span className="font-bold">New Product</span>
        </Button>
      </div>

      <Card className="p-8 rounded-[2rem] border-none shadow-xl shadow-foreground/5 bg-background/50 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-primary transition-colors"
              size={20}
            />
            <Input
              placeholder="Search by name or category..."
              className="pl-12 h-14 rounded-2xl bg-muted/30 border-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary transition-all text-base"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-4">
            <thead>
              <tr className="text-foreground/40">
                <th className="pb-2 font-bold text-xs uppercase tracking-widest px-4">
                  Product Details
                </th>
                <th className="pb-2 font-bold text-xs uppercase tracking-widest px-4">
                  Price
                </th>
                <th className="pb-2 font-bold text-xs uppercase tracking-widest px-4 text-center">
                  Stock
                </th>
                <th className="pb-2 font-bold text-xs uppercase tracking-widest px-4">
                  Category
                </th>
                <th className="pb-2 font-bold text-xs uppercase tracking-widest text-right px-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2
                        className="animate-spin text-primary"
                        size={32}
                      />
                      <span className="text-foreground/40 font-medium tracking-wide">
                        Loading inventory...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <ShoppingBag size={48} />
                      <span className="text-lg font-semibold italic">
                        No products found
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item._id}
                    className="group bg-muted/20 hover:bg-muted/40 transition-all rounded-3xl"
                  >
                    <td className="py-5 px-4 rounded-l-3xl">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-md bg-muted flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Package size={24} />
                          )}
                        </div>
                        <div className="flex flex-col max-w-sm">
                          <span className="font-bold text-foreground text-base line-clamp-1 group-hover:text-primary transition-colors">
                            {item.name}
                          </span>
                          <span className="text-xs text-foreground/40 line-clamp-1 italic">
                            {item.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <span className="text-sm font-black text-foreground">
                        ₦{item.price.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <span
                        className={`text-sm font-bold ${item.stock < 10 ? "text-red-500" : "text-foreground"}`}
                      >
                        {item.stock}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      <span className="px-3 py-1 rounded-full bg-zinc-500/10 text-zinc-500 text-[10px] font-black uppercase tracking-widest ring-1 ring-zinc-500/30">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-5 text-right px-6 rounded-r-3xl">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2.5 bg-background hover:bg-primary/10 hover:text-primary rounded-xl shadow-sm border border-border transition-all">
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2.5 bg-background hover:bg-red-500/10 hover:text-red-500 rounded-xl shadow-sm border border-border transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
          <div className="flex flex-col h-[90vh] md:h-auto max-h-[95vh]">
            <DialogHeader className="p-8 pb-4 bg-muted/30">
              <div className="flex justify-between items-center">
                <div>
                  <DialogTitle className="text-3xl font-black tracking-tight underline decoration-primary decoration-4 underline-offset-8">
                    Add Product
                  </DialogTitle>
                  <p className="text-foreground/50 mt-2 font-medium">
                    List a new item in the charity shop.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDialogOpen(false)}
                  className="rounded-full hover:bg-muted"
                >
                  <X size={24} />
                </Button>
              </div>
            </DialogHeader>

            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-8 pt-4 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-foreground/60 ml-1">
                      Product Name
                    </label>
                    <Input
                      required
                      className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary font-bold text-lg"
                      placeholder="e.g. LifeLine Charity Branded T-Shirt"
                      value={formData.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase tracking-widest text-foreground/60 ml-1">
                        Price (₦)
                      </label>
                      <Input
                        required
                        type="number"
                        className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary font-bold"
                        placeholder="5,000"
                        value={formData.price}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({
                            ...formData,
                            price: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase tracking-widest text-foreground/60 ml-1">
                        Initial Stock
                      </label>
                      <Input
                        required
                        type="number"
                        className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary font-bold"
                        placeholder="100"
                        value={formData.stock}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({
                            ...formData,
                            stock: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-foreground/60 ml-1">
                      Product Category
                    </label>
                    <Input
                      required
                      className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary font-bold"
                      placeholder="Apparel, Accessories, Art..."
                      value={formData.category}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-foreground/60 ml-1">
                      Product Image
                    </label>
                    <div className="relative group">
                      <div className="relative aspect-square rounded-[1.5rem] bg-muted/50 border-2 border-dashed border-foreground/10 group-hover:border-primary/40 transition-all overflow-hidden flex flex-col items-center justify-center gap-2 text-center p-4">
                        {formData.image ? (
                          <>
                            <Image
                              src={formData.image}
                              alt="Product preview"
                              fill
                              className="object-contain p-4"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2">
                                <Upload size={16} /> Change Image
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                />
                              </label>
                            </div>
                          </>
                        ) : (
                          <>
                            {isUploading ? (
                              <Loader2
                                className="animate-spin text-primary"
                                size={32}
                              />
                            ) : (
                              <ShoppingBag
                                className="text-foreground/20 group-hover:text-primary/50 transition-colors"
                                size={40}
                              />
                            )}
                            <label className="mt-2 cursor-pointer bg-primary/10 text-primary hover:bg-primary hover:text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all scale-100 active:scale-95">
                              {isUploading
                                ? "Uploading..."
                                : "Select Product Image"}
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isUploading}
                              />
                            </label>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-foreground/60 ml-1">
                      Short Description
                    </label>
                    <textarea
                      required
                      className="w-full p-4 min-h-[100px] rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary font-medium resize-none outline-none transition-all"
                      placeholder="Briefly describe the product and its impact..."
                      value={formData.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </form>

            <div className="p-8 bg-muted/10 border-t border-border flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="text-xs font-bold text-foreground/40 italic flex items-center gap-2">
                  <Layers size={14} /> Proceeds from sales directly fund
                  projects.
                </p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="rounded-2xl h-14 px-8 border-2 border-foreground/10 hover:bg-muted font-bold flex-1 md:flex-none transition-all"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isUploading}
                  className="rounded-2xl h-14 px-10 bg-primary hover:bg-primary/90 text-white font-black text-base shadow-xl shadow-primary/20 flex-1 md:flex-none transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={20} />
                      Adding...
                    </>
                  ) : (
                    "List Product"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
