"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useAuth } from "./AuthContext";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  variants: { [key: string]: string };
  quantity: number;
  vendorId?: string;
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
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const isInitialMount = useRef(true);
  const isSyncingFromUser = useRef(false);

  // Load cart from user or localStorage on mount/login
  useEffect(() => {
    if (user) {
      // If user logs in, merge guest cart with user cart from DB
      isSyncingFromUser.current = true;
      const guestCart = localStorage.getItem("lifeline_cart");
      let itemsToSet = user.cart || [];

      if (guestCart) {
        try {
          const guestItems = JSON.parse(guestCart) as CartItem[];
          if (guestItems.length > 0) {
            const merged = [...itemsToSet];
            guestItems.forEach((gItem) => {
              const existingIndex = merged.findIndex(
                (mItem) =>
                  mItem.id === gItem.id &&
                  JSON.stringify(mItem.variants) ===
                    JSON.stringify(gItem.variants),
              );
              if (existingIndex > -1) {
                merged[existingIndex].quantity += gItem.quantity;
              } else {
                merged.push(gItem);
              }
            });
            itemsToSet = merged;
            // Clear guest cart after merging
            localStorage.removeItem("lifeline_cart");
          }
        } catch (e) {
          console.error("Failed to parse guest cart during merge");
        }
      }

      setCartItems(itemsToSet);
      setTimeout(() => {
        isSyncingFromUser.current = false;
      }, 0);
    } else {
      // Guest user: Load from localStorage
      const savedCart = localStorage.getItem("lifeline_cart");
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse cart from local storage");
        }
      }
    }
  }, [user]);

  // Save cart to database or localStorage on change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (isSyncingFromUser.current) return;

    if (user) {
      // Sync to database
      fetch("/api/auth/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: cartItems }),
      }).catch((err) => console.error("Failed to sync cart to DB", err));
    } else {
      // Save to localStorage for guest
      localStorage.setItem("lifeline_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

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
          vendorId: product.vendorId,
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
