"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  TrendingUp,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  FileText,
  X,
  Upload,
  Loader2,
  Calendar,
  Tag as TagIcon,
  CheckCircle2,
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

export default function AdminImpact() {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    year: new Date().getFullYear(),
    tags: "" as string | string[],
  });

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/admin/impact");
      const data = await res.json();
      if (Array.isArray(data)) {
        setReports(data);
      }
    } catch (error) {
      console.error("Failed to fetch reports", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleEdit = (report: any) => {
    setEditingItem(report);
    setFormData({
      title: report.title,
      description: report.description,
      imageUrl: report.imageUrl,
      year: report.year,
      tags: report.tags?.join(", ") || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      const res = await fetch(`/api/admin/impact?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Report deleted successfully");
        fetchReports();
      } else {
        toast.error("Failed to delete report");
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
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
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
    if (!formData.imageUrl) {
      toast.error("Please upload an image first");
      return;
    }

    setIsSubmitting(true);
    try {
      // Process tags into array
      const processedTags =
        typeof formData.tags === "string"
          ? formData.tags
              .split(",")
              .map((t) => t.trim())
              .filter((t) => t !== "")
          : formData.tags;

      const url = "/api/admin/impact";
      const method = editingItem ? "PUT" : "POST";
      const body = editingItem
        ? { ...formData, tags: processedTags, _id: editingItem._id }
        : { ...formData, tags: processedTags };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(
          editingItem ? "Impact report updated!" : "Impact report created!",
        );
        setIsDialogOpen(false);
        setEditingItem(null);
        fetchReports();
        setFormData({
          title: "",
          description: "",
          imageUrl: "",
          year: new Date().getFullYear(),
          tags: "",
        });
      } else {
        toast.error(
          editingItem ? "Failed to update report" : "Failed to create report",
        );
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReports = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.year.toString().includes(searchTerm),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
            Impact Reports
          </h1>
          <p className="text-foreground/60 text-lg">
            Publish and manage impact reports and performance data.
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="rounded-2xl h-12 px-6 flex items-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={20} /> <span className="font-bold">New Report</span>
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
              placeholder="Search by title or year..."
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
                  Report Details
                </th>
                <th className="pb-2 font-bold text-xs uppercase tracking-widest px-4 text-center">
                  Year
                </th>
                <th className="pb-2 font-bold text-xs uppercase tracking-widest px-4">
                  Tags
                </th>
                <th className="pb-2 font-bold text-xs uppercase tracking-widest text-right px-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2
                        className="animate-spin text-primary"
                        size={32}
                      />
                      <span className="text-foreground/40 font-medium tracking-wide">
                        Fetching reports...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <FileText size={48} />
                      <span className="text-lg font-semibold italic">
                        No reports found
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr
                    key={report._id}
                    className="group bg-muted/20 hover:bg-muted/40 transition-all rounded-3xl"
                  >
                    <td className="py-5 px-4 rounded-l-3xl">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-md bg-muted flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          {report.imageUrl ? (
                            <Image
                              src={report.imageUrl}
                              alt={report.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <FileText size={24} />
                          )}
                        </div>
                        <div className="flex flex-col max-w-sm">
                          <span className="font-bold text-foreground text-base line-clamp-1 group-hover:text-primary transition-colors">
                            {report.title}
                          </span>
                          <span className="text-xs text-foreground/40 line-clamp-1">
                            {report.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <span className="text-sm font-black text-foreground bg-muted/50 px-3 py-1 rounded-lg border border-foreground/5 shadow-sm">
                        {report.year}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex gap-2 flex-wrap max-w-[200px]">
                        {report.tags
                          ?.slice(0, 3)
                          .map((tag: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-tight ring-1 ring-primary/20"
                            >
                              {tag}
                            </span>
                          ))}
                        {report.tags?.length > 3 && (
                          <span className="text-[10px] font-bold text-foreground/30">
                            +{report.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-5 text-right px-6 rounded-r-3xl">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(report)}
                          className="p-2.5 bg-background hover:bg-primary/10 hover:text-primary rounded-xl shadow-sm border border-border transition-all"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(report._id)}
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

      {/* New Report Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
          <div className="flex flex-col h-[85vh] md:h-auto max-h-[90vh]">
            <DialogHeader className="p-6 md:p-8 pb-4 bg-muted/30">
              <div className="flex justify-between items-center">
                <div>
                  <DialogTitle className="text-2xl md:text-3xl font-black tracking-tight underline decoration-primary decoration-4 underline-offset-8">
                    {editingItem ? "Edit Impact Report" : "Annual Report"}
                  </DialogTitle>
                  <p className="text-foreground/50 mt-2 font-medium text-sm md:text-base">
                    Document the transparency and impact of your foundation.
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
              className="flex-1 overflow-y-auto p-6 md:p-8 pt-4 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-foreground/60 ml-1">
                      Report Title
                    </label>
                    <Input
                      required
                      className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary font-bold text-lg"
                      placeholder="e.g. 2024 Performance Review"
                      value={formData.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase tracking-widest text-foreground/60 ml-1">
                        Fiscal Year
                      </label>
                      <Input
                        required
                        type="number"
                        className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary font-bold"
                        placeholder="2025"
                        value={formData.year}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({
                            ...formData,
                            year: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase tracking-widest text-foreground/60 ml-1">
                        Tags (Comma Sep)
                      </label>
                      <Input
                        required
                        className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary font-bold"
                        placeholder="Health, Transparency..."
                        value={formData.tags as string}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({ ...formData, tags: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-foreground/60 ml-1">
                      Summary Description
                    </label>
                    <textarea
                      required
                      className="w-full p-4 min-h-[120px] rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary font-medium resize-none outline-none transition-all"
                      placeholder="High-level overview of the report's findings..."
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

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-foreground/60 ml-1">
                      Report Thumbnail / Cover
                    </label>
                    <div className="relative group">
                      <div className="relative aspect-video rounded-[1.5rem] bg-muted/50 border-2 border-dashed border-foreground/10 group-hover:border-primary/40 transition-all overflow-hidden flex flex-col items-center justify-center gap-2 text-center p-4">
                        {formData.imageUrl ? (
                          <>
                            <Image
                              src={formData.imageUrl}
                              alt="Report cover"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2">
                                <Upload size={16} /> Change Cover
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
                              <Upload
                                className="text-foreground/20 group-hover:text-primary/50 transition-colors"
                                size={40}
                              />
                            )}
                            <label className="mt-2 cursor-pointer bg-primary/10 text-primary hover:bg-primary hover:text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all scale-100 active:scale-95">
                              {isUploading
                                ? "Uploading..."
                                : "Upload Cover Image"}
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

                  <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="text-primary" size={20} />
                      <span className="text-sm font-black uppercase tracking-widest text-primary/80">
                        Transparency Note
                      </span>
                    </div>
                    <p className="text-xs text-foreground/60 leading-relaxed font-medium italic">
                      "Publishing regular impact reports builds trust with
                      donors and partners. Ensure all data is verified before
                      submission."
                    </p>
                  </div>
                </div>
              </div>
            </form>

            <div className="p-8 bg-muted/10 border-t border-border flex flex-col md:flex-row gap-4 items-center justify-end">
              <div className="flex gap-4 w-full md:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="rounded-2xl h-14 px-8 border-2 border-foreground/10 hover:bg-muted font-bold flex-1 md:flex-none transition-all"
                >
                  Discard
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isUploading}
                  className="rounded-2xl h-14 px-10 bg-primary hover:bg-primary/90 text-white font-black text-base shadow-xl shadow-primary/20 flex-1 md:flex-none transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={20} />
                      {editingItem ? "Updating..." : "Publishing..."}
                    </>
                  ) : editingItem ? (
                    "Update Impact Report"
                  ) : (
                    "Publish Impact Report"
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
