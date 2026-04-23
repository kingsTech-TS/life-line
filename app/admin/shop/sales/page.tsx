"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  ShoppingBag,
  Search,
  Package,
  Calendar,
  Clock,
  ArrowLeft,
  Filter,
  DollarSign,
  TrendingUp,
  User,
  MapPin,
  Mail,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AdminShopSales() {
  const [sales, setSales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'createdAt',
    direction: 'desc'
  });
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch("/api/admin/shop/sales");
        const data = await res.json();
        if (Array.isArray(data)) {
          setSales(data);
        }
      } catch (error) {
        console.error("Failed to fetch sales", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSales();
  }, []);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleExpand = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const sortedSales = [...sales].sort((a, b) => {
    if (sortConfig.key === 'createdAt') {
      return sortConfig.direction === 'asc' 
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortConfig.key === 'totalAmount') {
      return sortConfig.direction === 'asc' ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount;
    }
    if (sortConfig.key === 'platformEarnings') {
      return sortConfig.direction === 'asc' ? a.platformEarnings - b.platformEarnings : b.platformEarnings - a.platformEarnings;
    }
    return 0;
  });

  const filteredSales = sortedSales.filter(
    (sale) =>
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPlatformEarnings = sales.reduce((acc, sale) => acc + sale.platformEarnings, 0);
  const totalShopSales = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);

  return (
    <div className="space-y-8 pb-10">
      <Link 
        href="/admin/shop" 
        className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Inventory
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Sales & Earnings
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Track all shop purchases, vendor payouts, and platform commissions.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 rounded-[2rem] border border-border/50 bg-card overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-all duration-500">
            <TrendingUp size={80} />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <TrendingUp size={24} />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Total Shop Sales</p>
            <p className="text-3xl font-black tracking-tighter">₦{totalShopSales.toLocaleString()}</p>
          </div>
        </Card>
        
        <Card className="p-6 rounded-[2rem] border border-border/50 bg-card overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-all duration-500">
            <DollarSign size={80} />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <DollarSign size={24} />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Platform Earnings (Commission)</p>
            <p className="text-3xl font-black tracking-tighter text-primary">₦{totalPlatformEarnings.toLocaleString()}</p>
          </div>
        </Card>
        
        <Card className="p-6 rounded-[2rem] border border-border/50 bg-card overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-all duration-500">
            <ShoppingBag size={80} />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
              <ShoppingBag size={24} />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Total Orders</p>
            <p className="text-3xl font-black tracking-tighter">{sales.length}</p>
          </div>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Search by Order ID, Customer Name, or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 rounded-2xl bg-card border-border/50 shadow-sm focus-visible:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-muted-foreground mr-2">Sort by:</span>
          <button 
            onClick={() => handleSort('createdAt')}
            className={`px-4 h-14 rounded-2xl border font-bold text-sm transition-all ${sortConfig.key === 'createdAt' ? 'bg-primary/10 border-primary text-primary' : 'bg-card border-border/50 hover:bg-muted'}`}
          >
            Date {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            onClick={() => handleSort('totalAmount')}
            className={`px-4 h-14 rounded-2xl border font-bold text-sm transition-all ${sortConfig.key === 'totalAmount' ? 'bg-primary/10 border-primary text-primary' : 'bg-card border-border/50 hover:bg-muted'}`}
          >
            Amount {sortConfig.key === 'totalAmount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            onClick={() => handleSort('platformEarnings')}
            className={`px-4 h-14 rounded-2xl border font-bold text-sm transition-all ${sortConfig.key === 'platformEarnings' ? 'bg-primary/10 border-primary text-primary' : 'bg-card border-border/50 hover:bg-muted'}`}
          >
            Commission {sortConfig.key === 'platformEarnings' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-[2rem] bg-muted animate-pulse" />
          ))}
        </div>
      ) : filteredSales.length === 0 ? (
        <div className="text-center py-24 bg-muted/20 rounded-[3rem] border border-border/50">
          <ShoppingBag className="mx-auto text-muted-foreground mb-4 opacity-20" size={64} />
          <p className="text-2xl font-black text-foreground">No sales found.</p>
          <p className="text-muted-foreground font-medium mt-2">Adjust your search or wait for new orders.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSales.map((sale, index) => {
            const isExpanded = expandedOrders.has(sale._id);
            return (
              <motion.div
                key={sale._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="rounded-[2rem] border border-border/50 bg-card overflow-hidden hover:border-primary/30 transition-colors">
                  {/* Order Header Summary */}
                  <div 
                    onClick={() => toggleExpand(sale._id)}
                    className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center">
                        <ShoppingBag size={20} className="text-foreground/60" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-black text-lg tracking-tight">#{sale._id.slice(-8).toUpperCase()}</p>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            sale.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                            sale.status === 'shipped' ? 'bg-blue-500/10 text-blue-500' :
                            'bg-amber-500/10 text-amber-600'
                          }`}>
                            {sale.status || 'Processing'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-muted-foreground">
                          <span className="flex items-center gap-1.5"><User size={14} /> {sale.customerName}</span>
                          <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(sale.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 bg-muted/30 p-4 rounded-2xl">
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Total Amount</p>
                        <p className="font-black text-base text-foreground">₦{sale.totalAmount.toLocaleString()}</p>
                      </div>
                      <div className="w-px h-8 bg-border"></div>
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-0.5">Platform Earned</p>
                        <p className="font-black text-lg text-primary">₦{sale.platformEarnings.toLocaleString()}</p>
                      </div>
                      <div className="text-muted-foreground">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 border-t border-border/50 bg-muted/5 flex flex-col lg:flex-row gap-8">
                          
                          {/* Customer Details */}
                          <div className="lg:w-1/3 pt-6 space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Customer Details</h4>
                            <div className="space-y-3 p-4 rounded-2xl bg-card border border-border/50">
                              <div className="flex items-start gap-3">
                                <User size={16} className="text-primary mt-0.5" />
                                <div>
                                  <p className="text-[10px] font-black uppercase text-muted-foreground">Name</p>
                                  <p className="font-bold text-sm">{sale.customerName}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <Mail size={16} className="text-primary mt-0.5" />
                                <div>
                                  <p className="text-[10px] font-black uppercase text-muted-foreground">Email</p>
                                  <p className="font-bold text-sm">{sale.customerEmail}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <MapPin size={16} className="text-primary mt-0.5" />
                                <div>
                                  <p className="text-[10px] font-black uppercase text-muted-foreground">Address</p>
                                  <p className="font-bold text-sm">{sale.deliveryAddress || "N/A"}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex justify-between items-center">
                              <span className="text-xs font-bold text-primary">Vendor Total Payout</span>
                              <span className="font-black text-primary">₦{sale.totalVendorPayout.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="lg:w-2/3 pt-6 border-t lg:border-t-0 lg:border-l border-border/50 lg:pl-8">
                             <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Ordered Items</h4>
                             <div className="space-y-3">
                               {sale.items.map((item: any, i: number) => (
                                 <div key={i} className="p-4 rounded-2xl bg-card border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                   <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                                       <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                                     </div>
                                     <div>
                                       <p className="font-bold text-sm text-foreground">{item.name}</p>
                                       <div className="flex items-center gap-2 mt-1">
                                         <span className="text-xs font-medium text-muted-foreground">Qty: {item.quantity} × ₦{item.price.toLocaleString()}</span>
                                       </div>
                                       {item.variants && Object.keys(item.variants).length > 0 && (
                                        <p className="text-[10px] text-muted-foreground mt-1">
                                          {Object.entries(item.variants).map(([k,v]) => `${k}: ${v}`).join(', ')}
                                        </p>
                                       )}
                                     </div>
                                   </div>
                                   
                                   <div className="flex items-center gap-4 sm:justify-end">
                                     <div className="text-right">
                                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vendor</p>
                                       <p className="text-xs font-bold bg-muted px-2 py-1 rounded-md mt-1">{item.vendorName}</p>
                                     </div>
                                     <div className="text-right pl-4 border-l border-border/50">
                                       <p className="text-[10px] font-black uppercase tracking-widest text-primary">Commission ({item.commissionRate}%)</p>
                                       <p className="text-sm font-black text-primary mt-1">₦{((item.price * item.quantity) * (item.commissionRate / 100)).toLocaleString()}</p>
                                     </div>
                                   </div>
                                 </div>
                               ))}
                             </div>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
