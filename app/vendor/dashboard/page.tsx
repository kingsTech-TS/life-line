"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Package,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  Clock,
  LayoutDashboard,
  Wallet,
  Landmark,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Link from "next/link";

export default function VendorDashboard() {
  const [vendor, setVendor] = useState<any>(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    totalEarnings: 0,
    recentOrders: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [banks, setBanks] = useState<any[]>([]);
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isSubmittingBank, setIsSubmittingBank] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendorRes, statsRes] = await Promise.all([
          fetch(`/api/vendor/me?t=${Date.now()}`),
          fetch(`/api/vendor/stats?t=${Date.now()}`),
        ]);

        const vendorData = await vendorRes.json();
        const statsData = await statsRes.json();

        if (vendorData.vendor) setVendor(vendorData.vendor);
        if (!statsData.error) setStats(statsData);

        // Fetch banks if vendor doesn't have a subaccount yet
        if (vendorData.vendor && !vendorData.vendor.paystackSubaccountCode) {
          fetchBanks();
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchBanks = async () => {
      try {
        const res = await fetch('/api/vendor/banks');
        const data = await res.json();
        if (Array.isArray(data)) {
          setBanks(data);
        }
      } catch (err) {
        console.error("Failed to fetch banks", err);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      label: "My Products",
      value: stats.totalProducts.toString(),
      icon: Package,
      color: "from-blue-500 to-cyan-400",
      shadow: "shadow-blue-500/20",
      bgLight: "bg-blue-500/10 text-blue-500",
    },
    {
      label: "Total Sales",
      value: `₦${stats.totalSales.toLocaleString()}`,
      icon: TrendingUp,
      color: "from-indigo-500 to-purple-500",
      shadow: "shadow-indigo-500/20",
      bgLight: "bg-indigo-500/10 text-indigo-500",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      color: "from-pink-500 to-rose-400",
      shadow: "shadow-pink-500/20",
      bgLight: "bg-pink-500/10 text-pink-500",
    },
    {
      label: "My Earnings",
      value: `₦${stats.totalEarnings.toLocaleString()}`,
      icon: Wallet,
      color: "from-emerald-500 to-teal-400",
      shadow: "shadow-emerald-500/20",
      bgLight: "bg-emerald-500/10 text-emerald-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-sm font-bold text-muted-foreground animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Overview
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Welcome back, <span className="text-foreground font-bold">{vendor?.businessName}</span>. 
            Here is your store's performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-card border border-border/50 shadow-sm flex items-center gap-2 text-sm font-bold text-muted-foreground">
            <Calendar size={16} />
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6 rounded-[2rem] border border-border/50 bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                <card.icon size={100} />
              </div>
              <div className="relative z-10 flex flex-col gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.bgLight}`}>
                  <card.icon size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-3xl font-black tracking-tighter text-foreground mb-1">
                    {card.value}
                  </h3>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    {card.label}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="h-full p-8 rounded-[2.5rem] border border-border/50 bg-card shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-black tracking-tight">
                  Recent Orders
                </h2>
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  Latest purchases from your inventory.
                </p>
              </div>
              <Link href="/vendor/purchases" className="p-2 bg-muted hover:bg-muted/80 rounded-xl transition-colors text-muted-foreground hover:text-foreground">
                <ChevronRight size={20} />
              </Link>
            </div>

            <div className="flex-1 space-y-4">
              {stats.recentOrders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-12 text-center opacity-40">
                  <Package className="mx-auto text-muted-foreground mb-4" size={48} />
                  <p className="text-lg font-black">No orders yet</p>
                  <p className="text-sm font-medium text-muted-foreground">When customers buy your products, they will appear here.</p>
                </div>
              ) : (
                stats.recentOrders.map((order: any) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-5 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-background shadow-sm border border-border/50 flex items-center justify-center text-foreground group-hover:scale-105 transition-transform">
                        <ShoppingBag size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm tracking-tight text-foreground">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-1">
                          <Clock size={12} />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-base text-foreground">
                        ₦{order.totalAmount.toLocaleString()}
                      </p>
                      <span className={`inline-block text-[10px] font-black uppercase px-2.5 py-1 rounded-full mt-1 ${
                        order.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                        order.status === 'shipped' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-amber-500/10 text-amber-600'
                      }`}>
                        {order.status || 'Processing'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full p-8 rounded-[2.5rem] border border-border/50 bg-card shadow-sm flex flex-col">
            <h2 className="text-xl font-black tracking-tight mb-8">Quick Actions</h2>
            <div className="flex-1 space-y-4">
              <Link
                href="/vendor/products"
                className="w-full p-5 rounded-2xl bg-primary text-white hover:bg-primary/90 font-black text-sm tracking-wide flex items-center justify-between group transition-colors shadow-lg shadow-primary/20"
              >
                <div className="flex items-center gap-3">
                  <Package size={20} />
                  Add New Product
                </div>
                <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
              <Link
                href="/vendor/purchases"
                className="w-full p-5 rounded-2xl bg-muted/50 border border-border/50 font-bold text-sm tracking-wide flex items-center justify-between group hover:bg-muted transition-colors text-foreground"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp size={20} className="text-muted-foreground" />
                  View All Sales
                </div>
                <ChevronRight className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Bank Setup Section */}
              <div className="mt-8 pt-8 border-t border-border/50">
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-4 flex items-center gap-2">
                  <Landmark size={16} className="text-primary" />
                  Payout Account
                </h3>

                {vendor?.paystackSubaccountCode ? (
                  <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-green-500 mt-0.5" />
                      <div>
                        <p className="text-xs font-black uppercase text-green-600 mb-1">Account Linked</p>
                        <p className="font-bold text-sm text-foreground">{vendor.bankName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Acct: ••••{vendor.accountNumber?.slice(-4) || '****'}</p>
                        <p className="text-[10px] font-medium text-green-600/80 mt-2">Payouts are sent here automatically.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 p-5 rounded-2xl bg-muted/30 border border-border/50">
                    <p className="text-xs font-medium text-muted-foreground">
                      Link your bank account to automatically receive your sales earnings.
                    </p>
                    <div className="space-y-3">
                      <select
                        value={bankCode}
                        onChange={(e) => setBankCode(e.target.value)}
                        className="w-full h-12 px-4 rounded-xl bg-background border border-border/50 focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                      >
                        <option value="">Select your Bank</option>
                        {banks.map(bank => (
                          <option key={bank.code} value={bank.code}>{bank.name}</option>
                        ))}
                      </select>
                      <Input
                        placeholder="Account Number (10 digits)"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="h-12 rounded-xl bg-background border-border/50 focus-visible:ring-primary/20"
                        maxLength={10}
                      />
                      <Button
                        onClick={async () => {
                          if (!bankCode || !accountNumber || accountNumber.length !== 10) {
                            toast.error("Please provide a valid 10-digit account number and select a bank.");
                            return;
                          }
                          setIsSubmittingBank(true);
                          try {
                            const selectedBank = banks.find(b => b.code === bankCode);
                            const res = await fetch('/api/vendor/subaccount', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                bankCode,
                                accountNumber,
                                bankName: selectedBank?.name
                              })
                            });
                            const data = await res.json();
                            if (res.ok) {
                              toast.success("Bank account linked successfully!");
                              setVendor({ ...vendor, ...data });
                            } else {
                              toast.error(data.error || "Failed to setup bank account");
                            }
                          } catch (err) {
                            toast.error("An error occurred");
                          } finally {
                            setIsSubmittingBank(false);
                          }
                        }}
                        disabled={isSubmittingBank}
                        className="w-full h-12 rounded-xl bg-primary text-white font-bold"
                      >
                        {isSubmittingBank ? <Loader2 className="animate-spin" size={16} /> : "Link Account"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">Need Help?</p>
                <p className="text-sm font-medium text-muted-foreground mb-4">Contact the admin team for support with your store.</p>
                <button className="text-xs font-bold text-primary hover:underline">Contact Support →</button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
