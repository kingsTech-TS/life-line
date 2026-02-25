"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

export default function CartDrawer({
  open,
  onClose,
  items,
  products,
  onRemove,
}: any) {
  const total = items.reduce((sum: number, item: any) => {
    return sum + (item.price || 0);
  }, 0);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: open ? "0%" : "100%" }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 right-0 w-full max-w-md h-full bg-background shadow-2xl z-[70] flex flex-col border-l border-border"
      >
        <div className="p-8 border-b border-border flex justify-between items-center bg-muted/20">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Your Cart</h2>
            <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest mt-1">
              {items.length} {items.length === 1 ? "Item" : "Items"} selected
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
              <X size={64} className="mb-4" />
              <p className="text-xl font-bold italic">Your cart is empty</p>
            </div>
          ) : (
            items.map((item: any, index: number) => {
              return (
                <div
                  key={index}
                  className="group relative bg-muted/30 rounded-3xl p-4 flex gap-4 border border-transparent hover:border-primary/20 transition-all"
                >
                  <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-background shadow-sm">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-sm line-clamp-1 mb-1">
                      {item.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {item.variants &&
                        Object.entries(item.variants).map(
                          ([key, val]: [string, any]) => (
                            <span
                              key={key}
                              className="px-2 py-0.5 bg-background border border-border rounded-md text-[10px] font-bold text-foreground/60"
                            >
                              {key}: {val}
                            </span>
                          ),
                        )}
                    </div>
                    <p className="font-black text-primary">
                      ₦{item.price.toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => onRemove(item.id)}
                    className="absolute -top-2 -right-2 h-8 w-8 bg-white border border-border shadow-md rounded-full flex items-center justify-center text-foreground/40 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="p-8 bg-muted/10 border-t border-border space-y-6">
          <div className="flex justify-between items-end">
            <span className="text-sm font-black uppercase tracking-widest text-foreground/40">
              Subtotal
            </span>
            <span className="text-3xl font-black text-foreground">
              ₦{total.toLocaleString()}
            </span>
          </div>

          <Button
            className="w-full h-16 rounded-2xl bg-primary text-white hover:bg-primary/90 font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
            asChild
          >
            <a href="/checkout">Checkout Now</a>
          </Button>

          <button
            onClick={onClose}
            className="w-full text-xs font-black uppercase tracking-[0.2em] text-foreground/30 hover:text-primary transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </motion.div>
    </>
  );
}
