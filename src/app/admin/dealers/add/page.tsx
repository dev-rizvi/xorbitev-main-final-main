"use client";

import React, { useState } from "react";
import { 
  LayoutDashboard, Users, Battery, Settings, LogOut, 
  ArrowLeft, Loader2, Save, X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddDealerPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/dealers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/admin/dealers");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-8 md:p-12 overflow-y-auto">
      <div className="w-full space-y-12">
        <div>
          <Link href="/admin/dealers" className="flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-[0.3em] mb-4 hover:translate-x-[-4px] transition-transform">
            <ArrowLeft className="w-4 h-4" /> Back to Network
          </Link>
          <h1 className="text-4xl font-display font-black text-secondary uppercase tracking-tight">
            Onboard <span className="italic text-primary">Partner</span>
          </h1>
          <p className="text-slate-400 font-medium mt-1">Register new authorized distribution node.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Dealer Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="e.g. Reliable EV Hub"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email Protocol</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="dealer@xorbit.ev"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Phone Line</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Physical Address</label>
              <input 
                type="text" 
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="Main Street, Tech Hub"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-50 flex justify-start">
            <button 
              type="submit"
              disabled={isLoading}
              className="px-10 py-5 bg-primary text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-4 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Authorize Partner
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
