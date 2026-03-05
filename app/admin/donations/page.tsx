"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Heart,
  Search,
  Filter,
  Download,
  Eye,
  Loader2,
  X,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Mail,
  CreditCard,
  CalendarClock,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function StatusBadge({ status }: { status: string }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-500/10 text-green-600 ring-1 ring-green-600/30">
        <CheckCircle2 size={10} />
        Successful
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-600 ring-1 ring-red-600/30">
        <XCircle size={10} />
        Declined
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-500/10 text-orange-600 ring-1 ring-orange-600/30">
      <Clock size={10} />
      Pending
    </span>
  );
}

export default function AdminDonations() {
  const [donations, setDonations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [viewingDonation, setViewingDonation] = useState<any | null>(null);

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

  const filteredDonations = donations.filter((d) => {
    const matchesSearch =
      d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.donorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.paymentReference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || d.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalCompleted = donations.filter(
    (d) => d.status === "completed",
  ).length;
  const totalPending = donations.filter((d) => d.status === "pending").length;
  const totalFailed = donations.filter((d) => d.status === "failed").length;
  const totalAmount = donations
    .filter((d) => d.status === "completed")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
            Donations
          </h1>
          <p className="text-foreground/60 text-lg">
            View all community contributions and their payment details.
          </p>
        </div>
        <Button className="rounded-2xl h-12 px-6 flex items-center gap-2 bg-background border-2 border-primary/20 text-primary hover:bg-primary/5 shadow-sm transition-all hover:scale-105 active:scale-95 font-bold">
          <Download size={18} /> Export List
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Raised",
            value: `₦${totalAmount.toLocaleString()}`,
            color: "text-primary",
            bg: "bg-primary/5",
          },
          {
            label: "Successful",
            value: totalCompleted,
            color: "text-green-600",
            bg: "bg-green-500/5",
          },
          {
            label: "Pending",
            value: totalPending,
            color: "text-orange-500",
            bg: "bg-orange-500/5",
          },
          {
            label: "Declined",
            value: totalFailed,
            color: "text-red-500",
            bg: "bg-red-500/5",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className={`p-5 border-none shadow-sm ${stat.bg} rounded-2xl`}
          >
            <p className="text-xs font-black uppercase tracking-widest text-foreground/40">
              {stat.label}
            </p>
            <p className={`text-3xl font-black mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      {/* Table Card */}
      <Card className="p-8 rounded-[2rem] border-none shadow-xl shadow-foreground/5 bg-background/50 backdrop-blur-xl">
        {/* Search & Filter */}
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
          <div className="flex gap-2">
            {["all", "completed", "pending", "failed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 h-14 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  filterStatus === status
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-muted/30 text-foreground/50 hover:bg-muted/60"
                }`}
              >
                {status === "all"
                  ? "All"
                  : status === "completed"
                    ? "Successful"
                    : status === "failed"
                      ? "Declined"
                      : "Pending"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-foreground/40">
                <th className="pb-2 font-bold text-xs uppercase tracking-widest px-4">
                  Donor
                </th>
                <th className="pb-2 font-bold text-xs uppercase tracking-widest px-4">
                  Amount
                </th>
                <th className="pb-2 font-bold text-xs uppercase tracking-widest px-4">
                  Date & Time
                </th>
                <th className="pb-2 font-bold text-xs uppercase tracking-widest px-4 text-center">
                  Status
                </th>
                <th className="pb-2 font-bold text-xs uppercase tracking-widest text-right px-6">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
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
                  <td colSpan={5} className="py-20 text-center">
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
                    className="group bg-muted/20 hover:bg-muted/40 transition-all rounded-3xl cursor-pointer"
                    onClick={() => setViewingDonation(donation)}
                  >
                    {/* Donor column */}
                    <td className="py-4 px-4 rounded-l-2xl">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground text-base group-hover:text-primary transition-colors">
                            {donation.donorName}
                          </span>
                          {donation.isAnonymous && (
                            <span className="px-2 py-0.5 text-[8px] bg-blue-500/10 text-blue-600 rounded-full font-black uppercase tracking-widest border border-blue-500/20">
                              Anon
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-foreground/40">
                          {donation.donorEmail}
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4 font-black text-primary text-lg">
                      ₦{donation.amount.toLocaleString()}
                    </td>

                    {/* Date & Time */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground/70">
                          {new Date(donation.createdAt).toLocaleDateString(
                            undefined,
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                        <span className="text-[11px] text-foreground/40 font-medium">
                          {new Date(donation.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <StatusBadge status={donation.status} />
                    </td>

                    {/* View button */}
                    <td className="py-4 px-6 rounded-r-2xl text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingDonation(donation);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2.5 bg-background hover:bg-primary/10 hover:text-primary rounded-xl shadow-sm border border-border"
                        title="View full details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* View Details Dialog */}
      <Dialog
        open={!!viewingDonation}
        onOpenChange={(open) => {
          if (!open) setViewingDonation(null);
        }}
      >
        <DialogContent className="max-w-lg p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl">
          {viewingDonation && (
            <div className="flex flex-col">
              {/* Header with status color */}
              <div
                className={`p-8 pb-6 ${
                  viewingDonation.status === "completed"
                    ? "bg-green-500/5"
                    : viewingDonation.status === "failed"
                      ? "bg-red-500/5"
                      : "bg-orange-500/5"
                }`}
              >
                <DialogHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <DialogTitle className="text-2xl font-black tracking-tight">
                        Donation Details
                      </DialogTitle>
                      <p className="text-foreground/40 text-xs mt-1 font-mono">
                        Ref: {viewingDonation.paymentReference}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={viewingDonation.status} />
                      <button
                        onClick={() => setViewingDonation(null)}
                        className="p-2 rounded-full hover:bg-muted transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                </DialogHeader>
              </div>

              {/* Detail rows */}
              <div className="p-8 space-y-5">
                {/* Amount */}
                <div
                  className={`rounded-2xl p-5 text-center ${
                    viewingDonation.status === "completed"
                      ? "bg-green-500/5"
                      : "bg-muted/30"
                  }`}
                >
                  <p className="text-xs font-black uppercase tracking-widest text-foreground/40 mb-1">
                    Amount Donated
                  </p>
                  <p
                    className={`text-4xl font-black tracking-tighter ${
                      viewingDonation.status === "completed"
                        ? "text-green-600"
                        : "text-foreground/50"
                    }`}
                  >
                    ₦{viewingDonation.amount.toLocaleString()}
                  </p>
                </div>

                {/* Donor Info */}
                <div className="space-y-3">
                  <DetailRow
                    icon={<User size={14} />}
                    label="Full Name"
                    value={
                      <div className="flex items-center gap-2">
                        <span>{viewingDonation.donorName}</span>
                        {viewingDonation.isAnonymous && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[8px] bg-blue-500/10 text-blue-600 rounded-full font-black uppercase tracking-widest border border-blue-500/20">
                            <ShieldAlert size={8} /> Chose to donate anonymously
                          </span>
                        )}
                      </div>
                    }
                  />
                  <DetailRow
                    icon={<Mail size={14} />}
                    label="Email Address"
                    value={viewingDonation.donorEmail}
                  />
                  <DetailRow
                    icon={<CalendarClock size={14} />}
                    label="Date & Time"
                    value={new Date(viewingDonation.createdAt).toLocaleString(
                      undefined,
                      {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      },
                    )}
                  />
                  {viewingDonation.paymentMethod && (
                    <DetailRow
                      icon={<CreditCard size={14} />}
                      label="Payment Method"
                      value={
                        <span className="capitalize">
                          {viewingDonation.paymentMethod}
                          {viewingDonation.paymentDetails?.authorization?.last4
                            ? ` ending in ${viewingDonation.paymentDetails.authorization.last4}`
                            : ""}
                          {viewingDonation.paymentDetails?.authorization?.bank
                            ? ` — ${viewingDonation.paymentDetails.authorization.bank}`
                            : ""}
                        </span>
                      }
                    />
                  )}
                  <DetailRow
                    icon={<Heart size={14} />}
                    label="Donation Type"
                    value={
                      <span className="capitalize">
                        {viewingDonation.donationType || "One-time"}
                      </span>
                    }
                  />
                </div>

                {/* Locked notice for finalised */}
                {(viewingDonation.status === "completed" ||
                  viewingDonation.status === "failed") && (
                  <div
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold ${
                      viewingDonation.status === "completed"
                        ? "bg-green-500/10 text-green-700"
                        : "bg-red-500/10 text-red-700"
                    }`}
                  >
                    {viewingDonation.status === "completed" ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <XCircle size={14} />
                    )}
                    {viewingDonation.status === "completed"
                      ? "This payment was verified successful and cannot be modified."
                      : "This transaction was declined. No funds were collected."}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
      <div className="mt-0.5 text-foreground/30">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-0.5">
          {label}
        </p>
        <div className="text-sm font-bold text-foreground break-words">
          {value}
        </div>
      </div>
    </div>
  );
}
