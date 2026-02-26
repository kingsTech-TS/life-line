"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "react-toastify";
import { useCart } from "@/context/CartContext";
export default function Shop() {
  const [shopProducts, setShopProducts] = useState<any[]>([]);
  const router = useRouter();
  const { setIsCartOpen, totalItems } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/inventory");
        const data = await response.json();
        setShopProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (product: any) => {
    if (product.slug) {
      router.push(`/shop/${product.slug}`);
    } else {
      toast.error("This product details page is not available yet.");
    }
  };

  return (
    <main className="min-h-screen bg-muted/20 pb-20">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b border-border/50"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] rounded-full mb-6"
            >
              Shop for a Cause
            </motion.span>
            <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6 leading-tight tracking-tighter">
              LifeLine <span className="text-primary">Shop</span>
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              Every purchase directly supports our rural healthcare initiatives.
              High-quality products, meaningful impact.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-2">
                Available Items
              </h2>
              <div className="h-1.5 w-16 bg-primary rounded-full" />
            </div>

            <Button
              onClick={() => setIsCartOpen(true)}
              variant="outline"
              className="group relative px-6 h-14 rounded-2xl border-2 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
            >
              <ShoppingCart className="mr-3 group-hover:scale-110 transition-transform" />
              <span className="font-bold">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-3 -right-3 h-8 w-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-black ring-4 ring-background animate-in zoom-in duration-300">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {shopProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card
                  onClick={() => handleProductClick(product)}
                  className="group cursor-pointer overflow-hidden rounded-[2rem] border-none bg-background shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <Image
                      src={
                        product.images?.[0] ||
                        product.image ||
                        "/placeholder.svg"
                      }
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <span className="px-6 py-2.5 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        View Details
                      </span>
                    </div>
                    {product.stock < 10 && product.stock > 0 && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white text-[10px] font-black uppercase rounded-full">
                        Only {product.stock} Left
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase rounded-full">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">
                        {product.category}
                      </p>
                      <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-foreground/50 line-clamp-2 leading-relaxed mb-6">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-border/50">
                      <span className="text-2xl font-black text-foreground">
                        ₦{product.price.toLocaleString()}
                      </span>
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <Plus size={20} />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
