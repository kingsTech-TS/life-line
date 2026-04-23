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
  User,
  Store,
  Settings
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isAdminLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isAdminLogin) return;
    const fetchAdmin = async () => {
      try {
        const res = await fetch("/api/admin/me");
        const data = await res.json();
        if (data.admin) setAdmin(data.admin);
      } catch (err) {}
    };
    fetchAdmin();
  }, [isAdminLogin]);

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
    { href: "/admin/vendors", label: "Vendors", icon: Store },
    { href: "/admin/ambassadors", label: "Ambassadors", icon: User },
  ];

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#060608] text-foreground font-sans">
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
          fixed inset-y-0 left-0 z-50 w-72 bg-card/80 backdrop-blur-3xl border-r border-border/40 transform transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 flex flex-col shadow-2xl lg:shadow-none
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          <div className="h-full flex flex-col py-6 px-4">
            <div className="mb-10 px-2 flex items-center justify-between">
              <Link href="/admin/dashboard" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-primary rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                  <Image
                    src="/logo/logo.png"
                    alt="L"
                    width={24}
                    height={24}
                    className="brightness-0 invert"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tighter">
                    LifeLine
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-primary/70">
                    Admin Panel
                  </span>
                </div>
              </Link>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 rounded-xl bg-muted/50 text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide px-2 space-y-1.5 pb-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-4 px-2">Main Menu</p>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`
                      relative flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group
                      ${
                        isActive
                          ? "bg-primary text-white shadow-lg shadow-primary/20"
                          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon
                        size={20}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={isActive ? "" : "group-hover:scale-110 transition-transform duration-300"}
                      />
                      <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    </div>
                    {isActive && (
                      <motion.div layoutId="admin-active" className="absolute left-0 w-1 h-8 bg-white rounded-r-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto pt-6 border-t border-border/50 px-4 space-y-4">
               <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">System Health</p>
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <div className="w-full h-1.5 bg-primary/10 rounded-full overflow-hidden">
                  <div className="w-[98%] h-full bg-primary" />
                </div>
                <p className="text-[10px] font-bold text-muted-foreground mt-2">All systems operational</p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 font-bold text-sm tracking-tight"
              >
                <LogOut size={18} strokeWidth={2.5} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
          <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-xl border-b border-border/40 lg:px-10 lg:py-5">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2.5 rounded-xl bg-card border border-border/50 shadow-sm hover:bg-muted transition-colors"
              >
                <Menu size={20} />
              </button>
              <h2 className="hidden lg:block text-lg font-black tracking-tight text-foreground capitalize">
                {pathname.split("/").pop()?.replace("-", " ") || "Dashboard"}
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center bg-card border border-border/50 rounded-full px-4 py-2 shadow-sm">
                <Search size={16} className="text-muted-foreground mr-2" />
                <input type="text" placeholder="Search admin..." className="bg-transparent border-none outline-none text-sm w-48 focus:w-64 transition-all duration-300 placeholder:text-muted-foreground font-medium" />
              </div>
              <button className="p-2.5 rounded-xl bg-card border border-border/50 shadow-sm hover:bg-muted transition-colors relative">
                <Bell size={18} className="text-muted-foreground" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 ring-card" />
              </button>
              <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-border/50">
                <div className="flex flex-col text-right hidden sm:flex">
                  <span className="text-sm font-black text-foreground leading-none">{admin?.username || "Loading..."}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">System Admin</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-zinc-800 to-zinc-600 shadow-md flex items-center justify-center text-white font-black text-sm border-2 border-background uppercase">
                  {admin?.username ? admin.username.substring(0, 2) : "AD"}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
