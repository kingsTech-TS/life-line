"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  variants: { [key: string]: string };
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, variants: { [key: string]: string }) => void;
  removeFromCart: (id: string, variants: { [key: string]: string }) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("lifeline_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from local storage");
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("lifeline_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: any, variants: { [key: string]: string }) => {
    setCartItems((prev) => {
      // Check if item with same ID and variants already exists
      const existingItemIndex = prev.findIndex(
        (item) =>
          item.id === product._id &&
          JSON.stringify(item.variants) === JSON.stringify(variants),
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prev];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      }

      return [
        ...prev,
        {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || product.image,
          variants,
          quantity: 1,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string, variants: { [key: string]: string }) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === id &&
            JSON.stringify(item.variants) === JSON.stringify(variants)
          ),
      ),
    );
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
