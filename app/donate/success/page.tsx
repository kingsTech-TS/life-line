"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Heart,
  ArrowRight,
  User,
  Mail,
  CalendarClock,
  CreditCard,
  Hash,
} from "lucide-react";
import { Button } from "../../../components/ui/button";

// ── types ─────────────────────────────────────────────────────────────────────
interface DonationData {
  donorName?: string;
  donorEmail?: string;
  amount?: number;
  paymentReference?: string;
  paymentMethod?: string;
  donationType?: string;
  createdAt?: string;
  paymentDetails?: any;
}

// ── tiny helper ───────────────────────────────────────────────────────────────
function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/30 last:border-0">
      <span className="text-foreground/30 shrink-0">{icon}</span>
      <span className="text-xs font-black uppercase tracking-widest text-foreground/30 w-20 shrink-0">
        {label}
      </span>
      <span className="text-sm font-bold text-foreground text-right flex-1 break-all">
        {value}
      </span>
    </div>
  );
}

// ── main content ──────────────────────────────────────────────────────────────
function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const [state, setState] = useState<"verifying" | "success" | "declined">(
    "verifying",
  );
  const [donation, setDonation] = useState<DonationData | null>(null);
  const [failMessage, setFailMessage] = useState("");

  useEffect(() => {
    if (!reference) {
      setState("declined");
      setFailMessage("No payment reference found.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          `/api/payments/verify?reference=${encodeURIComponent(reference)}`,
        );
        const json = await res.json();

        console.log("[Success page] verify response:", json);

        if (json.success === true && json.donation) {
          setDonation(json.donation);
          setState("success");
        } else {
          setFailMessage(json.message || "Your payment could not be verified.");
          setState("declined");
        }
      } catch (err) {
        console.error("[Success page] fetch error:", err);
        setFailMessage("A network error occurred. Please contact support.");
        setState("declined");
      }
    };

    verify();
  }, [reference]);

  // ── verifying ──────────────────────────────────────────────────────────────
  if (state === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 px-4">
        <div className="text-center space-y-6 max-w-sm">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground">
              Verifying Payment
            </h1>
            <p className="text-foreground/50 mt-2 text-sm">
              Checking your transaction with Paystack. This only takes a moment…
            </p>
          </div>
          <div className="flex items-center gap-2 justify-center">
            {[0, 150, 300].map((delay) => (
              <div
                key={delay}
                className="w-2 h-2 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── declined ───────────────────────────────────────────────────────────────
  if (state === "declined") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50/30 to-background px-4 py-16">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-28 h-28 rounded-full bg-red-500/10 ring-4 ring-red-500/20 flex items-center justify-center mx-auto">
            <XCircle className="w-14 h-14 text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-foreground">
              Payment Declined
            </h1>
            <p className="text-foreground/50 mt-3 leading-relaxed">
              {failMessage ||
                "Your payment could not be confirmed. No funds have been deducted."}
            </p>
          </div>

          {reference && (
            <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-5 text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-1">
                Reference
              </p>
              <p className="font-mono text-sm text-foreground/60 break-all">
                {reference}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Link href="/donate" className="flex-1">
              <Button className="w-full h-13 rounded-2xl font-bold bg-primary hover:bg-primary/90">
                Try Again
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button
                variant="outline"
                className="w-full h-13 rounded-2xl font-bold border-2"
              >
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── success ────────────────────────────────────────────────────────────────
  const displayAmount = donation?.amount ?? 0;
  const displayName = donation?.donorName ?? "—";
  const displayEmail = donation?.donorEmail ?? "—";
  const displayDate = donation?.createdAt
    ? new Date(donation.createdAt).toLocaleString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleString();
  const displayMethod = (() => {
    const m = donation?.paymentMethod ?? "";
    const last4 = donation?.paymentDetails?.authorization?.last4;
    const bank = donation?.paymentDetails?.authorization?.bank;
    if (!m) return "—";
    return `${m.charAt(0).toUpperCase() + m.slice(1)}${last4 ? ` •••• ${last4}` : ""}${bank ? ` — ${bank}` : ""}`;
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/40 to-background flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full space-y-6">
        {/* Icon + heading */}
        <div className="text-center space-y-4">
          <div className="w-28 h-28 rounded-full bg-green-500/10 ring-4 ring-green-500/20 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-14 h-14 text-green-600" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tight">
              Payment Successful!
            </h1>
            <p className="text-foreground/50 mt-2">
              Thank you for your generous contribution 🎉
            </p>
          </div>
        </div>

        {/* Receipt card */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-green-500/5 border border-green-100 overflow-hidden">
          {/* Coloured bar */}
          <div className="h-2 bg-gradient-to-r from-green-400 to-emerald-500" />

          <div className="p-8">
            {/* Big amount */}
            <div className="text-center mb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 mb-1">
                Amount Donated
              </p>
              <p className="text-5xl font-black text-green-600 tracking-tighter">
                ₦{displayAmount.toLocaleString()}
              </p>
              <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-500/10 text-green-600 ring-1 ring-green-600/20">
                <CheckCircle2 size={10} /> Successful
              </span>
            </div>

            <hr className="border-border/30 mb-4" />

            {/* Detail rows */}
            <DetailRow
              icon={<User size={14} />}
              label="Name"
              value={displayName}
            />
            <DetailRow
              icon={<Mail size={14} />}
              label="Email"
              value={displayEmail}
            />
            <DetailRow
              icon={<CalendarClock size={14} />}
              label="Date"
              value={displayDate}
            />
            {displayMethod !== "—" && (
              <DetailRow
                icon={<CreditCard size={14} />}
                label="Method"
                value={displayMethod}
              />
            )}
            <DetailRow
              icon={<Hash size={14} />}
              label="Reference"
              value={
                <span className="font-mono text-xs">
                  {donation?.paymentReference ?? reference ?? "—"}
                </span>
              }
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link href="/donate" className="flex-1">
            <Button
              variant="outline"
              className="w-full h-14 rounded-2xl font-bold border-2"
            >
              <Heart className="mr-2 w-4 h-4" /> Donate Again
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button className="w-full h-14 rounded-2xl font-bold bg-primary hover:bg-primary/90">
              Go Home <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────
export default function DonationSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
