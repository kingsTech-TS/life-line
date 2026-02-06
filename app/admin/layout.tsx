"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Heart,
  TrendingUp,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdminLogin = pathname === "/admin/login";

  if (isAdminLogin) {
    return <>{children}</>;
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/blog", label: "Blog Posts", icon: FileText },
    { href: "/admin/projects", label: "Projects", icon: Briefcase },
    { href: "/admin/donations", label: "Donations", icon: Heart },
    { href: "/admin/impact", label: "Impact", icon: TrendingUp },
    { href: "/admin/shop", label: "Inventory", icon: ShoppingBag },
  ];

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
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
              <Link href="/admin/dashboard" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <Image
                    src="/logo/logo.png"
                    alt="L"
                    width={24}
                    height={24}
                    className="brightness-0 invert p-1"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold tracking-tight">
                    LifeLine
                  </span>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                    Admin Panel
                  </span>
                </div>
              </Link>
            </div>

            <nav className="flex-1 space-y-1">
              <div className="px-4 mb-4">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                  Main Menu
                </p>
              </div>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`
                      group flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300
                      ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-xl shadow-primary/15 scale-[1.02]"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} />
                      {item.label}
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="w-1 h-1 bg-current rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto pt-6 space-y-4">
              <div className="px-4 py-4 rounded-3xl bg-primary/5 border border-primary/10">
                <p className="text-xs font-bold text-primary mb-1">
                  System Health
                </p>
                <div className="w-full h-1.5 bg-primary/10 rounded-full overflow-hidden">
                  <div className="w-[92%] h-full bg-primary" />
                </div>
                <p className="text-[10px] text-primary/60 mt-2">
                  All systems operational
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-bold text-destructive hover:bg-destructive/10 transition-all duration-300"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Mobile Toggle only - since user said navbar is not suppose to be there */}
          <div className="lg:hidden p-4 flex justify-between items-center bg-background border-b border-border/50 sticky top-0 z-30">
            <span className="font-bold text-sm tracking-tight">
              LifeLine Admin
            </span>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl bg-muted/50 hover:bg-muted"
            >
              <Menu size={20} />
            </button>
          </div>

          <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
