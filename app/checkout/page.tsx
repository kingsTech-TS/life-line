"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import PaymentModal from "@/components/PaymentModal";
import { toast } from "react-toastify";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, totalPrice, clearCart } = useCart();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  const handleCompleteOrder = () => {
    if (!formData.name || !formData.email || !formData.address) {
      toast.error("Please fill in all details including address");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen py-20 container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>

            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <input
                  className="w-full border rounded p-2 bg-background"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <input
                  className="w-full border rounded p-2 bg-background"
                  placeholder="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Delivery Address</label>
                <textarea
                  className="w-full border rounded p-2 bg-background"
                  placeholder="Delivery Address"
                  rows={3}
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>

              <button
                type="button"
                className="w-full bg-primary text-white rounded p-3 mt-4 hover:opacity-90 transition-opacity font-bold"
                onClick={handleCompleteOrder}
              >
                Complete Order (₦{totalPrice.toLocaleString()})
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id + JSON.stringify(item.variants)}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex gap-2">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground">
                      x{item.quantity}
                    </span>
                  </div>
                  <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t pt-4 flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span>₦{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        amount={totalPrice}
        title="Payment for Order"
        subtitle={`${cartItems.length} items from LifeLine Shop`}
        paymentSource="shop"
        productName={cartItems.map((i) => i.name).join(", ")}
        items={cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          variants: item.variants,
          vendorId: (item as any).vendorId // Ensure vendorId is passed from cart
        }))}
        deliveryAddress={formData.address}
      />
    </div>
  );
}
