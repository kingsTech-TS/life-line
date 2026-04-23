"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Store,
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

export default function AdminVendors() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [editingCommission, setEditingCommission] = useState(false);
  const [newCommission, setNewCommission] = useState<number>(15);

  const fetchVendors = async () => {
    try {
      const res = await fetch("/api/admin/vendors");
      const data = await res.json();
      if (Array.isArray(data)) {
        setVendors(data);
      }
    } catch (error) {
      console.error("Failed to fetch vendors", error);
      toast.error("Failed to load vendors");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleApprove = async (vendorId: string) => {
    setActionLoading(vendorId);
    try {
      const res = await fetch("/api/admin/vendors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: vendorId, isApproved: true }),
      });

      if (res.ok) {
        toast.success("Vendor approved successfully!");
        fetchVendors();
      } else {
        toast.error("Failed to approve vendor");
      }
    } catch (error) {
      toast.error("Error approving vendor");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (vendorId: string) => {
    setActionLoading(vendorId);
    try {
      const res = await fetch("/api/admin/vendors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: vendorId, isApproved: false }),
      });

      if (res.ok) {
        toast.success("Vendor status updated!");
        fetchVendors();
      } else {
        toast.error("Failed to update vendor");
      }
    } catch (error) {
      toast.error("Error updating vendor");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (vendorId: string) => {
    if (!confirm("Are you sure you want to delete this vendor? All their products will also be deleted.")) return;

    try {
      const res = await fetch(`/api/admin/vendors?id=${vendorId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Vendor deleted successfully");
        fetchVendors();
      } else {
        toast.error("Failed to delete vendor");
      }
    } catch (error) {
      toast.error("Error deleting vendor");
    }
  };

  const handleUpdateCommission = async () => {
    if (!selectedVendor) return;
    setActionLoading("commission");
    try {
      const res = await fetch(`/api/admin/vendors/${selectedVendor._id}/commission`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commissionRate: newCommission }),
      });

      if (res.ok) {
        toast.success("Commission rate updated!");
        const data = await res.json();
        setSelectedVendor(data.vendor);
        setEditingCommission(false);
        fetchVendors();
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Failed to update commission");
      }
    } catch (error) {
      toast.error("Error updating commission");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.phone.includes(searchTerm)
  );

  const pendingCount = vendors.filter((v) => !v.isApproved).length;
  const approvedCount = vendors.filter((v) => v.isApproved).length;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Vendors
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Manage vendor registrations and approvals.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-2xl bg-amber-500/10 text-amber-500 font-black text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {pendingCount} Pending
          </div>
          <div className="px-4 py-2 rounded-2xl bg-green-500/10 text-green-500 font-black text-sm flex items-center gap-2">
            <CheckCircle size={16} />
            {approvedCount} Approved
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <Input
            placeholder="Search vendors by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 rounded-2xl bg-card border-border/50 shadow-sm focus-visible:ring-primary/20"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 rounded-[2.5rem] bg-muted animate-pulse" />
          ))}
        </div>
      ) : filteredVendors.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-[3rem]">
          <Store className="mx-auto text-muted-foreground mb-4 opacity-20" size={64} />
          <p className="text-muted-foreground font-black text-xl">No vendors found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor._id}
            >
              <Card
                className="rounded-[2.5rem] border-border/50 bg-card overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 h-full"
              >
                <div className="p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      vendor.isApproved 
                        ? "bg-green-500/10 text-green-500" 
                        : "bg-amber-500/10 text-amber-500"
                    }`}>
                      <Store size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-lg tracking-tight">
                        {vendor.businessName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {vendor.isApproved ? (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">
                            Approved
                          </span>
                        ) : (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedVendor(vendor);
                      setNewCommission(vendor.commissionRate || 15);
                      setEditingCommission(false);
                      setIsDetailsOpen(true);
                    }}
                    className="p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Mail size={14} className="text-primary" />
                    <span className="font-medium truncate">{vendor.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Phone size={14} className="text-primary" />
                    <span className="font-medium">{vendor.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <ShoppingBag size={14} className="text-primary" />
                    <span className="font-medium">{vendor.productCount} products listed</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar size={14} className="text-primary" />
                    <span className="font-medium">
                      {new Date(vendor.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  {!vendor.isApproved ? (
                    <>
                      <Button
                        onClick={() => handleApprove(vendor._id)}
                        disabled={actionLoading === vendor._id}
                        className="flex-1 h-12 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-green-500/20"
                      >
                        {actionLoading === vendor._id ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <>
                            <CheckCircle size={16} className="mr-2" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleDelete(vendor._id)}
                        disabled={actionLoading === vendor._id}
                        className="h-12 px-4 rounded-2xl bg-red-500/10 hover:bg-red-500 text-red-500 font-black text-xs uppercase tracking-widest"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleReject(vendor._id)}
                        disabled={actionLoading === vendor._id}
                        className="flex-1 h-12 rounded-2xl bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white font-black text-xs uppercase tracking-widest"
                      >
                        {actionLoading === vendor._id ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <>
                            <XCircle size={16} className="mr-2" />
                            Suspend
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleDelete(vendor._id)}
                        disabled={actionLoading === vendor._id}
                        className="h-12 px-4 rounded-2xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-black text-xs uppercase tracking-widest"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </div>
          ))}
        </div>
      )}

      {/* Vendor Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md rounded-[2rem] p-8">
          {selectedVendor && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-tight">
                  Vendor Details
                </DialogTitle>
                <DialogDescription>
                  Full information about this vendor.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    selectedVendor.isApproved 
                      ? "bg-green-500/10 text-green-500" 
                      : "bg-amber-500/10 text-amber-500"
                  }`}>
                    <Store size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-xl tracking-tight">
                      {selectedVendor.businessName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedVendor.isApproved ? (
                        <span className="text-xs font-black uppercase px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">
                          Approved
                        </span>
                      ) : (
                        <span className="text-xs font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                          Pending Approval
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-6 bg-muted/30 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <Mail size={18} className="text-primary mt-0.5" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email</p>
                      <p className="font-bold">{selectedVendor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-primary mt-0.5" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Phone</p>
                      <p className="font-bold">{selectedVendor.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-primary mt-0.5" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Address</p>
                      <p className="font-bold">{selectedVendor.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShoppingBag size={18} className="text-primary mt-0.5" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Products</p>
                      <p className="font-bold">{selectedVendor.productCount} listed</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="text-primary mt-0.5" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Registered</p>
                      <p className="font-bold">
                        {new Date(selectedVendor.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Store size={18} className="text-primary mt-0.5" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Platform Commission Rate</p>
                        {!editingCommission && (
                          <button 
                            onClick={() => setEditingCommission(true)}
                            className="text-[10px] font-black uppercase text-primary hover:underline"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                      
                      {editingCommission ? (
                        <div className="flex items-center gap-2 mt-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={newCommission}
                            onChange={(e) => setNewCommission(Number(e.target.value))}
                            className="h-10 w-24 rounded-xl bg-background border-none focus-visible:ring-2 focus-visible:ring-primary font-bold"
                          />
                          <span className="font-bold text-muted-foreground">%</span>
                          <div className="flex gap-2 ml-auto">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setEditingCommission(false)}
                              className="h-10 rounded-xl font-bold border-border/50"
                            >
                              Cancel
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={handleUpdateCommission}
                              disabled={actionLoading === "commission"}
                              className="h-10 rounded-xl bg-primary text-white font-bold"
                            >
                              {actionLoading === "commission" ? <Loader2 className="animate-spin" size={16} /> : "Save"}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="font-bold text-lg mt-1">{selectedVendor.commissionRate || 15}%</p>
                      )}
                      <p className="text-[10px] text-muted-foreground font-medium mt-1">This is the percentage the platform keeps from each sale.</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  {!selectedVendor.isApproved ? (
                    <Button
                      onClick={() => {
                        handleApprove(selectedVendor._id);
                        setIsDetailsOpen(false);
                      }}
                      className="flex-1 h-14 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-black text-sm uppercase tracking-widest"
                    >
                      <CheckCircle size={18} className="mr-2" />
                      Approve Vendor
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        handleReject(selectedVendor._id);
                        setIsDetailsOpen(false);
                      }}
                      className="flex-1 h-14 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm uppercase tracking-widest"
                    >
                      <XCircle size={18} className="mr-2" />
                      Suspend Vendor
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
