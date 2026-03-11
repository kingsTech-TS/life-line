"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { CreditCard, Loader2, Heart, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Amount in Naira */
  amount: number;
  /** Optional: override label shown in the modal */
  title?: string;
  /** Optional: subtitle / item name */
  subtitle?: string;
  paymentSource: "donation" | "project" | "shop";
  projectId?: string;
  productName?: string;
  donationType?: "one-time" | "recurring";
}

export default function PaymentModal({
  open,
  onOpenChange,
  amount,
  title = "Complete Payment",
  subtitle,
  paymentSource,
  projectId,
  productName,
  donationType = "one-time",
}: PaymentModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Please enter your name and email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Initialize on server → creates pending record in DB
      const initRes = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          email,
          donorName: name,
          donationType,
          projectId,
          paymentSource,
          productName,
          isAnonymous: false,
        }),
      });

      const initData = await initRes.json();

      if (!initData.success) {
        throw new Error(initData.error || "Failed to initialize payment");
      }

      // Step 2: Open Paystack popup
      if (!(window as any).PaystackPop) {
        toast.error("Payment system not loaded. Please refresh.");
        setIsProcessing(false);
        return;
      }

      const handler = (window as any).PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
        email,
        amount: amount * 100, // Kobo
        reference: initData.reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Donor Name",
              variable_name: "donor_name",
              value: name,
            },
            {
              display_name: "Payment Source",
              variable_name: "payment_source",
              value: paymentSource,
            },
          ],
        },
        callback: (response: any) => {
          // Close modal and redirect to success page for verification
          onOpenChange(false);
          router.push(`/donate/success?reference=${response.reference}`);
        },
        onClose: () => {
          setIsProcessing(false);
          toast.info("Payment cancelled");
        },
      });

      handler.openIframe();
    } catch (err: any) {
      console.error("[PaymentModal] Error:", err);
      toast.error(err.message || "An error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!isProcessing) onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl">
        <div className="flex flex-col">
          {/* Header */}
          <div className="p-8 pb-6 bg-primary/5">
            <DialogHeader>
              <div className="flex justify-between items-start">
                <div>
                  <DialogTitle className="text-2xl font-black tracking-tight">
                    {title}
                  </DialogTitle>
                  {subtitle && (
                    <p className="text-foreground/50 text-sm mt-1 font-medium">
                      {subtitle}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (!isProcessing) onOpenChange(false);
                  }}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-6">
            {/* Amount display */}
            <div className="text-center p-5 bg-primary/5 rounded-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">
                Amount
              </p>
              <p className="text-4xl font-black text-primary tracking-tighter">
                ₦{amount.toLocaleString()}
              </p>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40">
                  Full Name
                </label>
                <Input
                  placeholder="e.g. Amaka Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="e.g. amaka@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary font-bold"
                />
              </div>
            </div>

            <Button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-base shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-3"
            >
              {isProcessing ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <CreditCard size={20} />
                  Pay ₦{amount.toLocaleString()} via Paystack
                </>
              )}
            </Button>

            <p className="text-center text-[11px] text-foreground/30 font-medium flex items-center justify-center gap-1.5">
              <Heart size={11} className="text-primary" />
              Secured by Paystack · Your payment is safe
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
