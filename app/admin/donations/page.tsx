"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Heart, Search, Filter, Download, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminDonations() {
  const [donations, setDonations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
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

    fetchDonations();
  }, []);

  const filteredDonations = donations.filter(
    (d) =>
      d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.donorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.paymentReference.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Donations</h1>
          <p className="text-foreground/60">
            Manage and view all community contributions.
          </p>
        </div>
        <Button className="rounded-xl flex items-center gap-2">
          <Download size={18} /> Export List
        </Button>
      </div>

      <Card className="p-6 rounded-3xl border-none shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40"
              size={18}
            />
            <Input
              placeholder="Search by name, email, or reference..."
              className="pl-10 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="rounded-xl flex items-center gap-2"
          >
            <Filter size={18} /> Filters
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-4 pt-2 font-semibold text-sm">Donor</th>
                <th className="pb-4 pt-2 font-semibold text-sm">Amount</th>
                <th className="pb-4 pt-2 font-semibold text-sm">Project</th>
                <th className="pb-4 pt-2 font-semibold text-sm">Date</th>
                <th className="pb-4 pt-2 font-semibold text-sm">Status</th>
                <th className="pb-4 pt-2 font-semibold text-sm text-right px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-foreground/40"
                  >
                    Loading donations...
                  </td>
                </tr>
              ) : filteredDonations.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-foreground/40"
                  >
                    No donations found.
                  </td>
                </tr>
              ) : (
                filteredDonations.map((donation) => (
                  <tr
                    key={donation._id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {donation.donorName}
                        </span>
                        <span className="text-xs text-foreground/40">
                          {donation.donorEmail}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 font-semibold text-primary">
                      ₦{donation.amount.toLocaleString()}
                    </td>
                    <td className="py-4 text-sm">
                      {donation.projectId?.title || "General Fund"}
                    </td>
                    <td className="py-4 text-sm text-foreground/60">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <span
                        className={`
                      px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                      ${
                        donation.status === "completed"
                          ? "bg-green-500/10 text-green-600"
                          : donation.status === "pending"
                            ? "bg-orange-500/10 text-orange-600"
                            : "bg-red-500/10 text-red-600"
                      }
                    `}
                      >
                        {donation.status}
                      </span>
                    </td>
                    <td className="py-4 text-right px-4">
                      <button className="text-foreground/40 hover:text-foreground transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
