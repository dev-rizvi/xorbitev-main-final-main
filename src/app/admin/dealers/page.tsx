"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Users, Battery, Settings, LogOut, 
  Plus, Edit2, Trash2, Search, MapPin, Phone, Mail,
  Activity, Database, Loader2, AlertCircle, X, PackagePlus
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Dealer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  assignments?: any[];
}

interface BatteryModel {
  id: string;
  sn: string;
  name: string;
}

export default function DealersListPage() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [batteries, setBatteries] = useState<BatteryModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [repairDealer, setRepairDealer] = useState<Dealer | null>(null);
  const [assignData, setAssignData] = useState({ batteryId: "", quantity: 1 });
  const [repairData, setRepairData] = useState({ batteryId: "", quantity: 1, issue: "" });
  const [isAssigning, setIsAssigning] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  const fetchDealers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/dealers");
      const data = await res.json();
      setDealers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBatteries = async () => {
    try {
      const res = await fetch("/api/batteries");
      const data = await res.json();
      setBatteries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDealers();
    fetchBatteries();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Terminate dealer contract? All assignments will be archived.")) {
      try {
        await fetch(`/api/dealers/${id}`, { method: "DELETE" });
        fetchDealers();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDealer || !assignData.batteryId) return;
    setIsAssigning(true);
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealerId: selectedDealer.id,
          batteryDetailId: assignData.batteryId,
          quantity: assignData.quantity,
        }),
      });
      if (res.ok) {
        setSelectedDealer(null);
        setAssignData({ batteryId: "", quantity: 1 });
        alert("Inventory assigned successfully.");
        fetchDealers();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRepair = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repairDealer || !repairData.batteryId) return;
    setIsRepairing(true);
    try {
      const res = await fetch("/api/repairs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealerId: repairDealer.id,
          batteryDetailId: repairData.batteryId,
          quantity: repairData.quantity,
          issue: repairData.issue,
        }),
      });
      if (res.ok) {
        setRepairDealer(null);
        setRepairData({ batteryId: "", quantity: 1, issue: "" });
        alert("Repair ticket logged successfully.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsRepairing(false);
    }
  };

  const filteredDealers = dealers.filter(d => 
    d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredDealers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDealers = filteredDealers.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <main className="p-8 md:p-12 overflow-y-auto">
      <div className="w-full space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-display font-black text-secondary uppercase tracking-tight">
              Dealer <span className="italic text-primary">Network</span>
            </h1>
            <p className="text-slate-400 font-medium mt-1">Authorized Distribution Partners • v1.0.4</p>
          </div>
          
          <Link 
            href="/admin/dealers/add"
            className="bg-primary text-white px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-5 h-5" /> Add New Dealer
          </Link>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="text" 
                placeholder="Search by Dealer Name or Email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              Showing {paginatedDealers.length} of {filteredDealers.length} Partners
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dealer Info</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Details</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                      <p className="text-sm font-bold text-slate-400">Loading Network...</p>
                    </td>
                  </tr>
                ) : paginatedDealers.map((dealer) => (
                  <tr key={dealer.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-bold text-secondary text-sm">{dealer.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {dealer.address || "No Address"}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                          <Mail className="w-3 h-3 text-slate-300" /> {dealer.email}
                        </p>
                        <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                          <Phone className="w-3 h-3 text-slate-300" /> {dealer.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase ${dealer.status === 'active' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                        {dealer.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/admin/dealers/view/${dealer.id}`}
                          className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-secondary hover:text-white transition-all"
                          title="View Details"
                        >
                          <Activity className="w-4 h-4" />
                        </Link>
                        <Link 
                          href={`/admin/dealers/edit/${dealer.id}`}
                          className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-all"
                          title="Edit Dealer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <Link 
                          href={`/admin/dealers/view/${dealer.id}/assign`}
                          className="p-3 rounded-xl bg-slate-50 text-primary hover:bg-primary hover:text-white transition-all group/btn"
                          title="Assign Units"
                        >
                          <PackagePlus className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(dealer.id)} className="p-3 rounded-xl hover:bg-white hover:shadow-md text-slate-400 hover:text-red-500 transition-all">
                          <Trash2 className="w-4 h-4" />
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
                  className="px-6 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary disabled:opacity-50 transition-all"
                >
                  Previous
                </button>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-6 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary disabled:opacity-50 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      <AnimatePresence>
        {selectedDealer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-secondary/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white p-12 rounded-[3.5rem] shadow-2xl relative max-w-md w-full"
            >
              <button onClick={() => setSelectedDealer(null)} className="absolute top-8 right-8 p-3 rounded-2xl hover:bg-slate-50 text-slate-400 transition-all">
                <X className="w-6 h-6" />
              </button>
              
              <div className="mb-10">
                <h3 className="text-2xl font-display font-black text-secondary uppercase tracking-tight italic">Inventory <span className="text-primary not-italic">Assignment</span></h3>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Target Dealer: {selectedDealer.name}</p>
              </div>

              <form onSubmit={handleAssign} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Select Battery Model</label>
                  <select 
                    required
                    value={assignData.batteryId}
                    onChange={e => setAssignData({...assignData, batteryId: e.target.value})}
                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                  >
                    <option value="">Select System...</option>
                    {batteries.map(b => (
                      <option key={b.id} value={b.id}>{b.sn} - {b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Quantity (Units)</label>
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={assignData.quantity || ""}
                    onChange={e => {
                      const val = parseInt(e.target.value);
                      setAssignData({...assignData, quantity: isNaN(val) ? 0 : val});
                    }}
                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isAssigning}
                  className="w-full py-5 bg-primary text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isAssigning ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Deploy Inventory"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Repair Modal */}
      <AnimatePresence>
        {repairDealer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-secondary/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white p-12 rounded-[3.5rem] shadow-2xl relative max-w-md w-full"
            >
              <button onClick={() => setRepairDealer(null)} className="absolute top-8 right-8 p-3 rounded-2xl hover:bg-slate-50 text-slate-400 transition-all">
                <X className="w-6 h-6" />
              </button>
              
              <div className="mb-10">
                <h3 className="text-2xl font-display font-black text-secondary uppercase tracking-tight italic text-orange-500">Repair <span className="text-secondary not-italic">Logging</span></h3>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Source: {repairDealer.name}</p>
              </div>

              <form onSubmit={handleRepair} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Select Faulty Model</label>
                  <select 
                    required
                    value={repairData.batteryId}
                    onChange={e => setRepairData({...repairData, batteryId: e.target.value})}
                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none"
                  >
                    <option value="">Select Assigned System...</option>
                    {(repairDealer as any)?.assignments?.map((as: any) => (
                      <option key={as.battery.id} value={as.battery.id}>
                        {as.battery.sn} - {as.battery.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Faulty Units</label>
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={repairData.quantity || ""}
                    onChange={e => {
                      const val = parseInt(e.target.value);
                      setRepairData({...repairData, quantity: isNaN(val) ? 0 : val});
                    }}
                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Issue Description</label>
                  <textarea 
                    placeholder="Describe the technical failure..."
                    value={repairData.issue}
                    onChange={e => setRepairData({...repairData, issue: e.target.value})}
                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20 transition-all min-h-[100px]"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isRepairing}
                  className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isRepairing ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Log Faulty Entry"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
