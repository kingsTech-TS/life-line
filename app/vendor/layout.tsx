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
  ChevronRight,
  Settings,
  Bell
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
  const [vendor, setVendor] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = pathname === "/vendor/login" || pathname === "/vendor/signup";

  useEffect(() => {
    if (isAuthPage) return;
    const fetchVendor = async () => {
      try {
        const res = await fetch("/api/vendor/me");
        const data = await res.json();
        if (data.vendor) setVendor(data.vendor);
      } catch (err) {}
    };

    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/vendor/notifications");
        const data = await res.json();
        if (Array.isArray(data)) setNotifications(data);
      } catch (err) {}
    };

    fetchVendor();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Fetch every minute
    return () => clearInterval(interval);
  }, [isAuthPage]);

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/vendor/notifications", {
        method: "PATCH",
        body: JSON.stringify({ notificationId: id })
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {}
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/vendor/notifications", {
        method: "PATCH",
        body: JSON.stringify({ allRead: true })
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {}
  };

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
          <div className="h-full flex flex-col p-6">
            <div className="mb-12 px-2 flex items-center justify-between">
              <Link href="/vendor/dashboard" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-primary rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                  <Store className="text-white" size={22} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tighter">
                    Vendor Hub
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-primary/70">
                    LifeLine Shop
                  </span>
                </div>
              </Link>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 rounded-xl bg-muted/50 text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 space-y-1.5 px-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-4 px-2">Menu</p>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`
                      relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                      ${
                        isActive
                          ? "bg-primary text-white shadow-lg shadow-primary/20"
                          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      }
                    `}
                  >
                    <item.icon
                      size={20}
                      strokeWidth={isActive ? 2.5 : 2}
                      className={isActive ? "" : "group-hover:scale-110 transition-transform duration-300"}
                    />
                    <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    {isActive && (
                      <motion.div layoutId="vendor-active" className="absolute left-0 w-1 h-8 bg-white rounded-r-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto pt-6 border-t border-border/50 px-2 space-y-2">
               <button
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-all duration-300 font-bold text-sm tracking-tight group"
              >
                <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all duration-300 font-bold text-sm tracking-tight"
              >
                <LogOut size={20} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
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
            
            <div className="flex items-center gap-3">
              {/* Notification System */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className={`p-2.5 rounded-xl border border-border/50 shadow-sm transition-all relative ${
                    isNotificationsOpen ? "bg-primary text-white" : "bg-card hover:bg-muted"
                  }`}
                >
                  <Bell size={18} className={isNotificationsOpen ? "text-white" : "text-muted-foreground"} />
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-card animate-pulse" />
                  )}
                </button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 lg:hidden"
                        onClick={() => setIsNotificationsOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="fixed inset-x-4 top-20 md:absolute md:inset-auto md:right-0 md:mt-3 md:w-96 bg-card/95 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-[2rem] md:rounded-3xl z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-border/50 flex items-center justify-between">
                          <h3 className="font-black text-sm uppercase tracking-widest">Notifications</h3>
                          <button
                            onClick={markAllAsRead}
                            className="text-[10px] font-black uppercase text-primary hover:underline"
                          >
                            Mark all as read
                          </button>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto p-2 space-y-1">
                          {notifications.length === 0 ? (
                            <div className="py-10 text-center text-muted-foreground italic text-xs">
                              No notifications yet
                            </div>
                          ) : (
                            notifications.map((n) => (
                              <div
                                key={n._id}
                                onClick={() => markAsRead(n._id)}
                                className={`p-4 rounded-2xl transition-all cursor-pointer border border-transparent ${
                                  n.isRead ? "opacity-60" : "bg-muted/50 border-border/30"
                                } hover:bg-muted`}
                              >
                                <div className="flex gap-3">
                                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                                    n.type === 'order' ? "bg-blue-500" :
                                    n.type === 'stock' ? "bg-amber-500" :
                                    n.type === 'payment' ? "bg-emerald-500" : "bg-primary"
                                  }`} />
                                  <div className="space-y-1">
                                    <p className="text-xs font-black leading-none">{n.title}</p>
                                    <p className="text-[11px] text-muted-foreground leading-snug">{n.message}</p>
                                    <p className="text-[9px] text-muted-foreground/50 font-medium">
                                      {new Date(n.createdAt).toLocaleDateString()} · {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        {notifications.length > 0 && (
                          <Link
                            href="/vendor/dashboard"
                            onClick={() => setIsNotificationsOpen(false)}
                            className="block p-4 bg-muted/30 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors border-t border-border/50"
                          >
                            View All Activity
                          </Link>
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-border/50">
                <div className="flex flex-col text-right hidden sm:flex">
                  <span className="text-sm font-black text-foreground leading-none">{vendor?.businessName || "Loading..."}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Vendor Account</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary/60 shadow-md flex items-center justify-center text-white font-black text-sm border-2 border-background uppercase">
                  {vendor?.businessName ? vendor.businessName.substring(0, 2) : "VH"}
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
