"use client";

import React, { useState, useEffect } from "react";
import { LayoutDashboard, Users, Battery, Settings, LogOut, Mail, Wrench, Package, Building2, QrCode, ShieldCheck, Activity } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error("Failed to fetch settings:", err));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { label: "Dashboard Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Battery Models", href: "/admin/batteries", icon: Battery },
    { label: "Battery Inventory", href: "/admin/battery-units", icon: Package },
    { label: "Dealer Network", href: "/admin/dealers", icon: Users },
    { label: "Service & Repairs", href: "/admin/repairs", icon: Wrench },
    { label: "Contact Entries", href: "/admin/contact", icon: Mail },
    { label: "Supplier Registry", href: "/admin/suppliers", icon: Building2 },
    { label: "QR Code Utility", href: "/admin/qr-generator", icon: QrCode },
    { label: "QR Code History", href: "/admin/qr-history", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-[#060a1a] text-white p-5 flex flex-col hidden lg:flex sticky top-0 h-screen border-r border-white/5 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[80px] -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-[80px] -ml-16 -mb-16"></div>

        <div className="relative z-10 mb-8 px-2 pt-1">
          {settings?.logo ? (
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white/5 rounded-2xl border border-white/10 shadow-lg">
                <img 
                  src={settings.logo} 
                  alt={settings.companyName || "Logo"} 
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-tight text-white leading-none">
                  {settings.companyName || "XORBIT"}
                </h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">System Active</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-display font-black uppercase tracking-tighter italic text-white leading-none">
                  XORBIT <span className="text-primary not-italic">EV</span>
                </h2>
                <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mt-1">Industrial OS</p>
              </div>
            </div>
          )}
        </div>

        <nav className="relative z-10 flex-1 space-y-1 px-1 custom-scrollbar overflow-y-auto pr-2">
          <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-3 ml-3">Operations Hub</p>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all relative overflow-hidden ${
                  isActive 
                    ? "text-white" 
                    : "text-white/40 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border-l-2 border-primary"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon className={`w-5 h-5 relative z-10 transition-colors ${isActive ? "text-primary" : "group-hover:text-white/80"}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest relative z-10 transition-transform ${isActive ? "translate-x-1" : "group-hover:translate-x-1"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          
          <div className="pt-4 mt-4 border-t border-white/5 space-y-1">
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-3 ml-3">Configuration</p>
            <Link 
              href="/admin/settings"
              className={`group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all relative overflow-hidden ${
                pathname.startsWith("/admin/settings")
                  ? "text-white" 
                  : "text-white/40 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              {pathname.startsWith("/admin/settings") && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border-l-2 border-primary"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Settings className={`w-5 h-5 relative z-10 transition-colors ${pathname.startsWith("/admin/settings") ? "text-primary" : "group-hover:text-white/80"}`} />
              <span className={`text-[10px] font-black uppercase tracking-widest relative z-10 transition-transform ${pathname.startsWith("/admin/settings") ? "translate-x-1" : "group-hover:translate-x-1"}`}>
                System Settings
              </span>
            </Link>
          </div>
        </nav>

        <div className="relative z-10 pt-4 mt-4 border-t border-white/5">
          <button 
            onClick={handleLogout} 
            className="w-full group flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-red-500/5 transition-all relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
              <LogOut className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-red-400 group-hover:text-red-300">System Logout</p>
              <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-0.5">End Security Session</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
