"use client";

import { useState } from "react";
import { Truck, Package, CheckCircle2, Clock, Search, ArrowLeft, MapPin, Phone, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const STATUS_STEPS = [
  { label: "Order Placed", icon: Package, key: "placed" },
  { label: "Processing", icon: Clock, key: "processing" },
  { label: "Shipped", icon: Truck, key: "shipped" },
  { label: "Delivered", icon: CheckCircle2, key: "delivered" },
];

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return setError("Please enter an order ID");
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/orders/track?id=${orderId.trim()}&email=${encodeURIComponent(email)}`);
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Order not found. Please check your order ID.");
      } else {
        const data = await res.json();
        setResult(data);
      }
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    const map: Record<string, number> = { placed: 0, processing: 1, shipped: 2, delivered: 3 };
    return map[status?.toLowerCase()] ?? 0;
  };

  return (
    <main className="min-h-screen bg-[#f8f9fb] dark:bg-[#060608] py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Back */}
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-10 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Shop
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
              <Truck size={32} />
            </div>
            <h1 className="text-4xl font-black tracking-tight">Track Your Order</h1>
            <p className="text-muted-foreground">Enter your order ID to get real-time delivery updates.</p>
          </div>

          {/* Form */}
          <div className="bg-card rounded-3xl border border-border/50 p-8 shadow-sm space-y-6">
            <form onSubmit={handleTrack} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Order ID</label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. ORD-ABC123"
                  className="w-full px-4 py-3.5 rounded-2xl bg-muted/30 border border-border/50 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email Address (optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3.5 rounded-2xl bg-muted/30 border border-border/50 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>
              {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <><Search size={16} /> Track Order</>
                )}
              </button>
            </form>
          </div>

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-3xl border border-border/50 p-8 shadow-sm space-y-8"
              >
                {/* Order Info */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Order ID</p>
                    <p className="text-xl font-black mt-1">#{result._id?.slice(-8).toUpperCase()}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                    result.status === "delivered"
                      ? "bg-green-500/10 text-green-500"
                      : result.status === "shipped"
                      ? "bg-blue-500/10 text-blue-500"
                      : "bg-amber-500/10 text-amber-600"
                  }`}>
                    {result.status || "Processing"}
                  </span>
                </div>

                {/* Progress Steps */}
                <div className="relative">
                  <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
                  <div
                    className="absolute top-5 left-5 h-0.5 bg-primary transition-all duration-700"
                    style={{ width: `${(getStepIndex(result.status) / 3) * 100}%` }}
                  />
                  <div className="relative flex justify-between">
                    {STATUS_STEPS.map((step, i) => {
                      const done = i <= getStepIndex(result.status);
                      return (
                        <div key={step.key} className="flex flex-col items-center gap-2 w-16">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all z-10 ${
                            done ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-muted text-muted-foreground"
                          }`}>
                            <step.icon size={18} />
                          </div>
                          <span className={`text-[10px] font-black uppercase text-center leading-tight ${done ? "text-primary" : "text-muted-foreground"}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Customer Info */}
                {result.customerName && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/50">
                    <div className="flex items-start gap-3">
                      <Mail size={16} className="text-primary mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground">Customer</p>
                        <p className="text-sm font-bold">{result.customerName}</p>
                        <p className="text-xs text-muted-foreground">{result.customerEmail}</p>
                      </div>
                    </div>
                    {result.deliveryAddress && (
                      <div className="flex items-start gap-3">
                        <MapPin size={16} className="text-primary mt-0.5" />
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground">Delivery Address</p>
                          <p className="text-sm font-bold">{result.deliveryAddress}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Help */}
          <div className="bg-muted/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 text-sm">
            <Phone size={20} className="text-primary flex-shrink-0" />
            <div>
              <p className="font-black">Need help with your order?</p>
              <p className="text-muted-foreground">Call us at <a href="tel:+2348000000000" className="text-primary font-bold">+234 800 000 0000</a> or email <a href="mailto:shop@lifeline.org.ng" className="text-primary font-bold">shop@lifeline.org.ng</a></p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
