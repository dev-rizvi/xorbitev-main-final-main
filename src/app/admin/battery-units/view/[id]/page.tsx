"use client";

import React, { useState, useEffect, use } from "react";
import { 
  ArrowLeft, ArrowRight, Battery, Calendar, Users, Wrench, 
  CheckCircle, Clock, AlertTriangle, Package, Loader2,
  User, Phone, Save, X, Plus, History, Building2, UserCircle, FileText
} from "lucide-react";
import Link from "next/link";

export default function UnitViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [unit, setUnit] = useState<any>(null);
  const [repairs, setRepairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientForm, setClientForm] = useState({
    clientName: "",
    clientPhone: "",
    clientAssignedAt: new Date().toISOString().split('T')[0],
    remark: "",
    dealerRemark: "",
    warrantyMonthsOverride: ""
  });
  const [isSavingClient, setIsSavingClient] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Unit Details
      const unitRes = await fetch(`/api/battery-units/${id}`);
      const unitData = await unitRes.json();
      setUnit(unitData);
      
      if (unitData) {
        setClientForm({
          clientName: unitData.clientName || "",
          clientPhone: unitData.clientPhone || "",
          clientAssignedAt: unitData.clientAssignedAt ? new Date(unitData.clientAssignedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          remark: unitData.remark || "",
          dealerRemark: unitData.dealerRemark || "",
          warrantyMonthsOverride: unitData.warrantyMonthsOverride?.toString() || ""
        });
      }

      if (unitData?.qrNumber) {
        // 2. Fetch Repair History for this QR
        const repairRes = await fetch(`/api/repairs?qr=${unitData.qrNumber}`);
        const repairData = await repairRes.json();
        setRepairs(repairData);
      }
    } catch (error) {
      console.error("Failed to fetch unit data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClient = async () => {
    setIsSavingClient(true);
    try {
      const res = await fetch(`/api/battery-units/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientForm)
      });
      if (res.ok) {
        setIsClientModalOpen(false);
        fetchData();
      }
    } catch (error) {
      console.error("Failed to save client info:", error);
    } finally {
      setIsSavingClient(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Unit Not Found</p>
      </div>
    );
  }

  return (
    <main className="p-8 md:p-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <Link href="/admin/battery-units" className="flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-[0.3em] mb-4 hover:translate-x-[-4px] transition-transform w-fit">
              <ArrowLeft className="w-4 h-4" /> Back to Inventory
            </Link>
            <h1 className="text-4xl font-display font-black text-secondary uppercase tracking-tight">
              Unit <span className="italic text-primary">Lifecycle</span>
            </h1>
            <p className="text-slate-400 font-medium mt-1 uppercase text-[10px] tracking-widest font-black">QR: {unit.qrNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Unit Stats Sidebar */}
          <div className="space-y-8">
            {/* Technical Registry Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Battery className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-sm font-black text-secondary uppercase tracking-tight">Technical Registry</h3>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Specifications & Info</p>
                 </div>
               </div>

               <div className="space-y-4 pt-4 border-t border-slate-50">
                 <div className="flex justify-between items-center py-1.5 border-b border-slate-50/50">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">QR Number</span>
                    <span className="text-xs font-black text-primary tracking-wider">{unit.qrNumber}</span>
                 </div>
                 <div className="flex justify-between items-center py-1.5 border-b border-slate-50/50">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Battery Model</span>
                    <span className="text-xs font-bold text-secondary">{unit.model?.name || '—'}</span>
                 </div>
                 <div className="flex justify-between items-center py-1.5 border-b border-slate-50/50">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Operational Status</span>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      unit.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 
                      unit.status === 'faulty' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {unit.status}
                    </span>
                 </div>
                 <div className="flex justify-between items-center py-1.5 border-b border-slate-50/50">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Manufacture Date</span>
                    <span className="text-xs font-bold text-secondary">
                      {unit.manufactureDate ? new Date(unit.manufactureDate).toLocaleDateString() : '—'}
                    </span>
                 </div>
                 {unit.supplier && (
                   <div className="flex justify-between items-center py-1.5 border-b border-slate-50/50">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Supplier</span>
                      <span className="text-xs font-bold text-secondary">{unit.supplier.name}</span>
                   </div>
                 )}
                 <div className="py-1.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Internal Remark</span>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/50">
                      <p className="text-xs text-slate-600 font-medium leading-relaxed italic">
                        {unit.remark || 'No internal remarks recorded.'}
                      </p>
                    </div>
                 </div>
               </div>
            </div>

            {/* Authorized Partner Card */}
            {unit.dealer && (
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-sm">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block">Authorized Partner</span>
                    <h4 className="text-sm font-black text-secondary tracking-tight">{unit.dealer.name}</h4>
                    {unit.assignedAt && unit.model?.warrantyMonths ? (() => {
                      const assignDate = new Date(unit.assignedAt);
                      const expiryDate = new Date(assignDate);
                      const warrantyDuration = unit.warrantyMonthsOverride || unit.model?.warrantyMonths || 0;
                      expiryDate.setMonth(expiryDate.getMonth() + warrantyDuration);
                      expiryDate.setDate(expiryDate.getDate() + 60);
                      
                      const diffDays = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      const isExpired = diffDays <= 0;
                      
                      return (
                        <p className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${isExpired ? 'text-red-500' : 'text-blue-500'}`}>
                          {isExpired ? 'Dealer Warranty Expired' : `Dealer Warranty: ${diffDays} Days Left`}
                        </p>
                      );
                    })() : unit.assignedAt && (
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        Assigned on {new Date(unit.assignedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pl-11">
                  {unit.dealer.phone && (
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-200" />
                       <span className="text-xs font-bold text-slate-500">{unit.dealer.phone}</span>
                    </div>
                  )}
                  {unit.dealer.email && (
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-200" />
                       <span className="text-xs font-bold text-slate-500">{unit.dealer.email}</span>
                    </div>
                  )}
                  {unit.dealer.address && (
                    <div className="flex items-start gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-200 mt-1.5" />
                       <span className="text-xs font-bold text-slate-500 leading-relaxed">{unit.dealer.address}</span>
                    </div>
                  )}
                </div>

                <Link 
                  href={`/admin/dealers/view/${unit.dealer.id}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all group"
                >
                  View Full Profile <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}

            {/* Client Details */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 relative group overflow-hidden">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <User className="w-5 h-5 text-primary" />
                   <h3 className="text-[10px] font-black text-secondary uppercase tracking-widest">End User Profile</h3>
                 </div>
                 <button 
                  onClick={() => setIsClientModalOpen(true)}
                  className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-all shadow-sm"
                 >
                   <Plus className="w-3.5 h-3.5" />
                 </button>
               </div>
               {unit.clientName ? (
                 <div className="space-y-4">
                   <div>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Client Name</p>
                      <p className="text-lg font-black text-secondary">{unit.clientName}</p>
                   </div>
                   <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Phone Number</p>
                        <p className="font-bold text-secondary">{unit.clientPhone || '—'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Purchase Date</p>
                        <p className="font-bold text-secondary">
                          {unit.clientAssignedAt ? new Date(unit.clientAssignedAt).toLocaleDateString() : '—'}
                        </p>
                      </div>
                   </div>
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center py-4 space-y-2 opacity-30 group-hover:opacity-100 transition-opacity">
                   <User className="w-8 h-8 text-slate-200" />
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Unsold / No Client Data</p>
                   <button 
                    onClick={() => setIsClientModalOpen(true)}
                    className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
                   >
                    + Add Client Info
                   </button>
                 </div>
               )}

               {/* Warranty Countdown */}
               {unit.clientAssignedAt && unit.model?.warrantyMonths && (
                 <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                   <div>
                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Warranty Status</p>
                     {(() => {
                       const purchaseDate = new Date(unit.clientAssignedAt);
                       const expiryDate = new Date(purchaseDate);
                       const warrantyDuration = unit.warrantyMonthsOverride || unit.model?.warrantyMonths || 0;
                       expiryDate.setMonth(expiryDate.getMonth() + warrantyDuration);
                       
                       const today = new Date();
                       const diffTime = expiryDate.getTime() - today.getTime();
                       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                       const isExpired = diffDays <= 0;

                       return (
                         <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${isExpired ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                           <p className={`text-xs font-black uppercase tracking-widest ${isExpired ? 'text-red-500' : 'text-emerald-600'}`}>
                             {isExpired ? 'Expired' : `${diffDays} Days Remaining`}
                           </p>
                         </div>
                       );
                     })()}
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Expiration Date</p>
                      <p className="text-[10px] font-bold text-secondary">
                        {(() => {
                          const date = new Date(unit.clientAssignedAt);
                          const warrantyDuration = unit.warrantyMonthsOverride || unit.model?.warrantyMonths || 0;
                          date.setMonth(date.getMonth() + warrantyDuration);
                          return date.toLocaleDateString();
                        })()}
                      </p>
                   </div>
                 </div>
               )}
            </div>

            {/* Lifecycle Stats */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
               <div className="flex items-center gap-3">
                 <History className="w-5 h-5 text-primary" />
                 <h3 className="text-[10px] font-black text-secondary uppercase tracking-widest">Maintenance Metrics</h3>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Repairs</p>
                    <p className="text-lg font-black text-secondary">{repairs.length}</p>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Issues</p>
                    <p className="text-lg font-black text-red-500">
                      {repairs.filter(r => r.status !== 'returned' && r.status !== 'completed').length}
                    </p>
                 </div>
               </div>
            </div>
          </div>

          {/* Main Content - History Log */}
          <div className="lg:col-span-2 space-y-8">
             {/* Remarks Card (Main Column) */}
             {(unit.remark || unit.dealerRemark) && (
               <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden space-y-8">
                 <div className="flex items-center gap-4 pb-4 border-b border-slate-50">
                   <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                     <FileText className="w-5 h-5" />
                   </div>
                   <div>
                     <h3 className="text-sm font-black text-secondary uppercase tracking-[0.2em]">Internal & Partner Remarks</h3>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Asset Notes Registry</p>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {unit.remark && (
                     <div className="space-y-3">
                       <span className="text-[10px] font-black text-primary uppercase tracking-widest border-b border-slate-50 pb-2 block">Internal Remark (Admin Notes)</span>
                       <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100/50">
                         <p className="text-xs text-slate-600 font-bold leading-relaxed">{unit.remark}</p>
                       </div>
                     </div>
                   )}

                   {unit.dealerRemark && (
                     <div className="space-y-3">
                       <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest border-b border-slate-50 pb-2 block">Dealer Remark (Partner Notes)</span>
                       <div className="bg-blue-50/20 p-6 rounded-2xl border border-blue-50/50">
                         <p className="text-xs text-slate-600 font-medium leading-relaxed">{unit.dealerRemark}</p>
                       </div>
                     </div>
                   )}
                 </div>
               </div>
             )}

            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm min-h-[600px]">
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/5 text-secondary flex items-center justify-center">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-secondary uppercase tracking-[0.2em]">Maintenance History Log</h3>
                </div>
              </div>

              <div className="space-y-12 relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-4 bottom-4 w-px bg-slate-100" />

                {repairs.length > 0 ? (
                  repairs.map((repair, i) => (
                    <div key={repair.id} className="relative pl-16 group">
                      {/* Timeline Node */}
                      <div className="absolute left-4 top-2 w-4 h-4 rounded-full border-4 border-white bg-slate-200 group-hover:bg-primary group-hover:scale-125 transition-all z-10" />
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                              {new Date(repair.receivedAt).toLocaleDateString()}
                            </span>
                            <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                              repair.status === 'completed' || repair.status === 'returned' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {repair.status.replace('_', ' ')}
                            </span>
                          </div>
                          {repair.dealer && (
                            <div className="flex items-center gap-2">
                              <Users className="w-3 h-3 text-slate-300" />
                              <span className="text-[10px] font-bold text-slate-400">{repair.dealer.name}</span>
                            </div>
                          )}
                        </div>

                        <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-50 group-hover:bg-white group-hover:border-slate-100 group-hover:shadow-sm transition-all">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div>
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                 <AlertTriangle className="w-3 h-3" /> Reported Issue
                               </p>
                               <p className="text-xs font-bold text-secondary leading-relaxed">{repair.issue || 'No specific issue listed'}</p>
                             </div>
                             {repair.solvedRemark && (
                               <div>
                                 <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                   <CheckCircle className="w-3 h-3" /> Resolution Note
                                 </p>
                                 <p className="text-xs font-bold text-slate-500 leading-relaxed italic">"{repair.solvedRemark}"</p>
                               </div>
                             )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-100">
                    <Clock className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">No Maintenance History Found</p>
                    <p className="text-[9px] font-bold text-slate-200 uppercase mt-2">Unit is in perfect technical condition</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Assignment Modal */}
      {isClientModalOpen && (
        <div className="fixed inset-0 bg-secondary/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-10 space-y-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-secondary uppercase tracking-[0.2em]">Unit & Client Registration</h3>
                </div>
                <button onClick={() => setIsClientModalOpen(false)} className="text-slate-300 hover:text-red-500 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Client Full Name</label>
                  <input 
                    type="text" 
                    value={clientForm.clientName}
                    onChange={e => setClientForm({...clientForm, clientName: e.target.value})}
                    className="w-full mt-2 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Enter customer name..."
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Phone Number (Optional)</label>
                  <input 
                    type="text" 
                    value={clientForm.clientPhone}
                    onChange={e => setClientForm({...clientForm, clientPhone: e.target.value})}
                    className="w-full mt-2 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="+91 00000 00000"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Purchase / Assignment Date</label>
                  <input 
                    type="date" 
                    value={clientForm.clientAssignedAt}
                    onChange={e => setClientForm({...clientForm, clientAssignedAt: e.target.value})}
                    className="w-full mt-2 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Warranty Duration Override (Months)</label>
                  <input 
                    type="number" 
                    value={clientForm.warrantyMonthsOverride}
                    onChange={e => setClientForm({...clientForm, warrantyMonthsOverride: e.target.value})}
                    className="w-full mt-2 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Leave blank for default..."
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Internal Remark</label>
                  <textarea 
                    value={clientForm.remark}
                    onChange={e => setClientForm({...clientForm, remark: e.target.value})}
                    className="w-full mt-2 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    placeholder="Enter internal notes/remarks..."
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Dealer Remark</label>
                  <textarea 
                    value={clientForm.dealerRemark}
                    onChange={e => setClientForm({...clientForm, dealerRemark: e.target.value})}
                    className="w-full mt-2 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    placeholder="Enter dealer notes/remarks..."
                    rows={2}
                  />
                </div>
              </div>

              <button
                onClick={handleSaveClient}
                disabled={!clientForm.clientName || isSavingClient}
                className="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSavingClient ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Client Info
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
