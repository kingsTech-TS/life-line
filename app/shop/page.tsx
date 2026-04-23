"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Search,
  Package,
  Star,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Truck,
  Shield,
  RefreshCw,
  Tag,
  SlidersHorizontal,
  X,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { toast } from "react-toastify";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

const CATEGORIES = ["All", "Apparel", "Accessories", "Art", "Books", "Health", "Food"];

export default function Shop() {
  const [shopProducts, setShopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const router = useRouter();
  const { setIsCartOpen, totalItems, addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/inventory");
        const data = await response.json();
        if (Array.isArray(data)) setShopProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = shopProducts
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase());
      const matchCat =
        activeCategory === "All" ||
        p.category?.toLowerCase() === activeCategory.toLowerCase();
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    if (product.stock === 0) return toast.error("Out of stock");
    addToCart(product, {});
    toast.success(`${product.name} added to cart!`);
    setIsCartOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#f8f9fb] dark:bg-[#060608]">
      {/* ─── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 text-center">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6"
          >
            <Store size={12} /> Shop For A Cause
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-none"
          >
            LifeLine <span className="text-white/60">Shop</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/70 max-w-xl mx-auto mb-10"
          >
            Every purchase directly supports rural healthcare across Nigeria.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-xl mx-auto"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 font-medium text-sm outline-none focus:ring-2 focus:ring-white/30 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
                <X size={16} />
              </button>
            )}
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-10"
          >
            {[
              { icon: Truck, label: "Free Delivery over ₦20k" },
              { icon: Shield, label: "Secure Checkout" },
              { icon: RefreshCw, label: "Easy Returns" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2 text-xs text-white/70 font-bold">
                <f.icon size={14} className="text-white/50" />
                {f.label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Sticky Toolbar ──────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide w-full sm:w-auto pb-1 sm:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-bold bg-transparent text-muted-foreground outline-none cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-black transition-all hover:bg-primary/90"
            >
              <ShoppingCart size={14} />
              Cart
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-black">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Products Grid ────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-3xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center opacity-40">
            <Package size={64} className="mb-4 text-muted-foreground" />
            <h3 className="text-2xl font-black">No products found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search or category.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground font-bold mb-6">
              Showing <span className="text-foreground">{filtered.length}</span> products
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Card
                    onClick={() => product.slug ? router.push(`/shop/${product.slug}`) : toast.error("No detail page yet")}
                    className="group cursor-pointer rounded-3xl border border-border/50 bg-card overflow-hidden hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <Image
                        src={product.images?.[0] || product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {product.stock === 0 && (
                          <span className="px-2.5 py-1 bg-red-500 text-white text-[9px] font-black uppercase rounded-full">Out of Stock</span>
                        )}
                        {product.stock > 0 && product.stock < 10 && (
                          <span className="px-2.5 py-1 bg-amber-500 text-white text-[9px] font-black uppercase rounded-full">Only {product.stock} left</span>
                        )}
                      </div>
                      {/* Category tag */}
                      <div className="absolute bottom-3 right-3">
                        <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-[9px] font-black uppercase rounded-full tracking-widest">
                          {product.category}
                        </span>
                      </div>
                      {/* Quick add overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={product.stock === 0}
                          className="w-full py-3 rounded-xl bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
                        >
                          {product.stock === 0 ? "Out of Stock" : "Quick Add"}
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col gap-3 flex-1">
                      <div className="flex-1">
                        <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <div>
                          <p className="text-xl font-black text-primary">₦{product.price.toLocaleString()}</p>
                          {product.vendorId?.businessName && (
                            <p className="text-[10px] text-muted-foreground font-bold mt-0.5 flex items-center gap-1">
                              <Store size={9} /> {product.vendorId.businessName}
                            </p>
                          )}
                        </div>
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ─── Order Tracking Banner ─────────────────────────────── */}
      <section className="container mx-auto px-4 pb-10">
        <div className="rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Truck size={28} />
            </div>
            <div>
              <h3 className="font-black text-lg tracking-tight">Track Your Order</h3>
              <p className="text-sm text-muted-foreground">Enter your order ID to see delivery status</p>
            </div>
          </div>
          <Link href="/shop/track-order" className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-black hover:bg-primary/90 transition-colors">
            Track Order →
          </Link>
        </div>
      </section>

      {/* ─── Contact / Info Footer ────────────────────────────── */}
      <section className="border-t border-border/50 bg-card/50">
        <div className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h4 className="font-black text-sm uppercase tracking-widest mb-4 text-primary">Contact Us</h4>
            <div className="space-y-3">
              {[
                { icon: Phone, text: "+234 800 000 0000" },
                { icon: Mail, text: "shop@lifeline.org.ng" },
                { icon: MapPin, text: "Lagos, Nigeria" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                  <item.icon size={14} className="text-primary flex-shrink-0" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-black text-sm uppercase tracking-widest mb-4 text-primary">Shop Info</h4>
            <div className="space-y-2 text-sm text-muted-foreground font-medium">
              <p>Free shipping on orders above ₦20,000</p>
              <p>Delivery within 3–5 working days</p>
              <p>Secure payment via Paystack</p>
              <p>Returns accepted within 7 days</p>
            </div>
          </div>

          <div>
            <h4 className="font-black text-sm uppercase tracking-widest mb-4 text-primary">Our Mission</h4>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              100% of profits from the LifeLine Shop go directly toward funding rural healthcare clinics, clean water, and educational programmes across Nigeria.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
