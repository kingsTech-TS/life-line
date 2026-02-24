"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Upload,
  Loader2,
  MapPin,
  Camera,
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

export default function AdminAmbassadors() {
  const [ambassadors, setAmbassadors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    state: "",
    image: "",
  });

  const fetchAmbassadors = async () => {
    try {
      const res = await fetch("/api/admin/ambassadors");
      const data = await res.json();
      if (Array.isArray(data)) {
        setAmbassadors(data);
      }
    } catch (error) {
      console.error("Failed to fetch ambassadors", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbassadors();
  }, []);

  const handleEdit = (ambassador: any) => {
    setEditingItem(ambassador);
    setFormData({
      name: ambassador.name,
      state: ambassador.state,
      image: ambassador.image,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ambassador?")) return;

    try {
      const res = await fetch(`/api/admin/ambassadors?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Ambassador deleted successfully");
        fetchAmbassadors();
      } else {
        toast.error("Failed to delete ambassador");
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
      const url = "/api/admin/ambassadors";
      const method = editingItem ? "PUT" : "POST";
      const body = editingItem
        ? { ...formData, _id: editingItem._id }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(
          editingItem
            ? "Ambassador updated successfully!"
            : "Ambassador created successfully!",
        );
        setIsDialogOpen(false);
        setEditingItem(null);
        fetchAmbassadors();
        setFormData({
          name: "",
          state: "",
          image: "",
        });
      } else {
        toast.error(
          editingItem
            ? "Failed to update ambassador"
            : "Failed to create ambassador",
        );
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = ambassadors.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.state.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
            Ambassadors
          </h1>
          <p className="text-foreground/60 text-lg">
            Manage your network of LifeLine State Ambassadors.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingItem(null);
            setFormData({ name: "", state: "", image: "" });
            setIsDialogOpen(true);
          }}
          className="rounded-2xl h-12 px-6 flex items-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={20} /> <span className="font-bold">New Ambassador</span>
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
              placeholder="Search by name or state..."
              className="pl-12 h-14 rounded-2xl bg-muted/30 border-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary transition-all text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-4">
            <thead>
              <tr className="text-foreground/40">
                <th className="pb-2 font-bold text-xs uppercase tracking-widest px-4">
                  Ambassador
                </th>
                <th className="pb-2 font-bold text-xs uppercase tracking-widest px-4">
                  State
                </th>
                <th className="pb-2 font-bold text-xs uppercase tracking-widest text-right px-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="py-20 text-center">
                    <Loader2
                      className="animate-spin text-primary mx-auto"
                      size={32}
                    />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="py-20 text-center opacity-30 italic"
                  >
                    No ambassadors found
                  </td>
                </tr>
              ) : (
                filtered.map((ambassador) => (
                  <tr
                    key={ambassador._id}
                    className="group bg-muted/20 hover:bg-muted/40 transition-all rounded-3xl"
                  >
                    <td className="py-5 px-4 rounded-l-3xl">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-sm">
                          <Image
                            src={ambassador.image || "/placeholder.svg"}
                            alt={ambassador.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-bold text-foreground text-base group-hover:text-primary transition-colors">
                          {ambassador.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-4 font-bold text-foreground/60 uppercase tracking-wide text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-primary" />
                        {ambassador.state}
                      </div>
                    </td>
                    <td className="py-5 text-right px-6 rounded-r-3xl">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(ambassador)}
                          className="p-2.5 bg-background hover:bg-primary/10 hover:text-primary rounded-xl shadow-sm border border-border transition-all"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(ambassador._id)}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
          <div className="flex flex-col">
            <DialogHeader className="p-8 pb-4 bg-muted/30 relative">
              <DialogTitle className="text-2xl font-black tracking-tight underline decoration-primary decoration-4 underline-offset-8">
                {editingItem ? "Edit Ambassador" : "New Ambassador"}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDialogOpen(false)}
                className="absolute right-6 top-6 rounded-full"
              >
                <X size={24} />
              </Button>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="relative group mx-auto w-32 h-32 mb-8">
                  <div className="relative w-full h-full rounded-[2rem] bg-muted/50 border-2 border-dashed border-foreground/10 group-hover:border-primary/40 transition-all overflow-hidden flex flex-col items-center justify-center p-1">
                    {formData.image ? (
                      <>
                        <Image
                          src={formData.image}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="cursor-pointer bg-white text-black p-2 rounded-full hover:scale-110 transition-transform">
                            <Camera size={20} />
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
                      <label className="cursor-pointer flex flex-col items-center gap-2 text-foreground/20 group-hover:text-primary/50 transition-colors">
                        {isUploading ? (
                          <Loader2 className="animate-spin" size={24} />
                        ) : (
                          <Camera size={32} />
                        )}
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {isUploading ? "..." : "Upload"}
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground/60 ml-2">
                    Full Name
                  </label>
                  <Input
                    required
                    className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary font-bold"
                    placeholder="Enter name..."
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground/60 ml-2">
                    State
                  </label>
                  <Input
                    required
                    className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary font-bold"
                    placeholder="e.g. LAGOS STATE"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        state: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="h-14 rounded-2xl flex-1 font-bold border-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="h-14 rounded-2xl flex-1 bg-primary text-white font-black shadow-lg shadow-primary/20"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : editingItem ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
