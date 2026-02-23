"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Heart,
  Search,
  Filter,
  Download,
  MoreVertical,
  Edit,
  X,
  Loader2,
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

export default function AdminDonations() {
  const [donations, setDonations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    donorName: "",
    status: "pending" as "pending" | "completed" | "failed",
  });

  const fetchDonations = async () => {
    try {
      const res = await fetch("/api/admin/donations");
      const data = await res.json();
      if (Array.isArray(data)) {
        setDonations(data);
      }
    } catch (error) {
      console.error("Failed to fetch donations", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleEdit = (donation: any) => {
    setEditingItem(donation);
    setFormData({
      donorName: donation.donorName,
      status: donation.status,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/donations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, _id: editingItem._id }),
      });

      if (res.ok) {
        toast.success("Donation updated successfully!");
        setIsDialogOpen(false);
        setEditingItem(null);
        fetchDonations();
      } else {
        toast.error("Failed to update donation");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDonations = donations.filter(
    (d) =>
      d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.donorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.paymentReference.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
            Donations
          </h1>
          <p className="text-foreground/60 text-lg">
            Manage and view all community contributions.
          </p>
        </div>
        <Button className="rounded-2xl h-12 px-6 flex items-center gap-2 bg-background border-2 border-primary/20 text-primary hover:bg-primary/5 shadow-sm transition-all hover:scale-105 active:scale-95 font-bold">
          <Download size={18} /> Export List
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
              placeholder="Search by name, email, or reference..."
              className="pl-12 h-14 rounded-2xl bg-muted/30 border-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary transition-all text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="h-14 px-6 rounded-2xl border-none bg-muted/30 hover:bg-muted/50 font-bold transition-all flex items-center gap-2"
          >
            <Filter size={18} /> Filters
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-4">
            <thead>
              <tr className="text-foreground/40">
                <th className="pb-2 font-bold text-xs uppercase tracking-widest px-4">
                  Donor
                </th>
                <th className="pb-2 font-bold text-xs uppercase tracking-widest px-4">
                  Amount
                </th>
                <th className="pb-2 font-bold text-xs uppercase tracking-widest px-4">
                  Project
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
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-foreground/40">
                      <Loader2
                        className="animate-spin text-primary"
                        size={32}
                      />
                      <span className="font-medium tracking-wide">
                        Loading donations...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <Heart size={48} />
                      <span className="text-lg font-semibold italic">
                        No donations found
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDonations.map((donation) => (
                  <tr
                    key={donation._id}
                    className="group bg-muted/20 hover:bg-muted/40 transition-all rounded-3xl"
                  >
                    <td className="py-5 px-4 rounded-l-3xl">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-base group-hover:text-primary transition-colors">
                          {donation.donorName}
                        </span>
                        <span className="text-xs text-foreground/40 italic">
                          {donation.donorEmail}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-4 font-black text-primary">
                      ₦{donation.amount.toLocaleString()}
                    </td>
                    <td className="py-5 px-4">
                      <span className="text-sm font-medium text-foreground/70">
                        {donation.projectId?.title || "General Fund"}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-sm text-foreground/40 font-medium">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-5 px-4 text-center">
                      <span
                        className={`
                        inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1
                        ${
                          donation.status === "completed"
                            ? "bg-green-500/10 text-green-600 ring-green-600/30"
                            : donation.status === "pending"
                              ? "bg-orange-500/10 text-orange-600 ring-orange-600/30"
                              : "bg-red-500/10 text-red-600 ring-red-600/30"
                        }
                      `}
                      >
                        {donation.status}
                      </span>
                    </td>
                    <td className="py-5 text-right px-6 rounded-r-3xl">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(donation)}
                          className="p-2.5 bg-background hover:bg-primary/10 hover:text-primary rounded-xl shadow-sm border border-border transition-all"
                        >
                          <Edit size={18} />
                        </button>
                        <button className="text-foreground/40 hover:text-foreground transition-all p-2.5">
                          <MoreVertical size={18} />
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

      {/* Edit Donation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
          <div className="flex flex-col">
            <DialogHeader className="p-8 pb-4 bg-muted/30">
              <div className="flex justify-between items-center">
                <div>
                  <DialogTitle className="text-3xl font-black tracking-tight underline decoration-primary decoration-4 underline-offset-8">
                    Edit Donation
                  </DialogTitle>
                  <p className="text-foreground/50 mt-2 font-medium">
                    Update record for contribution{" "}
                    {editingItem?.paymentReference}.
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

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-foreground/60 ml-1">
                  Donor Name
                </label>
                <Input
                  required
                  className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary font-bold text-lg"
                  value={formData.donorName}
                  onChange={(e) =>
                    setFormData({ ...formData, donorName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-foreground/60 ml-1">
                  Payment Status
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["pending", "completed", "failed"].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, status: status as any })
                      }
                      className={`
                        h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                        ${
                          formData.status === status
                            ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                            : "bg-muted/50 text-foreground/40 hover:bg-muted"
                        }
                      `}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="h-14 rounded-2xl border-2 border-foreground/10 hover:bg-muted font-bold flex-1 transition-all"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-base shadow-xl shadow-primary/20 flex-1 transition-all hover:scale-105 active:scale-95"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Update Record"
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
