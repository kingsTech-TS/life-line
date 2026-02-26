"use client";

import { useCart } from "@/context/CartContext";
import CartDrawer from "./cart-drawer";

export default function GlobalCartWrapper() {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart } = useCart();

  return (
    <CartDrawer
      open={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      items={cartItems}
      onRemove={(id: string, variants: any) => removeFromCart(id, variants)}
    />
  );
}
