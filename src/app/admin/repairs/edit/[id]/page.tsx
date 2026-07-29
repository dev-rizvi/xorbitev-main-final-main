"use client";

import React, { useState, useEffect, use } from "react";
import { 
  ArrowLeft, Save, Loader2, Wrench, Package, 
  User, Calendar, AlertTriangle, ArrowRight, CheckCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditRepairPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [dealers, setDealers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [sn, setSn] = useState("");
  const [dealerId, setDealerId] = useState("");
  const [problemRemark, setProblemRemark] = useState("");
  const [solvedRemark, setSolvedRemark] = useState("");
  const [status, setStatus] = useState("pending");
  const [receivedAt, setReceivedAt] = useState("");
  const [solvedAt, setSolvedAt] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    try {
      const [repairRes, dealersRes] = await Promise.all([
        fetch(`/api/repairs/${id}`),
        fetch("/api/dealers")
      ]);
      
      const repairData = await repairRes.json();
      const dealersData = await dealersRes.json();

      if (repairData) {
        setSn(repairData.qrNumber || repairData.battery?.sn || "");
        setDealerId(repairData.dealerId || "");
        setProblemRemark(repairData.problemRemark || "");
        setSolvedRemark(repairData.solvedRemark || "");
        setStatus(repairData.status || "pending");
        setReceivedAt(new Date(repairData.receivedAt).toISOString().split('T')[0]);
        if (repairData.solvedAt) {
          setSolvedAt(new Date(repairData.solvedAt).toISOString().split('T')[0]);
        }
      }
      
      if (Array.isArray(dealersData)) setDealers(dealersData);
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
        id,
        dealerId,
        problemRemark,
        solvedRemark,
        status,
        receivedAt,
        solvedAt: solvedAt || null
      };

      const res = await fetch("/api/repairs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        router.push("/admin/repairs");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update repair ticket");
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
              Edit Repair <span className="italic text-primary">Ticket</span>
            </h1>
            <p className="text-slate-400 font-medium mt-1">Update maintenance status and resolution details.</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
            <div className={`w-3 h-3 rounded-full animate-pulse ${status === 'completed' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">{status}</span>
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
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Battery Serial Number (S/N)</label>
                </div>
                <div className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl text-sm font-black text-secondary/50 uppercase tracking-wider">
                  {sn}
                </div>
                <p className="text-[9px] font-bold text-slate-300 ml-2 italic">* S/N cannot be changed once logged</p>
              </div>

              {/* Status */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 ml-1">
                  <AlertTriangle className="w-4 h-4 text-primary" />
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Current Ticket Status</label>
                </div>
                <select 
                  value={status} 
                  onChange={e => setStatus(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="pending">Pending Evaluation</option>
                  <option value="in_progress">In Repair</option>
                  <option value="completed">Solved / Fixed</option>
                  <option value="returned">Returned to Dealer</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Dealer */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 ml-1">
                  <User className="w-4 h-4 text-primary" />
                  <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Reporting Dealer</label>
                </div>
                <select 
                  value={dealerId} 
                  onChange={e => setDealerId(e.target.value)} 
                  className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="">No partner assigned</option>
                  {dealers.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.phone || 'No Phone'})</option>
                  ))}
                </select>
              </div>

              {/* Received Date */}
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
            </div>

            {/* Problem Remark */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 ml-1">
                <AlertTriangle className="w-4 h-4 text-primary" />
                <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Problem Description (Dealer Reported)</label>
              </div>
              <textarea 
                rows={3} 
                value={problemRemark} 
                onChange={e => setProblemRemark(e.target.value)} 
                placeholder="Describe the issues reported by the partner..." 
                className="w-full bg-slate-50 border border-slate-100 p-6 rounded-[2rem] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all resize-none"
              ></textarea>
            </div>

            <div className="pt-6 border-t border-slate-50 space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {/* Solved Date */}
                 <div className="space-y-4">
                   <div className="flex items-center gap-3 ml-1">
                     <CheckCircle className="w-4 h-4 text-emerald-500" />
                     <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Resolution Date</label>
                   </div>
                   <input 
                     type="date" 
                     value={solvedAt} 
                     onChange={e => setSolvedAt(e.target.value)} 
                     className="w-full bg-emerald-50/30 border border-emerald-100/50 p-5 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all" 
                   />
                 </div>

                 {/* Resolution Remark */}
                 <div className="space-y-4">
                   <div className="flex items-center gap-3 ml-1">
                     <Wrench className="w-4 h-4 text-emerald-500" />
                     <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Resolution Notes (Engineer)</label>
                   </div>
                   <textarea 
                     rows={2} 
                     value={solvedRemark} 
                     onChange={e => setSolvedRemark(e.target.value)} 
                     placeholder="What was fixed? (Cells replaced, BMS reset, etc.)" 
                     className="w-full bg-emerald-50/30 border border-emerald-100/50 p-6 rounded-[2rem] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all resize-none"
                   ></textarea>
                 </div>
               </div>
            </div>

            <div className="pt-6">
              <button 
                disabled={isSubmitting} 
                type="submit" 
                className="w-full bg-secondary text-white py-6 rounded-[2rem] font-black text-xs tracking-[0.3em] uppercase hover:bg-black transition-all flex items-center justify-center gap-4 shadow-2xl shadow-secondary/20 hover:scale-[1.01] active:scale-[0.99]"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {isSubmitting ? "Updating Ticket..." : "Update Ticket & Save Changes"}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
