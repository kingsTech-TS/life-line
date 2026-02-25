"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import CartDrawer from "@/components/cart-drawer";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Shop() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [shopProducts, setShopProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string;
  }>({});

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

  const addToCart = (product: any, variants: any) => {
    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image,
      variants,
    };
    setCartItems((prev) => [...prev, cartItem]);
    setSelectedProduct(null);
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index === -1) return prev;
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
    // Initialize variant selection with first option of each variant
    const initialVariants: { [key: string]: string } = {};
    product.variants?.forEach((v: any) => {
      if (v.options?.length > 0) {
        initialVariants[v.type] = v.options[0];
      }
    });
    setSelectedVariants(initialVariants);
  };

  return (
    <main className="min-h-screen bg-muted/20 pb-20">
      <CartDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={cartItems}
        products={shopProducts}
        onRemove={removeItem}
      />

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
              onClick={() => setDrawerOpen(true)}
              variant="outline"
              className="group relative px-6 h-14 rounded-2xl border-2 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
            >
              <ShoppingCart className="mr-3 group-hover:scale-110 transition-transform" />
              <span className="font-bold">Cart</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-3 -right-3 h-8 w-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-black ring-4 ring-background animate-in zoom-in duration-300">
                  {cartItems.length}
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
                        Quick View
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

      {/* Product Details Dialog */}
      <Dialog
        open={!!selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
      >
        <DialogContent className="max-w-5xl p-0 overflow-hidden border-none rounded-[3rem] shadow-2xl">
          {selectedProduct && (
            <div className="flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh]">
              {/* Image Gallery */}
              <div className="w-full md:w-1/2 bg-muted relative group/gallery">
                <div className="relative aspect-square md:h-full w-full">
                  <Image
                    src={
                      selectedProduct.images?.[activeImageIndex] ||
                      selectedProduct.image ||
                      "/placeholder.svg"
                    }
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                  />

                  {/* Nav Buttons */}
                  {selectedProduct.images?.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setActiveImageIndex((prev) =>
                            prev === 0
                              ? selectedProduct.images.length - 1
                              : prev - 1,
                          )
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover/gallery:opacity-100 transition-all hover:bg-white hover:text-black"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={() =>
                          setActiveImageIndex((prev) =>
                            prev === selectedProduct.images.length - 1
                              ? 0
                              : prev + 1,
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover/gallery:opacity-100 transition-all hover:bg-white hover:text-black"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {selectedProduct.images?.length > 1 && (
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 px-6">
                    {selectedProduct.images.map((img: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setActiveImageIndex(i)}
                        className={`relative h-14 w-14 rounded-xl overflow-hidden border-2 transition-all ${
                          i === activeImageIndex
                            ? "border-white scale-110 shadow-lg"
                            : "border-transparent opacity-50 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={img}
                          alt="Thumbnail"
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="w-full md:w-1/2 p-10 md:p-14 overflow-y-auto bg-background flex flex-col">
                <div className="flex-1">
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="md:hidden absolute top-4 right-4 h-10 w-10 rounded-full bg-muted flex items-center justify-center"
                  >
                    <X size={20} />
                  </button>

                  <p className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4">
                    {selectedProduct.category}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-black text-foreground mb-6 leading-tight">
                    {selectedProduct.name}
                  </h2>
                  <div className="text-4xl font-black text-primary mb-10">
                    ₦{selectedProduct.price.toLocaleString()}
                  </div>

                  <div className="space-y-10">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-4">
                        Description
                      </h4>
                      <p className="text-foreground/70 leading-relaxed">
                        {selectedProduct.description}
                      </p>
                    </div>

                    {/* Variants */}
                    {selectedProduct.variants?.map((v: any, i: number) => (
                      <div key={i}>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-4">
                          Select {v.type}
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {v.options.map((opt: string, j: number) => (
                            <button
                              key={j}
                              onClick={() =>
                                setSelectedVariants((prev) => ({
                                  ...prev,
                                  [v.type]: opt,
                                }))
                              }
                              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                                selectedVariants[v.type] === opt
                                  ? "bg-black text-white scale-105 shadow-xl shadow-black/20"
                                  : "bg-muted text-foreground/60 hover:bg-muted/80"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-10 mt-10 border-t border-border flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => addToCart(selectedProduct, selectedVariants)}
                    disabled={selectedProduct.stock === 0}
                    className="flex-1 h-16 rounded-[1.25rem] bg-primary text-white hover:bg-primary/90 text-lg font-black transition-all hover:scale-[1.02] shadow-xl shadow-primary/20"
                  >
                    {selectedProduct.stock === 0
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </Button>
                </div>

                <p className="text-[10px] font-bold text-foreground/30 text-center mt-6 italic flex items-center justify-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-primary/30" />
                  Your purchase funds healthcare for those in need
                  <div className="h-1 w-1 rounded-full bg-primary/30" />
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
