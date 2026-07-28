"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
  Building2,
  Map,
  Users,
  Activity,
  Settings,
  PieChart,
  UserCheck,
  HelpCircle
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const role = user?.role || "CITIZEN";

  // Define navigation based on role
  let navItems = [];
  if (role === "CITIZEN") {
    navItems = [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Raise Complaint", href: "/complaints/create", icon: PlusCircle },
      { name: "My Complaints", href: "/complaints", icon: FileText },
      { name: "Profile", href: "/profile", icon: User },
      { name: "Support", href: "/support", icon: HelpCircle },
    ];
  } else if (role === "DISTRICT_ADMIN") {
    navItems = [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Complaints", href: "/complaints", icon: FileText },
      { name: "Wards", href: "/wards", icon: Map },
      { name: "Profile", href: "/profile", icon: User },
      { name: "Support", href: "/support", icon: HelpCircle },
    ];
  } else {
    navItems = [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Complaints", href: "/complaints", icon: FileText },
      { name: "Profile", href: "/profile", icon: User },
      { name: "Support", href: "/support", icon: HelpCircle },
    ];
  }

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex flex-col w-72 bg-card border-r border-border fixed h-full z-20 shadow-sm transition-all duration-300">
        <div className="p-8 border-b border-border/50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md shadow-primary/20 overflow-hidden bg-white">
            <img src="/logo.png" alt="CiviFix" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-bold text-foreground tracking-tight text-xl leading-tight">CiviFix</h2>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">{role}</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = 
              item.href === "/dashboard" ? pathname === "/dashboard" :
              item.href === "/complaints/create" ? pathname === "/complaints/create" :
              item.href === "/complaints" ? (pathname === "/complaints" || (pathname.startsWith("/complaints/") && pathname !== "/complaints/create")) :
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 font-medium text-sm ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-[1.02]"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border/50">
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-3 px-4 py-3.5 w-full rounded-2xl transition-all duration-200 font-semibold text-sm text-destructive hover:bg-destructive/10 hover:scale-[1.02]"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── MOBILE HEADER ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b border-border flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden shadow-sm shadow-primary/20 bg-white">
            <img src="/logo.png" alt="CiviFix" className="w-full h-full object-cover" />
          </div>
          <h2 className="font-bold text-foreground tracking-tight text-lg">CiviFix</h2>
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAVIGATION ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around px-2 z-40 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {navItems.slice(0, 5).map((item) => {
          const isActive = 
            item.href === "/dashboard" ? pathname === "/dashboard" :
            item.href === "/complaints/create" ? pathname === "/complaints/create" :
            item.href === "/complaints" ? (pathname === "/complaints" || (pathname.startsWith("/complaints/") && pathname !== "/complaints/create")) :
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-[10px] font-medium ${isActive ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                {item.name.split(' ')[0]} {/* Shorten name for bottom nav */}
              </span>
            </Link>
          );
        })}
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 md:ml-72 pt-14 pb-16 md:pt-0 md:pb-0 min-h-screen flex flex-col relative w-full overflow-x-hidden">
        {/* Desktop Header/Topbar (Optional but good for premium feel) */}
         <div className="hidden md:flex h-20 items-center justify-end px-8 bg-transparent w-full z-10 absolute top-0 right-0 pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-4">
              <Link href="/profile" className="flex items-center gap-3 bg-card py-2 px-4 rounded-full shadow-sm border border-border cursor-pointer hover:border-primary/50 transition-all block">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm shrink-0 border border-primary/20">
                  {user?.name 
                    ? user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
                    : (user?.email?.charAt(0).toUpperCase() || "U")
                  }
                </div>
                <div className="hidden lg:flex flex-col justify-center text-left max-w-[200px]">
                  <p className="text-sm font-bold text-foreground leading-tight truncate">
                    {user?.name || user?.email || "Account"}
                  </p>
                  {user?.name && user?.email && (
                    <p className="text-[10px] font-semibold text-muted-foreground leading-tight truncate mt-0.5">
                      {user.email}
                    </p>
                  )}
                </div>
             </Link>
           </div>
        </div>

        {/* Content Container with proper padding */}
        <div className="flex-1 p-4 md:p-8 md:pt-24 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
