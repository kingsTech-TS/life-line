"use client";

import React, { useState, useEffect } from "react";
import { 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  Search, 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail,
  DollarSign 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const STATUS_STEPS = [
  { label: "Order Placed", icon: Package, key: "pending" },
  { label: "Packed", icon: Clock, key: "packed" },
  { label: "Shipped", icon: Truck, key: "shipped" },
  { label: "Ready", icon: MapPin, key: "out_for_delivery" },
  { label: "Delivered", icon: CheckCircle2, key: "delivered" },
];

export default function TrackOrder() {
  const { user, openAuthModal } = useAuth();
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [myOrders, setMyOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      openAuthModal();
    } else {
      fetchMyOrders();
    }
  }, [user]);

  const fetchMyOrders = async () => {
    try {
      const res = await fetch("/api/orders/my-orders");
      if (res.ok) {
        const data = await res.json();
        setMyOrders(data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const handleTrack = async (e?: React.FormEvent, idToTrack?: string) => {
    if (e) e.preventDefault();
    
    // Ensure we have a valid, trimmed ID
    const id = (idToTrack || orderId || "").trim();
    
    if (!id) {
      setError("Please enter a valid order ID");
      return;
    }
    
    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Use URLSearchParams for safe encoding
      const params = new URLSearchParams({ id });
      const res = await fetch(`/api/orders/track?${params.toString()}`);
      
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Order not found. Please verify your order ID.");
      } else {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error("Track Error:", err);
      setError("Connection error. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    const map: Record<string, number> = { 
      pending: 0, 
      processing: 0,
      packed: 1, 
      shipped: 2, 
      out_for_delivery: 3, 
      delivered: 4 
    };
    return map[status?.toLowerCase()] ?? 0;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground font-medium">Please sign in to track your orders</p>
          <button 
            onClick={openAuthModal}
            className="px-8 py-3 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest hover:bg-primary/90 transition-all"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f9fb] dark:bg-[#060608] py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back */}
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-10 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="bg-card rounded-3xl border border-border/50 p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                  <Search size={20} className="text-primary" /> Track Order
                </h2>
                <form onSubmit={handleTrack} className="space-y-4">
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="Enter Order ID"
                      className="w-full px-4 py-3 rounded-2xl bg-muted/30 border border-border/50 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                  </div>
                  {error && <p className="text-red-500 text-[10px] font-bold">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      "Track"
                    )}
                  </button>
                </form>
              </div>

              <div className="bg-card rounded-3xl border border-border/50 p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                  <Package size={20} className="text-primary" /> My Orders
                </h2>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                  {myOrders.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic py-4 text-center">No orders found.</p>
                  ) : (
                    myOrders.map((order) => (
                      <button
                        key={order._id}
                        onClick={() => handleTrack(undefined, order._id)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all hover:scale-[1.02] active:scale-95 ${
                          result?._id === order._id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border/50 bg-muted/20 hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-xs font-black uppercase tracking-tighter">#{order._id.slice(-6).toUpperCase()}</p>
                          <span className="text-[10px] font-bold text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-[10px] font-black text-primary uppercase">{order.status}</p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card rounded-[2.5rem] border border-border/50 p-8 md:p-12 shadow-sm space-y-10"
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between flex-wrap gap-6">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Tracking Order</p>
                      <h3 className="text-3xl font-black tracking-tight text-foreground">#{result._id?.toUpperCase()}</h3>
                      <p className="text-sm font-medium text-muted-foreground mt-1">Placed on {new Date(result.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-sm ${
                        result.status === "delivered"
                          ? "bg-green-500 text-white shadow-green-500/20"
                          : result.status === "shipped"
                          ? "bg-blue-500 text-white shadow-blue-500/20"
                          : "bg-amber-500 text-white shadow-amber-500/20"
                      }`}>
                        {result.status?.replace(/_/g, ' ') || "Processing"}
                      </span>
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="relative pt-10 pb-4">
                    <div className="absolute top-[5.25rem] left-8 right-8 h-1 bg-border rounded-full" />
                    <motion.div
                      className="absolute top-[5.25rem] left-8 h-1 bg-primary rounded-full shadow-[0_0_15px_rgba(1,106,249,0.5)] transition-all duration-1000"
                      initial={{ width: 0 }}
                      animate={{ width: `calc(${(getStepIndex(result.status) / 4) * 100}% - 4rem)` }}
                    />
                    <div className="relative flex justify-between">
                      {STATUS_STEPS.map((step, i) => {
                        const done = i <= getStepIndex(result.status);
                        const current = i === getStepIndex(result.status);
                        return (
                          <div key={step.key} className="flex flex-col items-center gap-4 w-24">
                            <div className={`h-16 w-16 rounded-[2rem] flex items-center justify-center transition-all duration-500 z-10 border-4 ${
                              done 
                                ? "bg-primary text-white border-white dark:border-zinc-900 shadow-xl shadow-primary/30 scale-110" 
                                : "bg-muted text-muted-foreground border-transparent"
                            } ${current ? "animate-pulse ring-4 ring-primary/20" : ""}`}>
                              <step.icon size={24} />
                            </div>
                            <div className="text-center">
                              <span className={`text-xs font-black uppercase tracking-tighter leading-tight block ${done ? "text-primary" : "text-muted-foreground"}`}>
                                {step.label}
                              </span>
                              {done && <span className="text-[9px] font-bold text-muted-foreground/60 mt-1 block">Completed</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-border/50">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4 p-6 rounded-3xl bg-muted/20 border border-border/30">
                        <Mail size={20} className="text-primary mt-1" />
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Customer Info</p>
                          <p className="text-base font-bold">{result.customerName}</p>
                          <p className="text-sm text-muted-foreground">{result.customerEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-6 rounded-3xl bg-muted/20 border border-border/30">
                        <MapPin size={20} className="text-primary mt-1" />
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Delivery Address</p>
                          <p className="text-sm font-bold leading-relaxed">{result.deliveryAddress}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-muted/20 border border-border/30">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-4">Order Summary</p>
                      <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 scrollbar-hide">
                        {result.items?.map((item: any, i: number) => (
                          <div key={i} className="flex gap-4">
                            <div className="h-12 w-12 rounded-xl bg-muted relative overflow-hidden flex-shrink-0">
                              <img src={item.image || "/placeholder.svg"} alt={item.name} className="object-cover w-full h-full" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold truncate">{item.name}</p>
                              <p className="text-[10px] text-muted-foreground font-bold">Qty: {item.quantity} × ₦{(item.price || 0).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 pt-4 border-t border-border/50 flex justify-between items-center">
                        <p className="text-sm font-black uppercase">Total Paid</p>
                        <p className="text-xl font-black text-primary">₦{(result.totalAmount || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 bg-muted/10 rounded-[3rem] border border-dashed border-border/50"
                >
                  <div className="h-20 w-20 rounded-[2.5rem] bg-muted/50 flex items-center justify-center text-muted-foreground mb-6">
                    <Truck size={40} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight mb-2">Ready to Track?</h3>
                  <p className="text-muted-foreground max-w-sm">Select an order from the list or enter your Order ID to see real-time progress.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}

