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

  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    images: [] as string[],
    variants: [] as { type: string; options: string[] }[],
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

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
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
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImages: string[] = [...formData.images];

    try {
      for (let i = 0; i < files.length; i++) {
        const uploadData = new FormData();
        uploadData.append("file", files[i]);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });
        const data = await res.json();
        if (data.url) {
          newImages.push(data.url);
        } else {
          toast.error(`Upload failed for ${files[i].name}`);
        }
      }
      setFormData((prev) => ({ ...prev, images: newImages }));
      toast.success("Images uploaded successfully");
    } catch (error) {
      toast.error("Error uploading images");
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

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { type: "", options: [""] }],
    }));
  };

  const updateVariantType = (index: number, type: string) => {
    const newVariants = [...formData.variants];
    newVariants[index].type = type;
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  const addOption = (variantIndex: number) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].options.push("");
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  const updateOption = (
    variantIndex: number,
    optionIndex: number,
    value: string,
  ) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].options[optionIndex] = value;
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  const removeVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = "/api/admin/shop";
      const method = editingItem ? "PUT" : "POST";

      // For backward compatibility on the backend, we still send 'image' as the first image
      const body = {
        ...formData,
        image: formData.images[0],
        _id: editingItem?._id,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(
          editingItem ? "Product updated!" : "Product added to shop!",
        );
        setIsDialogOpen(false);
        setEditingItem(null);
        fetchItems();
        setFormData({
          name: "",
          description: "",
          price: 0,
          stock: 0,
          category: "",
          images: [],
          variants: [],
        });
      } else {
        toast.error(
          editingItem ? "Failed to update product" : "Failed to add product",
        );
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
          onClick={() => {
            setEditingItem(null);
            setFormData({
              name: "",
              description: "",
              price: 0,
              stock: 0,
              category: "",
              images: [],
              variants: [],
            });
            setIsDialogOpen(true);
          }}
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
                          {item.images?.length > 0 || item.image ? (
                            <Image
                              src={item.images?.[0] || item.image}
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
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2.5 bg-background hover:bg-primary/10 hover:text-primary rounded-xl shadow-sm border border-border transition-all"
                        >
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
          <div className="flex flex-col h-[85vh] md:h-auto max-h-[90vh]">
            <DialogHeader className="p-6 md:p-8 pb-4 bg-muted/30">
              <div className="flex justify-between items-center">
                <div>
                  <DialogTitle className="text-2xl md:text-3xl font-black tracking-tight underline decoration-primary decoration-4 underline-offset-8">
                    {editingItem ? "Edit Product" : "Add Product"}
                  </DialogTitle>
                  <p className="text-foreground/50 mt-2 font-medium text-sm md:text-base">
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
              className="flex-1 overflow-y-auto p-6 md:p-8 pt-4 space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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

                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-foreground/60 ml-1">
                      Product Description
                    </label>
                    <textarea
                      required
                      className="w-full p-4 min-h-[140px] rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary font-medium resize-none outline-none transition-all"
                      placeholder="Explain the mission and scope of this product..."
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

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-sm font-black uppercase tracking-widest text-foreground/60 ml-1">
                      Product Gallery
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {formData.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-2xl overflow-hidden group border border-border"
                        >
                          <Image
                            src={img}
                            alt="Gallery"
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      <label className="aspect-square rounded-2xl border-2 border-dashed border-foreground/10 hover:border-primary/40 transition-all flex flex-col items-center justify-center cursor-pointer bg-muted/20">
                        {isUploading ? (
                          <Loader2
                            className="animate-spin text-primary"
                            size={24}
                          />
                        ) : (
                          <>
                            <Plus className="text-foreground/20" size={32} />
                            <span className="text-[10px] font-black uppercase tracking-widest mt-2">
                              Add Image
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-black uppercase tracking-widest text-foreground/60 ml-1">
                        Variants (Size, Color, etc.)
                      </label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={addVariant}
                        className="text-xs font-bold text-primary hover:text-primary hover:bg-primary/5 px-2 h-7"
                      >
                        <Plus size={14} className="mr-1" /> Add Group
                      </Button>
                    </div>

                    <div className="space-y-6">
                      {formData.variants.map((v, vIdx) => (
                        <div
                          key={vIdx}
                          className="p-5 rounded-[1.5rem] bg-muted/30 border border-border/50 relative group/variant"
                        >
                          <button
                            type="button"
                            onClick={() => removeVariant(vIdx)}
                            className="absolute -top-2 -right-2 p-1.5 bg-background border border-border text-foreground/40 hover:text-red-500 rounded-full shadow-sm transition-colors"
                          >
                            <X size={14} />
                          </button>

                          <div className="space-y-4">
                            <Input
                              placeholder="e.g. Size"
                              className="h-10 rounded-xl bg-background border-none focus-visible:ring-1 focus-visible:ring-primary font-bold text-sm"
                              value={v.type}
                              onChange={(e) =>
                                updateVariantType(vIdx, e.target.value)
                              }
                            />

                            <div className="flex flex-wrap gap-2">
                              {v.options.map((opt, oIdx) => (
                                <div
                                  key={oIdx}
                                  className="flex items-center gap-1"
                                >
                                  <Input
                                    placeholder="Value"
                                    className="h-9 w-20 rounded-lg bg-background border-none focus-visible:ring-1 focus-visible:ring-primary text-xs font-medium"
                                    value={opt}
                                    onChange={(e) =>
                                      updateOption(vIdx, oIdx, e.target.value)
                                    }
                                  />
                                </div>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addOption(vIdx)}
                                className="h-9 w-9 p-0 rounded-lg border-dashed"
                              >
                                <Plus size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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
                      {editingItem ? "Updating..." : "Adding..."}
                    </>
                  ) : editingItem ? (
                    "Update Product"
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
