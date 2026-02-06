"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Briefcase,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  TrendingUp,
  X,
  Upload,
  Loader2,
  Globe,
  Target,
  DollarSign,
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

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: 0,
    currentAmount: 0,
    country: "",
    image: "",
    impact: "",
    status: "active" as "active" | "completed",
  });

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Project deleted successfully");
        fetchProjects();
      } else {
        toast.error("Failed to delete project");
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
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Project created successfully!");
        setIsDialogOpen(false);
        fetchProjects();
        setFormData({
          title: "",
          description: "",
          goalAmount: 0,
          currentAmount: 0,
          country: "",
          image: "",
          impact: "",
          status: "active",
        });
      } else {
        toast.error("Failed to create project");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.country.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
            Projects
          </h1>
          <p className="text-foreground/60 text-lg">
            Oversee and manage community support projects.
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="rounded-2xl h-12 px-6 flex items-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={20} /> <span className="font-bold">New Project</span>
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
              placeholder="Search by title or country..."
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
                  Project Details
                </th>
                <th className="pb-2 font-bold text-xs uppercase tracking-widest px-4 text-center">
                  Funding
                </th>
                <th className="pb-2 font-bold text-xs uppercase tracking-widest px-4">
                  Progress
                </th>
                <th className="pb-2 font-bold text-xs uppercase tracking-widest px-4 text-center">
                  Status
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
                        Loading projects...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <Briefcase size={48} />
                      <span className="text-lg font-semibold italic">
                        No projects found
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr
                    key={project._id}
                    className="group bg-muted/20 hover:bg-muted/40 transition-all rounded-3xl"
                  >
                    <td className="py-5 px-4 rounded-l-3xl">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                          <Image
                            src={project.image || "/placeholder-project.jpg"}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground text-base line-clamp-1 group-hover:text-primary transition-colors">
                            {project.title}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-foreground/40 font-bold uppercase tracking-wider">
                            <Globe size={12} className="text-primary/60" />
                            {project.country}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-foreground">
                          ₦{project.currentAmount.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-tighter">
                          of ₦{project.goalAmount.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <div className="w-32 space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black tracking-widest">
                          <span className="text-primary">
                            {Math.round(
                              (project.currentAmount / project.goalAmount) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                        <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden p-[1px] border border-foreground/5 text-center">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                            style={{
                              width: `${Math.min(100, (project.currentAmount / project.goalAmount) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <span
                        className={`
                        inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                        ${project.status === "active" ? "bg-green-500/10 text-green-600 ring-1 ring-green-600/30" : "bg-zinc-500/10 text-zinc-500 ring-1 ring-zinc-500/30"}
                      `}
                      >
                        {project.status === "active" && (
                          <CheckCircle2 size={10} />
                        )}
                        {project.status}
                      </span>
                    </td>
                    <td className="py-5 text-right px-6 rounded-r-3xl">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2.5 bg-background hover:bg-primary/10 hover:text-primary rounded-xl shadow-sm border border-border transition-all">
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
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

      {/* New Project Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
          <div className="flex flex-col h-[90vh] md:h-auto max-h-[95vh]">
            <DialogHeader className="p-8 pb-4 bg-muted/30">
              <div className="flex justify-between items-center">
                <div>
                  <DialogTitle className="text-3xl font-black tracking-tight underline decoration-primary decoration-4 underline-offset-8">
                    Launch Project
                  </DialogTitle>
                  <p className="text-foreground/50 mt-2 font-medium">
                    Define a new community initiative to drive change.
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
                      Project Title
                    </label>
                    <Input
                      required
                      className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary font-bold text-lg"
                      placeholder="e.g. Rhema School Construction"
                      value={formData.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase tracking-widest text-foreground/60 ml-1">
                        Target Country
                      </label>
                      <Input
                        required
                        className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary font-bold"
                        placeholder="Nigeria, Ghana..."
                        value={formData.country}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase tracking-widest text-foreground/60 ml-1">
                        Financial Goal (₦)
                      </label>
                      <Input
                        required
                        type="number"
                        className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary font-bold"
                        placeholder="5,000,000"
                        value={formData.goalAmount}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({
                            ...formData,
                            goalAmount: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-foreground/60 ml-1">
                      Project Description
                    </label>
                    <textarea
                      required
                      className="w-full p-4 min-h-[120px] rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary font-medium resize-none outline-none transition-all"
                      placeholder="Explain the mission and scope of this project..."
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
                      Featured Image
                    </label>
                    <div className="relative group">
                      <div className="relative aspect-video rounded-[1.5rem] bg-muted/50 border-2 border-dashed border-foreground/10 group-hover:border-primary/40 transition-all overflow-hidden flex flex-col items-center justify-center gap-2 text-center p-4">
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
                                : "Select Project Image"}
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
                      Key Impact Statement
                    </label>
                    <Input
                      required
                      className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary font-bold"
                      placeholder="e.g. Providing clean water to 5,000 people"
                      value={formData.impact}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, impact: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </form>

            <div className="p-8 bg-muted/10 border-t border-border flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="text-xs font-bold text-foreground/40 italic">
                  Initial status will be set to{" "}
                  <span className="text-green-600 font-black">ACTIVE</span>
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
                      Launching...
                    </>
                  ) : (
                    "Create Project"
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
