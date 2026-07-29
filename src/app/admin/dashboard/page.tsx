"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, Users, Battery, Settings, LogOut, 
  ChevronRight, Activity, Database, Package, AlertTriangle,
  Clock, TrendingUp, Zap, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stats
    fetch("/api/dashboard/stats")
      .then(res => res.json())
      .then(data => {
        setData(data);
      })
      .catch(err => console.error(err));

    // Fetch settings
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Booting XOrbit Intelligence...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Total Fleet", value: data?.stats?.batteries ?? 0, sub: "Models Registered", icon: Battery, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Partner Network", value: data?.stats?.dealers ?? 0, sub: "Authorized Dealers", icon: Users, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Live Deployment", value: data?.stats?.activeUnits ?? 0, sub: "Units in Field", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Maintenance Queue", value: data?.stats?.faultyUnits ?? 0, sub: "Faults Logged", icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-50" }
  ];

  return (
    <main className="p-8 md:p-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-display font-black text-secondary uppercase tracking-tight">
              Command <span className="italic text-primary">Center</span>
            </h1>
            <p className="text-slate-400 font-medium mt-1">{settings?.companyName || "XOrbit"} OS Industrial Terminal • v1.0.5</p>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Network Online</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-xl hover:border-primary/20 transition-all cursor-default"
            >
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-display font-black text-secondary italic mb-2 tracking-tight">{stat.value}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Operations Log */}
          <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-10 pb-4 border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-secondary flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-secondary uppercase tracking-[0.2em]">Recent Operations</h3>
              </div>
              <Link href="/admin/dealers" className="px-4 py-2 bg-slate-50 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all">View Network</Link>
            </div>
            
            <div className="space-y-4">
              {data?.activities?.length > 0 ? (
                data.activities.map((act: any) => (
                  <div key={act.id} className="flex items-center gap-6 p-6 rounded-[2rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${act.type === 'assignment' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'}`}>
                      {act.type === 'assignment' ? <Package className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-secondary uppercase tracking-tight">{act.title}</p>
                      <p className="text-xs font-medium text-slate-400 mt-0.5">{act.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{new Date(act.time).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center opacity-30">
                  <p className="text-sm font-bold uppercase tracking-widest">No Recent Operations Logged</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Controls */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-secondary p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-primary/80">Command Terminal</h3>
                <div className="space-y-4">
                  <Link href="/admin/batteries/add" className="block">
                    <button className="w-full bg-primary/20 backdrop-blur-md border border-primary/30 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-between px-8 hover:bg-primary transition-all group/btn shadow-lg">
                      Initialize New Battery <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                  <Link href="/admin/dealers/add" className="block">
                    <button className="w-full bg-white/5 backdrop-blur-md border border-white/10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-between px-8 hover:bg-white/10 transition-all group/btn">
                      Onboard Distributor <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>
              <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-primary/20 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000"></div>
              
              <div className="mt-12 pt-8 border-t border-white/5 relative z-10">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  XOrbit Security Protocols Active
                </div>
              </div>
            </div>

            {/* Network Health Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Stability</h4>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden mb-4">
                <div className="w-[98%] h-full bg-emerald-500 rounded-full"></div>
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Integrity: <span className="text-secondary">98.2% Nominal</span></p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
