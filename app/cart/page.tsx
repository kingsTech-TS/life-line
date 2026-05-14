"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { 
  X, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  HeadphonesIcon,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const [couponCode, setCouponCode] = useState("");

  const shipping = 0; // Fast delivery as per image
  const taxes = 0;
  const discount = 0;
  const finalTotal = totalPrice + shipping + taxes - discount;

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-background py-20 flex flex-col items-center justify-center text-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground/40">
            <ShoppingBag size={48} />
          </div>
          <h1 className="text-4xl font-black tracking-tight">Your cart is empty</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Looks like you haven't added anything to your cart yet. Explore our shop to find something you love.
          </p>
          <Button asChild className="rounded-full px-8 h-12 bg-[#016AF9] hover:bg-blue-700 text-white font-bold shadow-xl shadow-blue-500/20">
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0b] py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-black tracking-tight text-foreground">Shopping Cart</h1>
          <nav className="flex items-center justify-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-widest">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-foreground">Shopping Cart</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Cart Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#016AF9]">
                    <th className="p-5 text-left text-[11px] font-black uppercase tracking-[0.2em] text-white rounded-tl-xl border-r border-white/10">Product</th>
                    <th className="p-5 text-center text-[11px] font-black uppercase tracking-[0.2em] text-white border-r border-white/10">Price</th>
                    <th className="p-5 text-center text-[11px] font-black uppercase tracking-[0.2em] text-white border-r border-white/10">Quantity</th>
                    <th className="p-5 text-right text-[11px] font-black uppercase tracking-[0.2em] text-white rounded-tr-xl">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item) => (
                      <motion.tr 
                        key={`${item.id}-${JSON.stringify(item.variants)}`}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group border-b border-zinc-100 dark:border-zinc-800"
                      >
                        <td className="py-8 pr-4">
                          <div className="flex items-center gap-6">
                            <button 
                              onClick={() => removeFromCart(item.id, item.variants)}
                              className="h-10 w-10 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors group-hover:scale-110 transition-transform"
                            >
                              <X size={20} strokeWidth={3} />
                            </button>
                            <div className="h-28 w-28 rounded-2xl overflow-hidden bg-muted flex-shrink-0 relative border border-zinc-100 dark:border-zinc-800 shadow-sm">
                              <Image 
                                src={item.image || "/placeholder.svg"} 
                                alt={item.name} 
                                fill 
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-black text-lg text-foreground tracking-tight">{item.name}</h3>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {Object.entries(item.variants).map(([key, val]) => (
                                  <span key={key} className="text-[10px] font-black text-muted-foreground uppercase bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded-md">
                                    {key}: {val}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-8 px-4 text-center">
                          <span className="font-bold text-lg text-zinc-600 dark:text-zinc-400">₦{item.price.toLocaleString()}</span>
                        </td>
                        <td className="py-8 px-4 text-center">
                          <div className="inline-flex items-center border-2 border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden h-12 bg-white dark:bg-zinc-950">
                            <button 
                              onClick={() => updateQuantity(item.id, item.variants, item.quantity - 1)}
                              className="w-12 h-full hover:bg-muted transition-colors flex items-center justify-center border-r border-zinc-100 dark:border-zinc-800"
                            >
                              <Minus size={14} strokeWidth={3} />
                            </button>
                            <span className="w-12 font-black text-lg">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.variants, item.quantity + 1)}
                              className="w-12 h-full hover:bg-muted transition-colors flex items-center justify-center border-l border-zinc-100 dark:border-zinc-800"
                            >
                              <Plus size={14} strokeWidth={3} />
                            </button>
                          </div>
                        </td>
                        <td className="py-8 pl-4 text-right">
                          <span className="font-black text-xl text-foreground tracking-tighter">₦{(item.price * item.quantity).toLocaleString()}</span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile List View */}
            <div className="md:hidden space-y-6">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  <motion.div
                    key={`${item.id}-${JSON.stringify(item.variants)}`}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm relative overflow-hidden group"
                  >
                    <div className="flex gap-4">
                      <div className="h-24 w-24 rounded-2xl overflow-hidden bg-muted flex-shrink-0 relative border border-zinc-100 dark:border-zinc-800">
                        <Image 
                          src={item.image || "/placeholder.svg"} 
                          alt={item.name} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-black text-base text-foreground tracking-tight leading-tight line-clamp-2">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id, item.variants)}
                            className="p-2 text-zinc-400 hover:text-red-500"
                          >
                            <X size={18} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Object.entries(item.variants).map(([key, val]) => (
                            <span key={key} className="text-[8px] font-black text-muted-foreground uppercase bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 px-1.5 py-0.5 rounded-md">
                              {key}: {val}
                            </span>
                          ))}
                        </div>
                        <p className="mt-3 font-black text-lg text-[#016AF9]">₦{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-zinc-50 dark:border-zinc-900">
                      <div className="inline-flex items-center border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden h-10 bg-zinc-50 dark:bg-zinc-900">
                        <button 
                          onClick={() => updateQuantity(item.id, item.variants, item.quantity - 1)}
                          className="w-10 h-full flex items-center justify-center border-r border-zinc-100 dark:border-zinc-800"
                        >
                          <Minus size={12} strokeWidth={3} />
                        </button>
                        <span className="w-10 text-center font-black text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.variants, item.quantity + 1)}
                          className="w-10 h-full flex items-center justify-center border-l border-zinc-100 dark:border-zinc-800"
                        >
                          <Plus size={12} strokeWidth={3} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-1">Subtotal</p>
                        <p className="font-black text-xl tracking-tighter">₦{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10">
              <div className="flex w-full sm:w-auto h-14 border-2 border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                <input 
                  type="text" 
                  placeholder="Coupon Code" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-6 bg-white dark:bg-zinc-950 outline-none text-sm font-bold placeholder:text-zinc-300"
                />
                <button className="px-8 bg-[#016AF9] text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-colors">
                  Apply Coupon
                </button>
              </div>
              <button 
                onClick={clearCart}
                className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-red-500 transition-colors"
              >
                Clear Shopping Cart
              </button>
            </div>
          </div>

          {/* Sidebar / Summary */}
          <div className="lg:col-span-4">
            <div className="bg-[#fafafa] dark:bg-zinc-900/50 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 p-10 sticky top-32 shadow-sm">
              <h2 className="text-2xl font-black tracking-tighter mb-10 border-b border-zinc-100 dark:border-zinc-800 pb-6">Order Summary</h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-zinc-400">
                  <span>Items</span>
                  <span className="text-zinc-900 dark:text-white font-black">{cartItems.reduce((s, i) => s + i.quantity, 0)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-zinc-400">
                  <span>Sub Total</span>
                  <span className="text-zinc-900 dark:text-white font-black">₦{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-zinc-400">
                  <span>Shipping</span>
                  <span className="text-zinc-900 dark:text-white font-black">₦{shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-zinc-400">
                  <span>Taxes</span>
                  <span className="text-zinc-900 dark:text-white font-black">₦{taxes.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-green-500">
                    <span>Coupon Discount</span>
                    <span className="font-black">-₦{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                  <span className="text-lg font-black tracking-tighter uppercase">Total</span>
                  <span className="text-4xl font-black text-foreground tracking-tighter">₦{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <Button asChild className="w-full h-16 bg-[#016AF9] hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </div>

        </div>

        {/* Features Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-40 pt-20 border-t border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center gap-6 group">
            <div className="h-20 w-20 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-[#016AF9] dark:text-white group-hover:bg-[#016AF9] group-hover:border-[#016AF9] group-hover:text-white transition-all duration-500">
              <Truck size={36} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-black text-xl tracking-tight">Fast delivery</h3>
              <p className="text-sm text-muted-foreground font-medium mt-1">Fast delivery on orders above ₦50,000</p>
            </div>
          </div>
          <div className="flex items-center gap-6 group">
            <div className="h-20 w-20 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-[#016AF9] dark:text-white group-hover:bg-[#016AF9] group-hover:border-[#016AF9] group-hover:text-white transition-all duration-500">
              <ShieldCheck size={36} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-black text-xl tracking-tight">Flexible Payment</h3>
              <p className="text-sm text-muted-foreground font-medium mt-1">Multiple secure payment options</p>
            </div>
          </div>
          <div className="flex items-center gap-6 group">
            <div className="h-20 w-20 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-[#016AF9] dark:text-white group-hover:bg-[#016AF9] group-hover:border-[#016AF9] group-hover:text-white transition-all duration-500">
              <HeadphonesIcon size={36} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-black text-xl tracking-tight">24x7 Support</h3>
              <p className="text-sm text-muted-foreground font-medium mt-1">We support online all days.</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
