"use client";

import React, { useEffect, useState } from "react";
import { Wrench, Plus, Loader2, CheckCircle, Clock, AlertTriangle, ArrowRight, Settings2, Package, User, FileText, Trash2 } from "lucide-react";
import Link from "next/link";

export default function BatteryRepairsPage() {
  const [repairs, setRepairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dealers, setDealers] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [repairId, setRepairId] = useState("");
  const [sn, setSn] = useState("");
  const [dealerId, setDealerId] = useState("");
  const [problemRemark, setProblemRemark] = useState("");
  const [solvedRemark, setSolvedRemark] = useState("");
  const [status, setStatus] = useState("pending");
  const [receivedAt, setReceivedAt] = useState(new Date().toISOString().split('T')[0]);
  const [solvedAt, setSolvedAt] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchRepairs();
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    try {
      const res = await fetch("/api/dealers");
      const data = await res.json();
      if (Array.isArray(data)) setDealers(data);
    } catch (error) {}
  };

  const fetchRepairs = async () => {
    try {
      const res = await fetch("/api/repairs");
      const data = await res.json();
      if (Array.isArray(data)) {
        setRepairs(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this repair record?")) {
      try {
        const res = await fetch(`/api/repairs/${id}`, { method: "DELETE" });
        if (res.ok) {
          fetchRepairs();
        } else {
          const data = await res.json();
          alert(data.error || "Failed to delete repair record");
        }
      } catch (error) {
        console.error(error);
        alert("Failed to delete repair record");
      }
    }
  };

  const openModal = (mode: "add" | "edit", repair: any = null) => {
    setModalMode(mode);
    if (mode === "add") {
      setRepairId("");
      setSn("");
      setDealerId("");
      setProblemRemark("");
      setSolvedRemark("");
      setStatus("pending");
      setReceivedAt(new Date().toISOString().split('T')[0]);
      setSolvedAt("");
    } else if (repair) {
      setRepairId(repair.id);
      setSn(repair.battery?.sn || "");
      setDealerId(repair.dealerId || "");
      setProblemRemark(repair.problemRemark || "");
      setSolvedRemark(repair.solvedRemark || "");
      setStatus(repair.status);
      setReceivedAt(new Date(repair.receivedAt).toISOString().split('T')[0]);
      setSolvedAt(repair.solvedAt ? new Date(repair.solvedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    }
    setIsModalOpen(true);
  };

  const handleSaveRepair = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        id: repairId,
        sn,
        dealerId,
        problemRemark,
        solvedRemark,
        status,
        receivedAt,
        solvedAt: solvedAt || null
      };

      const res = await fetch("/api/repairs", {
        method: modalMode === "add" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setIsModalOpen(false);
        fetchRepairs();
      } else {
        alert(data.error || "Failed to save repair entry");
      }
    } catch (error) {
      alert("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRepairs = repairs.filter(r => {
    const matchesSearch = 
      r.battery?.sn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.dealer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.qrNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredRepairs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRepairs = filteredRepairs.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="p-8 md:p-12 bg-slate-50 min-h-screen overflow-y-auto">
      <div className="w-full space-y-12 relative">
        
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-black text-secondary uppercase tracking-tight flex items-center gap-4">
              <Wrench className="w-10 h-10 text-primary" />
              Service & <span className="italic text-primary">Repairs</span>
            </h1>
            <p className="text-slate-400 font-medium mt-2">Manage incoming battery maintenance and track resolution timelines.</p>
          </div>
          <Link 
            href="/admin/repairs/add"
            className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
          >
            <Plus className="w-4 h-4" /> Log New Repair
          </Link>
        </div>

        {/* Dashboard Container */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          {/* Controls */}
          <div className="p-8 md:p-10 border-b border-slate-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-sm font-black text-secondary uppercase tracking-[0.2em] mb-2">Repair Registry</h3>
              <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredRepairs.length} Records</span>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Search S/N, QR, or Dealer..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 px-6 py-3 rounded-2xl text-xs font-semibold text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64"
              />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="all">All States</option>
                <option value="pending">Pending</option>
                <option value="completed">Solved</option>
              </select>
            </div>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="p-6 pl-10 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Battery Details</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Dealer</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest max-w-[250px]">Reported Problem</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest max-w-[250px]">Resolution Remark</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dates</th>
                  <th className="p-6 pr-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRepairs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400 font-medium text-sm">
                      {repairs.length === 0 ? "No repair logs found in the system." : "No matches found for your filter."}
                    </td>
                  </tr>
                ) : paginatedRepairs.map(repair => (
                  <tr key={repair.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="p-6 pl-10">
                      <div className="font-black text-secondary text-sm uppercase tracking-tight mb-2 flex items-center gap-2">
                        <Package className="w-4 h-4 text-primary" /> {repair.qrNumber || repair.battery?.sn}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 px-2 py-1 rounded text-slate-500">
                          {repair.status === 'completed' ? 'Solved' : repair.status}
                        </span>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="font-bold text-slate-700 text-sm flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-slate-400" /> {repair.dealer?.name || "No Dealer"}
                      </div>
                      <div className="text-xs text-slate-400">
                        {repair.dealer?.phone || "No Phone"}
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="text-xs text-slate-500 line-clamp-2" title={repair.problemRemark}>
                        {repair.problemRemark || <span className="opacity-50 italic">No detailed remarks</span>}
                      </div>
                    </td>

                    <td className="p-6">
                      {repair.status === 'completed' || repair.status === 'returned' ? (
                         <div className="text-xs text-slate-600 line-clamp-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-50" title={repair.solvedRemark}>
                           {repair.solvedRemark || <span className="opacity-50 italic">No closure remarks provided.</span>}
                         </div>
                      ) : (
                        <div className="text-xs text-slate-400 italic">Pending evaluation...</div>
                      )}
                    </td>

                    <td className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap space-y-2">
                      <div className="flex items-center gap-2 text-orange-500"><AlertTriangle className="w-3 h-3"/> IN: {new Date(repair.receivedAt).toLocaleDateString()}</div>
                      {repair.solvedAt && (
                        <div className="flex items-center gap-2 text-emerald-500"><CheckCircle className="w-3 h-3"/> OUT: {new Date(repair.solvedAt).toLocaleDateString()}</div>
                      )}
                    </td>

                    <td className="p-6 pr-10 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          href={`/admin/repairs/view/${repair.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                        >
                          <FileText className="w-3 h-3" /> View
                        </Link>
                        <Link 
                          href={`/admin/repairs/edit/${repair.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors"
                        >
                          <Settings2 className="w-3 h-3" /> Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(repair.id)}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="p-8 bg-slate-50/50 flex items-center justify-between border-t border-slate-50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-6 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary disabled:opacity-50 transition-all cursor-pointer"
                >
                  Previous
                </button>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-6 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary disabled:opacity-50 transition-all cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* UNIFIED ADD/EDIT MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-secondary/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 relative shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-secondary">✕</button>
              
              <h2 className="text-2xl font-black text-secondary uppercase tracking-tight mb-8 flex items-center gap-3">
                <Settings2 className="w-6 h-6 text-primary" /> {modalMode === 'add' ? 'Log New Repair' : 'Update Repair Ticket'}
              </h2>
              
              <form onSubmit={handleSaveRepair} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Battery Serial Number (S/N)</label>
                    <input required disabled={modalMode === 'edit'} value={sn} onChange={e=>setSn(e.target.value)} placeholder="E.g. BAT-2026-XOR" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Assigned Dealer (Optional)</label>
                    <select value={dealerId} onChange={e=>setDealerId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="">Select a dealer...</option>
                      {dealers.map(d => <option key={d.id} value={d.id}>{d.name} ({d.phone || 'No Phone'})</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Received Date</label>
                    <input type="date" required value={receivedAt} onChange={e=>setReceivedAt(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Repair Status</label>
                    <select value={status} onChange={e=>setStatus(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="pending">Pending</option>
                      <option value="completed">Solved</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Problem Remarks (Dealer Reported)</label>
                  <textarea rows={2} value={problemRemark} onChange={e=>setProblemRemark(e.target.value)} placeholder="Describe the symptoms or problems..." className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-100">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Resolution Date</label>
                    <input type="date" value={solvedAt} onChange={e=>setSolvedAt(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Resolution Remarks (Engineer Notes)</label>
                    <textarea rows={2} value={solvedRemark} onChange={e=>setSolvedRemark(e.target.value)} placeholder="Describe what was fixed..." className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"></textarea>
                  </div>
                </div>

                <button disabled={isSubmitting} type="submit" className="w-full bg-secondary text-white py-4 rounded-full font-black text-xs tracking-widest uppercase hover:bg-black transition-all flex items-center justify-center gap-3">
                  {isSubmitting ? "Processing..." : "Save Ticket Details"} <ArrowRight className="w-4 h-4"/>
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
