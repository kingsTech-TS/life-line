"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  ShieldCheck, 
  ArrowUpRight, 
  Heart, 
  Activity, 
  Droplets, 
  BookOpen,
  DollarSign,
  Users,
  Target
} from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface FinancialStats {
  summary: {
    totalRevenue: number;
    totalDonations: number;
    totalShopRevenue: number;
    projectCount: number;
    livesImpacted: number;
  };
  allocations: {
    category: string;
    percentage: number;
    icon: string;
    color: string;
  }[];
  recentTransactions: {
    donorName: string;
    amount: number;
    createdAt: string;
    isAnonymous: boolean;
  }[];
  ethics: {
    title: string;
    description: string;
    icon: string;
  }[];
}

const iconMap: Record<string, any> = {
  Activity,
  Droplets,
  BookOpen,
  ShieldCheck,
  Heart,
  Target
};

export default function FinancesPage() {
  const [stats, setStats] = useState<FinancialStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/finances/stats")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading financial stats:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <main className="min-h-screen bg-[#f5f8ff] dark:bg-[#060d1a] pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <section className="mb-16 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6"
          >
            <ShieldCheck size={14} /> Financial Transparency
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-foreground mb-6 leading-tight tracking-tighter"
          >
            Accountability in <span className="text-primary">Every Cent.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground font-medium"
          >
            We believe in radical transparency. Here&apos;s a live look at how your support 
            is fueling healthcare and wellness across underserved communities.
          </motion.p>
        </section>

        {/* Key Metrics Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {[
            { label: "Total Revenue", value: `₦${stats?.summary.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "bg-blue-500" },
            { label: "Lives Impacted", value: stats?.summary.livesImpacted.toLocaleString(), icon: Users, color: "bg-emerald-500" },
            { label: "Active Projects", value: stats?.summary.projectCount, icon: Target, color: "bg-amber-500" },
            { label: "Donations", value: `₦${stats?.summary.totalDonations.toLocaleString()}`, icon: Heart, color: "bg-rose-500" },
          ].map((metric, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="p-6 h-full flex flex-col justify-between glass-card hover:shadow-xl hover:shadow-primary/5 transition-all group overflow-hidden relative">
                <div className={`absolute top-0 right-0 w-24 h-24 ${metric.color} opacity-[0.03] rounded-bl-full group-hover:scale-150 transition-transform`} />
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${metric.color}/10 text-${metric.color.split('-')[1]}-500`}>
                    <metric.icon size={24} />
                  </div>
                  <ArrowUpRight size={16} className="text-muted-foreground/30" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">
                    {metric.label}
                  </p>
                  <p className="text-3xl font-black text-foreground tracking-tighter">
                    {metric.value}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Fund Allocation Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="p-8 h-full glass-card border-primary/10">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-2xl font-black text-foreground flex items-center gap-2">
                    <PieChart size={24} className="text-primary" />
                    How Funds Are Allocated
                  </h2>
                  <p className="text-sm text-muted-foreground font-medium mt-1">Strategic distribution for maximum community impact.</p>
                </div>
              </div>

              <div className="space-y-8">
                {stats?.allocations.map((alloc, i) => {
                  const Icon = iconMap[alloc.icon];
                  return (
                    <div key={i} className="group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${alloc.color}15`, color: alloc.color }}>
                            {Icon && <Icon size={20} />}
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{alloc.category}</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Primary Sector</p>
                          </div>
                        </div>
                        <p className="text-xl font-black" style={{ color: alloc.color }}>{alloc.percentage}%</p>
                      </div>
                      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${alloc.percentage}%` }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                          className="h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                          style={{ backgroundColor: alloc.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 p-6 rounded-3xl bg-primary/5 border border-primary/10">
                <p className="text-sm text-foreground/70 font-medium leading-relaxed italic">
                  &quot;Every Naira donated or spent in our shop contributes directly to our mission. 
                  We maintain a low administrative overhead to ensure that over 85% of all funds 
                  reach the field directly.&quot;
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Recent Transparency Feed */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-8 h-full glass-card overflow-hidden flex flex-col">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-foreground flex items-center gap-2">
                  <Activity size={24} className="text-primary" />
                  Live Feed
                </h2>
                <p className="text-sm text-muted-foreground font-medium mt-1">Real-time contribution transparency.</p>
              </div>

              <div className="space-y-6 flex-1">
                {stats?.recentTransactions.map((tx, i) => (
                  <div key={i} className="flex items-start gap-4 pb-6 border-b border-border/50 last:border-0 last:pb-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary flex-shrink-0">
                      <DollarSign size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <p className="font-bold text-sm text-foreground truncate">
                          {tx.isAnonymous ? "Anonymous Donor" : tx.donorName}
                        </p>
                        <p className="font-black text-sm text-primary">₦{tx.amount.toLocaleString()}</p>
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                        {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link 
                  href="/donate" 
                  className="w-full py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group"
                >
                  Join the Mission <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* FAQ / Info Section */}
        <section className="mt-24 bg-card/50 rounded-[3rem] border border-border/50 p-8 md:p-16 text-center overflow-hidden relative">
          <div className="absolute inset-0 bg-mesh opacity-50" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl font-black text-foreground mb-6 tracking-tight">Our Financial Ethics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats?.ethics.map((item, i) => {
                const Icon = iconMap[item.icon];
                return (
                  <div key={i}>
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                      {Icon && <Icon size={20} />}
                    </div>
                    <h4 className="text-sm font-black uppercase text-primary mb-3">{item.title}</h4>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}