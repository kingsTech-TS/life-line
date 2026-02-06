"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import Image from "next/image";
import { motion } from "framer-motion";
import { Lock, User, Loader2, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Login successful!");
        router.push("/admin/dashboard");
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a] relative overflow-hidden p-6 font-sans">
      {/* Soft Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8 flex justify-center"
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
              Admin Access
            </h1>
            <p className="text-muted-foreground font-medium text-sm">
              Please enter your credentials to manage the platform.
            </p>
          </motion.div>
        </div>

        <Card className="p-8 md:p-10 rounded-[3rem] border border-border shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] bg-white/70 backdrop-blur-3xl dark:bg-zinc-900/50">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">
                Identifier
              </label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <User size={18} />
                </div>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin_username"
                  required
                  className="rounded-2xl bg-muted/20 border-border/50 focus:border-primary/50 focus:ring-primary/10 h-14 pl-14 text-base font-medium transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">
                Security Key
              </label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="rounded-2xl bg-muted/20 border-border/50 focus:border-primary/50 focus:ring-primary/10 h-14 pl-14 text-base font-medium transition-all duration-300"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-2xl h-16 text-lg font-black shadow-2xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all duration-500 gap-3 mt-4 bg-primary hover:bg-primary/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Connect Now
                  <ArrowRight className="h-6 w-6" />
                </>
              )}
            </Button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-border/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <ShieldCheck size={14} className="text-primary" />
              Secure Administration Environment
            </div>
          </motion.div>
        </Card>

        <p className="mt-8 text-center text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} LifeLine Foundation
        </p>
      </motion.div>
    </main>
  );
}
