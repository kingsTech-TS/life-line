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
} from "lucide-react";
import { motion } from "framer-motion";

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
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      label: "My Products",
      value: stats.totalProducts.toString(),
      icon: Package,
      color: "from-[#4facfe] to-[#00f2fe]",
      shadow: "shadow-[#4facfe]/20",
    },
    {
      label: "Total Sales",
      value: `₦${stats.totalSales.toLocaleString()}`,
      icon: TrendingUp,
      color: "from-[#667eea] to-[#764ba2]",
      shadow: "shadow-[#667eea]/20",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      color: "from-[#f093fb] to-[#f5576c]",
      shadow: "shadow-[#f093fb]/20",
    },
    {
      label: "My Earnings",
      value: `₦${stats.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: "from-[#13f1fc] to-[#0470dc]",
      shadow: "shadow-[#13f1fc]/20",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Vendor Overview
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Welcome back, <span className="text-primary font-bold">{vendor?.businessName}</span>. 
            Here's how your business is performing.
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((card, i) => (
          <Card
            key={card.label}
            className={`p-6 rounded-[2.5rem] border-none bg-gradient-to-br ${card.color} text-white shadow-2xl ${card.shadow} overflow-hidden relative group`}
          >
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-500">
              <card.icon size={80} />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <card.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-widest opacity-80">
                  {card.label}
                </p>
                <h3 className="text-3xl font-black tracking-tighter mt-1">
                  {card.value}
                </h3>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-8 rounded-[3rem] border border-border/50 bg-card/50 backdrop-blur-xl shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                Recent Activity
              </h2>
              <p className="text-sm text-muted-foreground font-medium">
                Latest orders for your products.
              </p>
            </div>
            <button className="p-2 hover:bg-muted rounded-xl transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {stats.recentOrders.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-[2rem]">
                <Package className="mx-auto text-muted-foreground mb-4 opacity-20" size={48} />
                <p className="text-muted-foreground font-bold">No orders yet.</p>
              </div>
            ) : (
              stats.recentOrders.map((order: any) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <p className="font-black text-sm tracking-tight">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm text-primary">
                      ₦{order.totalAmount.toLocaleString()}
                    </p>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-8 rounded-[3rem] border border-border/50 bg-card/50 backdrop-blur-xl shadow-sm">
          <h2 className="text-2xl font-black tracking-tight mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <button
              onClick={() => (window.location.href = "/vendor/products")}
              className="w-full p-4 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest flex items-center justify-between group"
            >
              Add New Product
              <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
            <button
              onClick={() => (window.location.href = "/vendor/purchases")}
              className="w-full p-4 rounded-2xl bg-card border border-border/50 font-black text-sm uppercase tracking-widest flex items-center justify-between group hover:bg-muted transition-colors"
            >
              View All Sales
              <ChevronRight />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
