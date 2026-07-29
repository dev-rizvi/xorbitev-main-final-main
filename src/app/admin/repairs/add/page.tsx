"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Save, Loader2, Wrench, Package, 
  User, Calendar, AlertTriangle, ArrowRight 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddRepairPage() {
  const router = useRouter();
  const [dealers, setDealers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [sn, setSn] = useState("");
  const [dealerId, setDealerId] = useState("");
  const [problemRemark, setProblemRemark] = useState("");
  const [receivedAt, setReceivedAt] = useState(new Date().toISOString().split('T')[0]);

  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchDealers();
  }, []);

  // Auto-fill dealer when SN is entered
  useEffect(() => {
    if (sn.length > 3) {
      const timer = setTimeout(async () => {
        setIsSearching(true);
        try {
          const res = await fetch(`/api/battery-units?qr=${sn}`);
          const data = await res.json();
          if (data && data.dealerId) {
            setDealerId(data.dealerId);
          } else {
            setDealerId("");
          }
        } catch (error) {
          console.error("Dealer lookup failed:", error);
        } finally {
          setIsSearching(false);
        }
      }, 800); // 800ms debounce
      return () => clearTimeout(timer);
    }
  }, [sn]);

  const fetchDealers = async () => {
    try {
      const res = await fetch("/api/dealers");
      const data = await res.json();
      if (Array.isArray(data)) setDealers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        sn,
        dealerId,
        problemRemark,
        status: "pending",
        receivedAt,
      };

      const res = await fetch("/api/repairs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok) {
        router.push("/admin/repairs");
      } else {
        alert(`${data.error}: ${data.details || ''}`);
      }
    } catch (error) {
      alert("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="p-8 md:p-12 bg-slate-50 min-h-screen">
      <div className="w-full space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <Link href="/admin/repairs" className="flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-[0.3em] mb-4 hover:translate-x-[-4px] transition-transform w-fit">
              <ArrowLeft className="w-4 h-4" /> Back to Service Registry
            </Link>
            <h1 className="text-4xl font-display font-black text-secondary uppercase tracking-tight">
              Log New <span className="italic text-primary">Repair</span>
            </h1>
            <p className="text-slate-400 font-medium mt-1">Initiate a new service ticket for battery maintenance.</p>
          </div>
        </div>

        <div className="bg-white p-10 md:p-16 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <Wrench className="absolute -right-12 -bottom-12 w-64 h-64 text-slate-50/50 -rotate-12" />
          
          <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Battery S/N */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 ml-1">
                  <Package className="w-4 h-4 text-primary" />
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Battery Unit (QR Code)</label>
                </div>
                <input 
                  required 
                  value={sn} 
                  onChange={e => setSn(e.target.value)} 
                  placeholder="Enter QR Number (e.g. XOR1)" 
                  className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all" 
                />
              </div>

              {/* Dealer */}
              <div className="space-y-4">
                <div className="flex items-center justify-between ml-1">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-primary" />
                    <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Reporting Dealer</label>
                  </div>
                  {isSearching && (
                    <div className="flex items-center gap-2 text-[9px] font-black text-primary uppercase animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" /> Identifying...
                    </div>
                  )}
                </div>
                <select 
                  value={dealerId} 
                  onChange={e => setDealerId(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select a partner...</option>
                  {dealers.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.phone || 'No Phone'})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Date */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 ml-1">
                  <Calendar className="w-4 h-4 text-primary" />
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Received Date</label>
                </div>
                <input 
                  type="date" 
                  required 
                  value={receivedAt} 
                  onChange={e => setReceivedAt(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all" 
                />
              </div>

              {/* Status (Implicitly Pending) */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 ml-1">
                  <AlertTriangle className="w-4 h-4 text-primary" />
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Initial Ticket Status</label>
                </div>
                <div className="w-full bg-orange-50 border border-orange-100 p-5 rounded-2xl text-sm font-black text-orange-500 uppercase tracking-widest">
                  Pending Evaluation
                </div>
              </div>
            </div>

            {/* Problem Remark */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 ml-1">
                <AlertTriangle className="w-4 h-4 text-primary" />
                <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Problem Description (Dealer Reported)</label>
              </div>
              <textarea 
                rows={4} 
                required
                value={problemRemark} 
                onChange={e => setProblemRemark(e.target.value)} 
                placeholder="Describe the issues, symptoms, or reason for return..." 
                className="w-full bg-slate-50 border border-slate-100 p-6 rounded-[2rem] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all resize-none"
              ></textarea>
            </div>

            <div className="pt-6">
              <button 
                disabled={isSubmitting} 
                type="submit" 
                className="w-full bg-secondary text-white py-6 rounded-[2rem] font-black text-xs tracking-[0.3em] uppercase hover:bg-black transition-all flex items-center justify-center gap-4 shadow-2xl shadow-secondary/20 hover:scale-[1.01] active:scale-[0.99]"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {isSubmitting ? "Processing Registry..." : "Confirm & Log Ticket"}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
