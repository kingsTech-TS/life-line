"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import Image from "next/image";
import { motion } from "framer-motion";
import { Lock, Mail, Loader2, ArrowRight, Store, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function VendorSignup() {
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/vendor/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Vendor account created!");
        router.push("/vendor/dashboard");
      } else {
        toast.error(data.error || "Signup failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a] relative overflow-hidden p-6 font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[480px] relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6 flex justify-center"
          >
            <Image
              src="/logo/logo.png"
              alt="LifeLine Logo"
              width={180}
              height={60}
              className="h-16 w-auto"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl font-black text-foreground tracking-tight mb-3">
              Become a Vendor
            </h1>
            <p className="text-muted-foreground font-medium text-sm">
              Register your business and start selling on LifeLine.
            </p>
          </motion.div>
        </div>

        <Card className="p-8 md:p-10 rounded-[3rem] border border-border shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] bg-white/70 backdrop-blur-3xl dark:bg-zinc-900/50">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">
                  Business Name
                </label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Store size={18} />
                  </div>
                  <Input
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Global Health Solutions"
                    className="pl-12 h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Mail size={18} />
                  </div>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contact@business.com"
                    className="pl-12 h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">
                    Phone
                  </label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Phone size={18} />
                    </div>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+234..."
                      className="pl-12 h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                      <Lock size={18} />
                    </div>
                    <Input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="┬╖┬╖┬╖┬╖┬╖┬╖┬╖┬╖"
                      className="pl-12 h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">
                  Address
                </label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <MapPin size={18} />
                  </div>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Business Headquarters Address"
                    className="pl-12 h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-[0.15em] shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group mt-4"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Register Business
                  <ArrowRight
                    size={18}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </Button>

            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground font-medium">
                Already have a vendor account?{" "}
                <Link
                  href="/vendor/login"
                  className="text-primary hover:underline font-black"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </motion.div>
    </main>
  );
}
