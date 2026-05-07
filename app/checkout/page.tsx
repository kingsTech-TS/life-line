"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
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

  const handleCompleteOrder = async () => {
    if (!formData.name || !formData.email || !formData.address) {
      toast.error("Please fill in all details including address");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Initialize on server
      const initRes = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice,
          email: formData.email,
          donorName: formData.name,
          paymentSource: "shop",
          productName: cartItems.map((i) => i.name).join(", "),
          isAnonymous: false,
          items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            variants: item.variants,
            vendorId: (item as any).vendorId
          })),
          deliveryAddress: formData.address,
        }),
      });

      const initData = await initRes.json();

      if (!initData.success) {
        throw new Error(initData.error || "Failed to initialize payment");
      }

      // Step 2: Open Paystack popup directly
      if (!(window as any).PaystackPop) {
        toast.error("Payment system not loaded. Please refresh.");
        setIsProcessing(false);
        return;
      }

      const handler = (window as any).PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
        email: formData.email,
        amount: totalPrice * 100, // Kobo
        reference: initData.reference,
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: formData.name,
            },
            {
              display_name: "Payment Source",
              variable_name: "payment_source",
              value: "shop",
            },
          ],
        },
        callback: (response: any) => {
          clearCart(); // Clear cart after successful payment
          router.push(`/donate/success?reference=${response.reference}`);
        },
        onClose: () => {
          setIsProcessing(false);
          toast.info("Payment cancelled");
        },
      });

      handler.openIframe();
    } catch (err: any) {
      console.error("[Checkout] Error:", err);
      toast.error(err.message || "An error occurred. Please try again.");
      setIsProcessing(false);
    }
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
                disabled={isProcessing}
                className="w-full bg-primary text-white rounded p-3 mt-4 hover:opacity-90 transition-opacity font-bold flex items-center justify-center disabled:opacity-70"
                onClick={handleCompleteOrder}
              >
                {isProcessing ? (
                  <><Loader2 className="animate-spin mr-2" size={20} /> Processing...</>
                ) : (
                  `Complete Order (₦${totalPrice.toLocaleString()})`
                )}
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

    </div>
  );
}
