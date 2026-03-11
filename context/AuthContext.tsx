"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface User {
  id: string;
  name: string;
  email: string;
  cart: any[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (formData: any) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      toast.success("Logged in successfully");
    } else {
      throw new Error(data.error || "Login failed");
    }
  };

  const signup = async (formData: any) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      toast.success("Account created successfully");
    } else {
      throw new Error(data.error || "Signup failed");
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    toast.info("Logged out");
    // Clear local storage cart if we want to ensure fresh start
    localStorage.removeItem("lifeline_cart");
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
