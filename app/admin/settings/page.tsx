"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { 
  User, 
  Lock, 
  Mail, 
  Phone, 
  Loader2,
  ShieldCheck,
  Activity,
  UserCog
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSettings() {
  const [admin, setAdmin] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Profile Form
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    phone: "",
  });

  // Password Form
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/me");
        const data = await res.json();

        if (data.admin) {
          setAdmin(data.admin);
          setProfileData({
            username: data.admin.username || "",
            email: data.admin.email || "",
            phone: data.admin.phone || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Admin profile updated!");
        setAdmin(data.admin);
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Admin password updated!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight text-foreground">Admin Settings</h1>
        <p className="text-muted-foreground font-medium">Manage your administrator profile and security credentials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-10">
          <Card className="p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-border/50 bg-card shadow-sm">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <UserCog size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight">Admin Profile</h2>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Contact Information</p>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Username</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <Input 
                      value={profileData.username}
                      onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                      className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <Input 
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      placeholder="admin@lifeline.org"
                      className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <Input 
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      placeholder="+234..."
                      className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="h-14 px-10 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95"
                >
                  {isUpdatingProfile ? <Loader2 className="animate-spin" /> : "Save Changes"}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Security Settings */}
        <div className="space-y-10">
          <Card className="p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-border/50 bg-card shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Lock size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight">Security</h2>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Password Management</p>
              </div>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Current Password</label>
                <Input 
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">New Password</label>
                <Input 
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Confirm New Password</label>
                <Input 
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-medium"
                />
              </div>

              <Button 
                type="submit"
                disabled={isUpdatingPassword}
                className="w-full h-14 rounded-2xl bg-foreground text-background font-black text-sm uppercase tracking-widest shadow-xl transition-all hover:opacity-90"
              >
                {isUpdatingPassword ? <Loader2 className="animate-spin" /> : "Update Password"}
              </Button>
            </form>
          </Card>

          <Card className="p-8 rounded-[2rem] bg-muted/30 border border-border/50">
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-4 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-500" />
              Admin Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Role</span>
                <span className="font-black uppercase tracking-widest text-emerald-500">
                  {admin?.role || 'Administrator'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Permissions</span>
                <span className="font-black uppercase tracking-widest text-foreground">Full Access</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Session</span>
                <span className="font-black uppercase tracking-widest text-foreground">Active</span>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={14} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">System Audit</span>
              </div>
              <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">
                All changes made to the platform settings are logged and visible to other super-administrators.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
