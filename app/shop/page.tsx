"use client";

import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import CartDrawer from "@/components/cart-drawer";

export default function Shop() {
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [shopProducts, setShopProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/inventory");
        const data = await response.json();
        const mappedProducts = data.map((item: any) => ({
          id: item._id, // Ensure ID handling is consistent (string vs number might be an issue if cart expects numbers)
          name: item.name,
          price: item.price,
          description: item.description,
          category: item.category,
        }));
        setShopProducts(mappedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Add item to cart
  const addToCart = (id: number) => {
    setCartItems((prev) => [...prev, id]);
  };

  // Remove a single item
  const removeItem = (id: number) => {
    setCartItems((prev) => {
      const index = prev.indexOf(id);
      if (index === -1) return prev;

      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  return (
    <main className="min-h-screen">
      {/* Cart Drawer */}
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
        className="py-14 md:py-20 bg-gradient-to-br from-primary/10 to-secondary/10"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              LifeLine Shop
            </h1>
            <p className="text-lg text-foreground/80">
              Purchase health products supporting rural healthcare.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Our Products</h2>

            <motion.button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 text-sm bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20"
            >
              <ShoppingCart size={20} />
              <span>{cartItems.length} items</span>
            </motion.button>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {shopProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-xl transition-all">
                  <div className="h-44 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <div className="text-6xl opacity-30">📦</div>
                  </div>

                  <div className="p-6 flex flex-col">
                    <div className="flex-1 mb-3">
                      <p className="text-xs font-semibold text-primary uppercase">
                        {product.category}
                      </p>
                      <h3 className="text-xl font-semibold">{product.name}</h3>
                      <p className="text-sm text-foreground/70">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="text-2xl font-bold text-primary">
                        ₦{product.price.toLocaleString()}
                      </span>

                      <Button size="sm" onClick={() => addToCart(product.id)}>
                        Add to Cart
                      </Button>
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
