"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  Store,
  CreditCard,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = pathname === "/vendor/login" || pathname === "/vendor/signup";

  if (isAuthPage) {
    return <>{children}</>;
  }

  const navItems = [
    { href: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/vendor/products", label: "My Products", icon: ShoppingBag },
    { href: "/vendor/purchases", label: "Sales & Orders", icon: CreditCard },
  ];

  const handleLogout = async () => {
    await fetch("/api/vendor/logout", { method: "POST" });
    router.push("/vendor/login");
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-foreground">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-card/50 backdrop-blur-2xl border-r border-border/50 transform transition-all duration-300 ease-in-out
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          <div className="h-full flex flex-col p-6">
            <div className="mb-10 px-4">
              <Link href="/vendor/dashboard" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <Store className="text-white" size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold tracking-tight">
                    Vendor Hub
                  </span>
                  <span className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                    LifeLine Shop
                  </span>
                </div>
              </Link>
            </div>

            <nav className="flex-1 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group
                      ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }
                    `}
                  >
                    <item.icon
                      size={20}
                      className={isActive ? "" : "group-hover:scale-110 transition-transform"}
                    />
                    <span className="font-bold text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={handleLogout}
              className="mt-auto flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all duration-200 font-bold text-sm"
            >
              <LogOut size={20} />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-background/50 backdrop-blur-xl border-b border-border/50 lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl bg-card border border-border/50"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Store className="text-white" size={16} />
              </div>
              <span className="font-black text-xs uppercase tracking-tighter">
                Vendor Hub
              </span>
            </div>
          </header>

          <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
