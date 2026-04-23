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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function VendorPurchases() {
  const [sales, setSales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSales = async () => {
    try {
      const res = await fetch("/api/vendor/purchases");
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
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Sales & Orders
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Track and manage orders for your products.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <Input
            placeholder="Search by order ID, customer name or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 rounded-2xl bg-card border-border/50 shadow-sm focus-visible:ring-primary/20"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 rounded-[2.5rem] bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredSales.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 rounded-[3rem]">
              <ShoppingBag className="mx-auto text-muted-foreground mb-4 opacity-20" size={64} />
              <p className="text-muted-foreground font-black text-xl">No sales found.</p>
            </div>
          ) : (
            filteredSales.map((sale) => (
              <Card
                key={sale._id}
                className="p-8 rounded-[3rem] border-border/50 bg-card/50 backdrop-blur-xl hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden relative group"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-1/3 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <ShoppingBag size={20} />
                      </div>
                      <div>
                        <p className="font-black text-sm tracking-tight uppercase opacity-50">Order ID</p>
                        <p className="font-black text-lg tracking-tight">#{sale._id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border/50">
                      <div className="flex items-start gap-3">
                        <User size={16} className="text-primary mt-1" />
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Customer</p>
                          <p className="font-bold text-sm">{sale.customerName}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail size={16} className="text-primary mt-1" />
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email</p>
                          <p className="font-bold text-sm">{sale.customerEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin size={16} className="text-primary mt-1" />
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Shipping Address</p>
                          <p className="font-bold text-sm">{sale.deliveryAddress}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:flex-1 space-y-6">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 ml-2">Items Purchased</h3>
                      <div className="space-y-3">
                        {sale.items.map((item: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-bold text-sm">{item.name}</p>
                                <p className="text-xs text-muted-foreground font-medium">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-sm">₦{(item.price * item.quantity).toLocaleString()}</p>
                              <p className="text-[10px] text-muted-foreground font-bold">₦{item.price.toLocaleString()} each</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-6 rounded-[2rem] bg-primary/5 border border-primary/10">
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-primary">Your Subtotal</p>
                        <p className="text-3xl font-black text-primary tracking-tighter">₦{sale.vendorTotal.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Status</p>
                        <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest mt-1">
                          {sale.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-8 right-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground opacity-50">
                  <Clock size={14} />
                  {new Date(sale.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })}
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
