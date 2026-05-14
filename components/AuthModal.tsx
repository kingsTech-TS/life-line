"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import {
  X,
  Mail,
  Lock,
  User,
  Loader2,
  ArrowRight,
  Heart,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, signup } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email: loginEmail, password: loginPassword });
      closeAuthModal();
      setLoginEmail("");
      setLoginPassword("");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (signupPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setIsLoading(true);
    try {
      await signup({ name: signupName, email: signupEmail, password: signupPassword });
      closeAuthModal();
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
    } catch (err: any) {
      toast.error(err.message || "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeAuthModal();
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: "rgba(7, 17, 42, 0.7)", backdropFilter: "blur(12px)" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[2rem] shadow-2xl"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              boxShadow: "0 32px 80px rgba(1,106,249,0.2), 0 0 0 1px rgba(1,106,249,0.08)",
            }}
          >
            {/* Blue glow top bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-blue-400 to-primary/60" />

            {/* Close button */}
            <button
              onClick={closeAuthModal}
              className="absolute top-5 right-5 z-10 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
            >
              <X size={18} />
            </button>

            <div className="p-8 pt-7">
              {/* Header */}
              <div className="text-center mb-7">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4 mx-auto">
                  <Heart className="w-7 h-7 text-primary fill-primary/20" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                  {tab === "login" ? "Welcome back" : "Join LifeLine"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1 font-medium">
                  {tab === "login"
                    ? "Sign in to add to cart and make purchases"
                    : "Create a free account to start shopping"}
                </p>
              </div>

              {/* Tab switcher */}
              <div className="flex rounded-xl bg-muted/60 p-1 mb-7">
                {(["login", "signup"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all duration-200 ${
                      tab === t
                        ? "bg-primary text-white shadow-lg shadow-primary/25"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t === "login" ? "Sign In" : "Sign Up"}
                  </button>
                ))}
              </div>

              {/* ── LOGIN FORM ── */}
              <AnimatePresence mode="wait">
                {tab === "login" && (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.18 }}
                    onSubmit={handleLogin}
                    className="space-y-4"
                  >
                    <div className="relative group">
                      <Mail
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                      />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="Email address"
                        required
                        className="w-full pl-11 pr-4 h-12 rounded-xl bg-muted/40 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground transition-all"
                      />
                    </div>

                    <div className="relative group">
                      <Lock
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="w-full pl-11 pr-12 h-12 rounded-xl bg-muted/40 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 rounded-xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {isLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <>
                          Sign In <ArrowRight size={16} />
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-muted-foreground pt-1">
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setTab("signup")}
                        className="text-primary font-black hover:underline"
                      >
                        Sign up free
                      </button>
                    </p>
                  </motion.form>
                )}

                {/* ── SIGNUP FORM ── */}
                {tab === "signup" && (
                  <motion.form
                    key="signup"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.18 }}
                    onSubmit={handleSignup}
                    className="space-y-4"
                  >
                    <div className="relative group">
                      <User
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                      />
                      <input
                        type="text"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="Full name"
                        required
                        className="w-full pl-11 pr-4 h-12 rounded-xl bg-muted/40 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground transition-all"
                      />
                    </div>

                    <div className="relative group">
                      <Mail
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                      />
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="Email address"
                        required
                        className="w-full pl-11 pr-4 h-12 rounded-xl bg-muted/40 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground transition-all"
                      />
                    </div>

                    <div className="relative group">
                      <Lock
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Create a password (min 6 chars)"
                        required
                        className="w-full pl-11 pr-12 h-12 rounded-xl bg-muted/40 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 rounded-xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {isLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <>
                          Create Account <ArrowRight size={16} />
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-muted-foreground pt-1">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setTab("login")}
                        className="text-primary font-black hover:underline"
                      >
                        Sign in
                      </button>
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Footer note */}
              <p className="text-center text-[10px] text-muted-foreground/60 mt-6 font-medium">
                By continuing, you agree to LifeLine&apos;s Terms of Service and Privacy Policy.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
