"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  ShoppingBag,
  Search,
  ChevronRight,
  Package,
  Calendar,
  Clock,
  DollarSign,
  User,
  MapPin,
  Mail,
  Truck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function VendorPurchases() {
  const [sales, setSales] = useState<any[]>([]);
  const [commissionRate, setCommissionRate] = useState(15);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSales = async () => {
    try {
      const res = await fetch("/api/vendor/purchases");
      const data = await res.json();
      if (data.sales && Array.isArray(data.sales)) {
        setSales(data.sales);
        if (data.commissionRate !== undefined) {
          setCommissionRate(data.commissionRate);
        }
      } else if (Array.isArray(data)) {
        // Fallback for old cached data if any
        setSales(data);
      }
    } catch (error) {
      console.error("Failed to fetch sales", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const filteredSales = sales.filter(
    (sale) =>
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.items.some((item: any) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Sales & Orders
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Track and manage orders for your products.
          </p>
        </div>
      </div>

      <Card className="p-2 rounded-2xl bg-card border border-border/50 shadow-sm">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <Input
            placeholder="Search by order ID, customer name or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 rounded-xl bg-transparent border-none shadow-none focus-visible:ring-0 text-base font-medium"
          />
        </div>
      </Card>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-[2.5rem] bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredSales.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-card rounded-[2.5rem] border border-border/50 text-center opacity-50">
              <Package className="text-muted-foreground mb-4" size={64} />
              <p className="text-2xl font-black tracking-tight">No sales found.</p>
              <p className="text-sm font-medium text-muted-foreground mt-2">Try adjusting your search term.</p>
            </div>
          ) : (
            filteredSales.map((sale, index) => (
              <motion.div
                key={sale._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-0 rounded-[2.5rem] border border-border/50 bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                  <div className="flex flex-col lg:flex-row">
                    
                    {/* Left Column: Order Details */}
                    <div className="lg:w-1/3 bg-muted/30 p-8 border-r border-border/50">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-background border border-border/50 flex items-center justify-center text-foreground shadow-sm">
                          <ShoppingBag size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order ID</p>
                          <p className="font-black text-lg tracking-tight">#{sale._id.slice(-8).toUpperCase()}</p>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div className="flex items-start gap-3">
                          <User size={16} className="text-primary mt-0.5" />
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</p>
                            <p className="font-bold text-sm text-foreground">{sale.customerName}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Mail size={16} className="text-primary mt-0.5" />
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email</p>
                            <p className="font-bold text-sm text-foreground">{sale.customerEmail}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin size={16} className="text-primary mt-0.5" />
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Shipping Address</p>
                            <p className="font-bold text-sm text-foreground leading-snug">{sale.deliveryAddress}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-border/50 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                        <Clock size={14} />
                        {new Date(sale.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    </div>

                    {/* Right Column: Items and Total */}
                    <div className="lg:w-2/3 p-8 flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Package size={16} /> Items Purchased
                        </h3>
                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            sale.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                            sale.status === 'shipped' ? 'bg-blue-500/10 text-blue-500' :
                            'bg-amber-500/10 text-amber-600'
                          }`}>
                            {sale.status || 'Processing'}
                        </span>
                      </div>

                      <div className="flex-1 space-y-3">
                        {sale.items.map((item: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/30 hover:bg-muted/40 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-background border border-border/50 flex items-center justify-center overflow-hidden flex-shrink-0">
                                <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-bold text-sm text-foreground line-clamp-1">{item.name}</p>
                                <p className="text-xs text-muted-foreground font-medium mt-0.5">Qty: {item.quantity} × ₦{item.price.toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="text-right pl-4">
                              <p className="font-black text-sm text-foreground">₦{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 flex items-center justify-between p-6 rounded-2xl bg-primary/5 border border-primary/10">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Your Payout</p>
                          <p className="text-sm text-primary/70 font-bold">After {commissionRate}% platform fee</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-black text-primary tracking-tighter">₦{sale.vendorTotal.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
