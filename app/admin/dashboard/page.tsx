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
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    activeProjects: 0,
    totalShopOrders: 0,
  });

  // Simulated fetching for now
  useEffect(() => {
    // In a real app, you'd fetch this from an API
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
      color: "from-[#ff5f6d] to-[#ffc371]",
      shadow: "shadow-[#ff5f6d]/20",
    },
    {
      label: "Amount Raised",
      value: `₦${(stats.totalAmount / 1000000).toFixed(1)}M`,
      icon: TrendingUp,
      trend: "+5.2%",
      color: "from-[#11998e] to-[#38ef7d]",
      shadow: "shadow-[#11998e]/20",
    },
    {
      label: "Active Projects",
      value: stats.activeProjects,
      icon: Users,
      trend: "+2",
      color: "from-[#00c6ff] to-[#0072ff]",
      shadow: "shadow-[#00c6ff]/20",
    },
    {
      label: "Inventory Sales",
      value: stats.totalShopOrders,
      icon: ShoppingBag,
      trend: "+8.1%",
      color: "from-[#f2994a] to-[#f2c94c]",
      shadow: "shadow-[#f2994a]/20",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Overview
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Welcome back, Admin. Here's what's happening today.
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

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Card
              className={`group relative overflow-hidden p-6 rounded-[2.5rem] border-none shadow-xl ${stat.shadow} bg-card hover:translate-y-[-4px] transition-all duration-300`}
            >
              <div className="relative z-10 flex justify-between items-start mb-6">
                <div
                  className={`p-3.5 rounded-2xl bg-gradient-to-br ${stat.color} text-white`}
                >
                  <stat.icon size={24} />
                </div>
                <div className="flex items-center text-[10px] font-black text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {stat.trend} <ArrowUpRight size={12} className="ml-1" />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.15em] mb-1">
                  {stat.label}
                </p>
                <h2 className="text-3xl font-black">{stat.value}</h2>
              </div>

              {/* Decorative circle */}
              <div
                className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.03] group-hover:opacity-[0.07] rounded-full transition-opacity duration-300`}
              />
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-2"
        >
          <Card className="overflow-hidden rounded-[2.5rem] border-border/50 shadow-2xl shadow-black/[0.02] bg-card/50 backdrop-blur-sm">
            <div className="p-8 flex items-center justify-between border-b border-border/50">
              <h3 className="text-xl font-black">Recent Activity</h3>
              <button className="p-2 rounded-xl hover:bg-muted transition-colors">
                <MoreVertical size={20} className="text-muted-foreground" />
              </button>
            </div>
            <div className="p-8 space-y-7">
              {[
                {
                  name: "John Doe",
                  action: "donated",
                  amount: "₦50,000",
                  time: "2 hours ago",
                  initial: "JD",
                },
                {
                  name: "Sarah Smith",
                  action: "purchased",
                  item: "LifeLine Hoodie",
                  time: "4 hours ago",
                  initial: "SS",
                },
                {
                  name: "Global Health",
                  action: "joined as",
                  partner: "Partner",
                  time: "6 hours ago",
                  initial: "GH",
                },
                {
                  name: "Michael Obi",
                  action: "donated",
                  amount: "₦120,000",
                  time: "1 day ago",
                  initial: "MO",
                },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-5 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-sm font-black group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                    {activity.initial}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">
                      <span className="text-foreground">{activity.name}</span>{" "}
                      <span className="text-muted-foreground font-medium">
                        {activity.action}
                      </span>{" "}
                      <span className="text-primary font-bold">
                        {activity.amount || activity.item || activity.partner}
                      </span>
                    </p>
                    <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">
                      {activity.time}
                    </p>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-muted-foreground group-hover:translate-x-1 transition-transform"
                  />
                </div>
              ))}
            </div>
            <div className="px-8 pb-8">
              <button className="w-full py-4 rounded-2xl bg-muted/50 hover:bg-muted text-sm font-bold transition-all duration-300">
                View All Activity
              </button>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full overflow-hidden rounded-[2.5rem] border-border/50 shadow-2xl shadow-black/[0.02] bg-card/50 backdrop-blur-sm">
            <div className="p-8 border-b border-border/50">
              <h3 className="text-xl font-black">Impact Progress</h3>
            </div>
            <div className="p-8 space-y-8">
              {[
                { title: "Rhema School", progress: 75, color: "bg-primary" },
                {
                  title: "Clean Water Project",
                  progress: 40,
                  color: "bg-secondary",
                },
                {
                  title: "Village Clinic",
                  progress: 92,
                  color: "bg-green-500",
                },
              ].map((project, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold">{project.title}</span>
                    <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className={`h-full ${project.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}

              <div className="mt-10 p-6 rounded-[2rem] bg-gradient-to-br from-primary to-primary/80 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">
                    Weekly Goal
                  </p>
                  <h4 className="text-xl font-black mb-4">
                    Reached ₦2.4M of ₦3.0M
                  </h4>
                  <button className="px-4 py-2 rounded-xl bg-white text-primary text-xs font-black hover:bg-opacity-90 transition-all shadow-lg">
                    Manage Goals
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
