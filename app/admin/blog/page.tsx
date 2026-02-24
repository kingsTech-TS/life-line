"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  FileText,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  X,
  Upload,
  Loader2,
  Calendar,
  User,
  Tag,
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
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";

export default function AdminBlog() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    image: "",
    author: "",
    category: "",
    status: "published" as "published" | "draft",
  });

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      if (Array.isArray(data)) {
        setBlogs(data);
      }
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleEdit = (blog: any) => {
    setEditingItem(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      image: blog.image,
      author: blog.author,
      category: blog.category,
      status: blog.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const res = await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Blog deleted successfully");
        fetchBlogs();
      } else {
        toast.error("Failed to delete blog");
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
      const url = "/api/admin/blog";
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
          editingItem ? "Blog post updated!" : "Blog post created!",
        );
        setIsDialogOpen(false);
        setEditingItem(null);
        fetchBlogs();
        setFormData({
          title: "",
          content: "",
          excerpt: "",
          image: "",
          author: "",
          category: "",
          status: "published",
        });
      } else {
        toast.error(
          editingItem ? "Failed to update blog" : "Failed to create blog",
        );
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
            Blog Posts
          </h1>
          <p className="text-foreground/60 text-lg">
            Create and manage your stories and updates.
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="rounded-2xl h-12 px-6 flex items-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={20} /> <span className="font-bold">New Blog Post</span>
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
              placeholder="Search by title or author..."
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
                  Post Information
                </th>
                <th className="pb-2 font-bold text-xs uppercase tracking-widest px-4">
                  Author & Category
                </th>
                <th className="pb-2 font-bold text-xs uppercase tracking-widest px-4">
                  Date
                </th>
                <th className="pb-2 font-bold text-xs uppercase tracking-widest px-4 text-center">
                  Status
                </th>
                <th className="pb-2 font-bold text-xs uppercase tracking-widest text-right px-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2
                        className="animate-spin text-primary"
                        size={32}
                      />
                      <span className="text-foreground/40 font-medium tracking-wide">
                        Fetching stories...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <FileText size={48} />
                      <span className="text-lg font-semibold italic">
                        No blog posts found
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="group bg-muted/20 hover:bg-muted/40 transition-all rounded-3xl"
                  >
                    <td className="py-5 px-4 rounded-l-3xl">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-md">
                          <Image
                            src={blog.image || "/placeholder.jpg"}
                            alt={blog.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col max-w-xs md:max-w-sm">
                          <span className="font-bold text-foreground text-base line-clamp-1 group-hover:text-primary transition-colors">
                            {blog.title}
                          </span>
                          <span className="text-xs text-foreground/40 font-medium">
                            /{blog.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground/70">
                          <User size={14} className="text-primary/60" />
                          {blog.author}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10 w-fit uppercase tracking-tighter">
                          <Tag size={10} />
                          {blog.category}
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground/60">
                          <Calendar size={14} />
                          {new Date(blog.createdAt).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <span
                        className={`
                        inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                        ${blog.status === "published" ? "bg-green-500/10 text-green-600 ring-1 ring-green-600/30" : "bg-zinc-500/10 text-zinc-500 ring-1 ring-zinc-500/30"}
                      `}
                      >
                        {blog.status === "published" && (
                          <CheckCircle2 size={10} />
                        )}
                        {blog.status}
                      </span>
                    </td>
                    <td className="py-5 text-right px-6 rounded-r-3xl">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="p-2.5 bg-background hover:bg-primary/10 hover:text-primary rounded-xl shadow-sm border border-border transition-all"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
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

      {/* New Blog Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
          <div className="flex flex-col h-[85vh] md:h-auto max-h-[90vh]">
            <DialogHeader className="p-6 md:p-8 pb-4 bg-muted/30">
              <div className="flex justify-between items-center">
                <div>
                  <DialogTitle className="text-2xl md:text-3xl font-black tracking-tight underline decoration-primary decoration-4 underline-offset-8">
                    {editingItem ? "Edit Blog Post" : "New Blog Post"}
                  </DialogTitle>
                  <p className="text-foreground/50 mt-2 font-medium text-sm md:text-base">
                    Capture your community's latest impact stories.
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
                      Title
                    </label>
                    <Input
                      required
                      className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary font-bold text-lg"
                      placeholder="Enter a compelling title"
                      value={formData.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-foreground/60 ml-1">
                      Category
                    </label>
                    <Input
                      required
                      className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary font-bold"
                      placeholder="Health, Education..."
                      value={formData.category}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-foreground/60 ml-1">
                      Excerpt
                    </label>
                    <textarea
                      required
                      className="w-full p-4 min-h-[100px] rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary font-medium resize-none outline-none transition-all"
                      placeholder="Brief summary for the preview card..."
                      value={formData.excerpt}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setFormData({ ...formData, excerpt: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-foreground/60 ml-1">
                      Cover Image
                    </label>
                    <div className="relative group">
                      <div className="relative aspect-video rounded-[1.5rem] bg-muted/50 border-2 border-dashed border-foreground/10 group-hover:border-primary/40 transition-all overflow-hidden flex flex-col items-center justify-center gap-2">
                        {formData.image ? (
                          <>
                            <Image
                              src={formData.image}
                              alt="Upload preview"
                              fill
                              className="object-cover"
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
                              <Upload
                                className="text-foreground/20 group-hover:text-primary/50 transition-colors"
                                size={40}
                              />
                            )}
                            <label className="mt-2 cursor-pointer bg-primary/10 text-primary hover:bg-primary hover:text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all scale-100 active:scale-95">
                              {isUploading
                                ? "Uploading..."
                                : "Upload from Device"}
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isUploading}
                              />
                            </label>
                            <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-tighter mt-1 italic">
                              JPG, PNG or WEBP (Standard HD 16:9)
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-foreground/60 ml-1">
                      Author
                    </label>
                    <Input
                      required
                      className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary font-bold"
                      placeholder="Name of the writer"
                      value={formData.author}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-foreground/60 ml-1">
                  Article Content
                </label>
                <textarea
                  required
                  className="w-full p-6 min-h-[300px] rounded-[1.5rem] bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary font-serif text-lg leading-relaxed outline-none transition-all"
                  placeholder="Share the full story here..."
                  value={formData.content}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                />
              </div>
            </form>

            <div className="p-8 bg-muted/10 border-t border-border flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="status"
                    checked={formData.status === "published"}
                    onChange={() =>
                      setFormData({ ...formData, status: "published" })
                    }
                    className="w-5 h-5 accent-primary"
                  />
                  <span className="text-sm font-bold text-foreground/60 group-hover:text-primary transition-colors">
                    Publish Directly
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="status"
                    checked={formData.status === "draft"}
                    onChange={() =>
                      setFormData({ ...formData, status: "draft" })
                    }
                    className="w-5 h-5 accent-zinc-500"
                  />
                  <span className="text-sm font-bold text-foreground/60 group-hover:text-zinc-500 transition-colors">
                    Save as Draft
                  </span>
                </label>
              </div>
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
                      {editingItem ? "Updating..." : "Posting..."}
                    </>
                  ) : editingItem ? (
                    "Update Blog Post"
                  ) : (
                    "Create Blog Post"
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
