"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Users,
  Heart,
  ShoppingBag,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  Target
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    activeProjects: 0,
    totalShopOrders: 0,
  });

  // Simulated fetching for now
  useEffect(() => {
    setStats({
      totalDonations: 432,
      totalAmount: 12500000,
      activeProjects: 8,
      totalShopOrders: 156,
    });
  }, []);

  const statCards = [
    {
      label: "Total Donations",
      value: stats.totalDonations.toLocaleString(),
      icon: Heart,
      trend: "+12.5%",
      color: "from-rose-500 to-pink-400",
      bgLight: "bg-rose-500/10 text-rose-500",
    },
    {
      label: "Amount Raised",
      value: `₦${(stats.totalAmount / 1000000).toFixed(1)}M`,
      icon: TrendingUp,
      trend: "+5.2%",
      color: "from-emerald-500 to-teal-400",
      bgLight: "bg-emerald-500/10 text-emerald-500",
    },
    {
      label: "Active Projects",
      value: stats.activeProjects,
      icon: Target,
      trend: "+2",
      color: "from-blue-500 to-cyan-400",
      bgLight: "bg-blue-500/10 text-blue-500",
    },
    {
      label: "Inventory Sales",
      value: stats.totalShopOrders,
      icon: ShoppingBag,
      trend: "+8.1%",
      color: "from-amber-500 to-orange-400",
      bgLight: "bg-amber-500/10 text-amber-500",
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Overview
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Welcome back, <span className="text-foreground font-bold">Admin</span>. Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-card border border-border/50 shadow-sm flex items-center gap-2 text-sm font-bold text-muted-foreground">
            <Calendar size={16} />
            Today:{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6 rounded-[2rem] border border-border/50 bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                <stat.icon size={100} />
              </div>
              
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bgLight}`}>
                    <stat.icon size={22} strokeWidth={2.5} />
                  </div>
                  <div className="flex items-center text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {stat.trend} <ArrowUpRight size={12} className="ml-1" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-3xl font-black tracking-tighter text-foreground mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-2"
        >
          <Card className="h-full p-8 rounded-[2.5rem] border border-border/50 bg-card shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-black tracking-tight">Recent Activity</h2>
                <p className="text-sm text-muted-foreground font-medium mt-1">Platform-wide updates and transactions.</p>
              </div>
              <button className="p-2 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
            
            <div className="flex-1 space-y-4">
              {[
                { name: "John Doe", action: "donated", amount: "₦50,000", time: "2 hours ago", initial: "JD", type: "donation" },
                { name: "Sarah Smith", action: "purchased", item: "LifeLine Hoodie", time: "4 hours ago", initial: "SS", type: "purchase" },
                { name: "Global Health", action: "joined as", partner: "Partner", time: "6 hours ago", initial: "GH", type: "partner" },
                { name: "Michael Obi", action: "donated", amount: "₦120,000", time: "1 day ago", initial: "MO", type: "donation" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-5 p-4 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all group cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black shadow-sm group-hover:scale-105 transition-transform ${
                    activity.type === 'donation' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                    activity.type === 'purchase' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                    'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                  }`}>
                    {activity.initial}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">
                      {activity.name} <span className="text-muted-foreground font-medium">{activity.action}</span>{" "}
                      <span className="font-black">
                        {activity.amount || activity.item || activity.partner}
                      </span>
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mt-1">
                      {activity.time}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full p-8 rounded-[2.5rem] border border-border/50 bg-card shadow-sm flex flex-col">
            <h2 className="text-xl font-black tracking-tight mb-8">Impact Progress</h2>
            
            <div className="flex-1 space-y-8">
              {[
                { title: "Rhema School", progress: 75, color: "bg-blue-500" },
                { title: "Clean Water Project", progress: 40, color: "bg-emerald-500" },
                { title: "Village Clinic", progress: 92, color: "bg-rose-500" },
              ].map((project, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold">{project.title}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${project.color.replace('bg-', 'text-')} ${project.color.replace('bg-', 'bg-')}/10`}>
                      {project.progress}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className={`h-full ${project.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}

              <div className="mt-auto pt-8">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white relative overflow-hidden shadow-lg shadow-primary/20">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Weekly Goal</p>
                    <h4 className="text-xl font-black mb-4 tracking-tight">Reached ₦2.4M of ₦3.0M</h4>
                    <button className="px-5 py-2.5 rounded-xl bg-white text-primary text-xs font-black hover:scale-105 transition-transform shadow-sm">
                      Manage Goals
                    </button>
                  </div>
                  <ShieldCheck size={120} className="absolute -bottom-6 -right-6 text-white/10 rotate-12" />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
