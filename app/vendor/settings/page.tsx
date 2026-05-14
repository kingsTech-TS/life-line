"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { 
  User, 
  Lock, 
  CreditCard, 
  Mail, 
  Phone, 
  MapPin, 
  Store, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function VendorSettings() {
  const [vendor, setVendor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [banks, setBanks] = useState<any[]>([]);

  // Profile Form
  const [profileData, setProfileData] = useState({
    businessName: "",
    email: "",
    phone: "",
    address: "",
    bankName: "",
    accountNumber: "",
    bankCode: "",
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
        const [vendorRes, banksRes] = await Promise.all([
          fetch("/api/vendor/me"),
          fetch("/api/vendor/banks"),
        ]);

        const vendorData = await vendorRes.json();
        const banksData = await banksRes.json();

        if (vendorData.vendor) {
          setVendor(vendorData.vendor);
          setProfileData({
            businessName: vendorData.vendor.businessName || "",
            email: vendorData.vendor.email || "",
            phone: vendorData.vendor.phone || "",
            address: vendorData.vendor.address || "",
            bankName: vendorData.vendor.bankName || "",
            accountNumber: vendorData.vendor.accountNumber || "",
            bankCode: vendorData.vendor.bankCode || "",
          });
        }

        if (Array.isArray(banksData)) {
          // Deduplicate banks by code
          const uniqueBanks = banksData.filter((bank, index, self) =>
            index === self.findIndex((b) => b.code === bank.code)
          );
          setBanks(uniqueBanks);
        }
      } catch (error) {
        console.error("Failed to fetch settings data:", error);
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
      const res = await fetch("/api/vendor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully!");
        setVendor(data.vendor);
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
      const res = await fetch("/api/vendor/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password updated successfully!");
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
        <h1 className="text-4xl font-black tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground font-medium">Manage your account details and payout preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-10">
          <Card className="p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-border/50 bg-card shadow-sm">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight">Business Profile</h2>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Basic Information</p>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Business Name</label>
                  <div className="relative group">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <Input 
                      value={profileData.businessName}
                      onChange={(e) => setProfileData({...profileData, businessName: e.target.value})}
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
                      className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <Input 
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Business Address</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <Input 
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border/50">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight">Payout Details</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Bank Account Information</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Select Bank</label>
                    <select
                      value={profileData.bankCode}
                      onChange={(e) => {
                        const selectedBank = banks.find(b => b.code === e.target.value);
                        setProfileData({
                          ...profileData, 
                          bankCode: e.target.value,
                          bankName: selectedBank?.name || ""
                        });
                      }}
                      className="w-full h-14 px-4 rounded-2xl bg-muted/30 border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium outline-none transition-all"
                    >
                      <option value="">Select your bank</option>
                      {banks.map(bank => (
                        <option key={bank.code} value={bank.code}>{bank.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Account Number</label>
                    <Input 
                      value={profileData.accountNumber}
                      onChange={(e) => setProfileData({...profileData, accountNumber: e.target.value})}
                      placeholder="10 digit account number"
                      maxLength={10}
                      className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-medium"
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
              <CheckCircle2 size={16} className="text-emerald-500" />
              Account Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Approval Status</span>
                <span className={`font-black uppercase tracking-widest ${vendor?.isApproved ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {vendor?.isApproved ? 'Approved' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Account Type</span>
                <span className="font-black uppercase tracking-widest text-foreground">Standard Vendor</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Payout Method</span>
                <span className="font-black uppercase tracking-widest text-foreground">Paystack SPLIT</span>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border/50">
              <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">
                <AlertCircle size={10} className="inline mr-1 -mt-0.5" />
                Wait 24-48 hours for payouts to be processed and settled into your account after a sale.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
