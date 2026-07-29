"use client";

import React, { useEffect, useState, use } from "react";
import { 
  Wrench, ArrowLeft, Loader2, Package, User, 
  Calendar, Activity, CheckCircle, Clock, 
  AlertTriangle, Settings2, FileText, Battery,
  Phone, Building2, Shield, Zap
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ViewRepairPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [repair, setRepair] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/repairs/${id}?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        setRepair(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Accessing Repair Data...</p>
        </div>
      </div>
    );
  }

  if (!repair) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm font-bold text-slate-400">Repair Ticket Not Found.</p>
      </div>
    );
  }

  return (
    <main className="p-8 md:p-12 overflow-y-auto bg-slate-50 min-h-screen">
      <div className="w-full space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <Link href="/admin/repairs" className="flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-[0.3em] mb-4 hover:translate-x-[-4px] transition-transform">
              <ArrowLeft className="w-4 h-4" /> Back to Registry
            </Link>
            <h1 className="text-4xl font-display font-black text-secondary uppercase tracking-tight">
              Service <span className="italic text-primary">Intelligence</span>
            </h1>
            <p className="text-slate-400 font-medium mt-1">Ticket ID: {repair.id.substring(0, 8)} • Maintenance Record</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Basic Info & Status */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-8">
                  <Wrench className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-secondary tracking-tight mb-2">Repair Status</h2>
                <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase ${repair.status === 'completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-orange-500'}`}>
                  {repair.status === 'completed' ? 'Solved' : repair.status}
                </span>

                <div className="mt-10 space-y-6">
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Received Date</p>
                      <p className="text-sm font-bold text-secondary">{new Date(repair.receivedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {repair.solvedAt && (
                    <div className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Resolution Date</p>
                        <p className="text-sm font-bold text-secondary">{new Date(repair.solvedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-10 pt-10 border-t border-slate-50">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Linked Assets</p>
                   <div className="space-y-4">
                      {repair.battery && (
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <Package className="w-4 h-4 text-primary" />
                               <span className="text-sm font-bold text-secondary">{repair.battery.sn} (Model)</span>
                            </div>
                            <Link href={`/admin/batteries/view/${repair.battery.id}`} className="text-primary"><Settings2 className="w-4 h-4" /></Link>
                         </div>
                      )}
                      {repair.qrNumber && (
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <Battery className="w-4 h-4 text-primary" />
                               <span className="text-sm font-bold text-secondary">{repair.qrNumber} (Unit)</span>
                            </div>
                            {repair.batteryUnit ? (
                               <Link href={`/admin/battery-units/view/${repair.batteryUnit.id}`} className="text-primary"><Settings2 className="w-4 h-4" /></Link>
                            ) : (
                               <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Unregistered</span>
                            )}
                         </div>
                      )}
                      {repair.dealer && (
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <User className="w-4 h-4 text-primary" />
                               <span className="text-sm font-bold text-secondary">{repair.dealer.name}</span>
                            </div>
                            <Link href={`/admin/dealers/view/${repair.dealer.id}`} className="text-primary"><Settings2 className="w-4 h-4" /></Link>
                         </div>
                      )}
                   </div>
                </div>
              </div>
            </div>

            {/* Battery Model Specs Card */}
            {repair.battery && (
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-50 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Model Specifications</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{repair.battery.sn}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-50/50">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Model Name</span>
                    <span className="text-xs font-black text-secondary">{repair.battery.name || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-50/50">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nominal Voltage</span>
                    <span className="text-xs font-bold text-secondary">{repair.battery.nominalVoltage || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-50/50">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nominal Capacity</span>
                    <span className="text-xs font-bold text-secondary">{repair.battery.nominalCapacity ? `${repair.battery.nominalCapacity}Ah` : '—'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-50/50">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Energy</span>
                    <span className="text-xs font-bold text-secondary">{repair.battery.totalEnergy || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-50/50">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cell Config</span>
                    <span className="text-xs font-bold text-secondary">{repair.battery.cellConfiguration || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-50/50">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Est. Range</span>
                    <span className="text-xs font-bold text-secondary">{repair.battery.estRange ? `${repair.battery.estRange} km` : '—'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-50/50">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cycle Life</span>
                    <span className="text-xs font-bold text-secondary">{repair.battery.cycleLife || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Charging Time</span>
                    <span className="text-xs font-bold text-secondary">{repair.battery.chargingTime || '—'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Detailed Remarks & Asset Lifecycle */}
          <div className="lg:col-span-2 space-y-12">
            {repair.batteryUnit && (
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden space-y-8">
                <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Battery className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-secondary uppercase tracking-[0.2em]">Battery Unit Lifecycle</h3>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">QR: {repair.batteryUnit.qrNumber}</p>
                    </div>
                  </div>
                  <Link 
                    href={`/admin/battery-units/view/${repair.batteryUnit.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-primary rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                  >
                    Full History <Settings2 className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Column 1: Technical specs / status */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Technical Info</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Operational Status</span>
                        <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mt-1 ${
                          repair.batteryUnit.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 
                          repair.batteryUnit.status === 'faulty' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {repair.batteryUnit.status}
                        </span>
                      </div>
                      {repair.batteryUnit.manufactureDate && (
                        <div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Manufacture Date</span>
                          <span className="text-xs font-bold text-secondary">{new Date(repair.batteryUnit.manufactureDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {repair.batteryUnit.supplier && (
                        <div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Supplier Selection</span>
                          <span className="text-xs font-bold text-secondary flex items-center gap-1.5 mt-0.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {repair.batteryUnit.supplier.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Column 2: Customer details */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">End User Profile</h4>
                    {repair.batteryUnit.clientName ? (
                      <div className="space-y-3">
                        <div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Customer Name</span>
                          <span className="text-sm font-black text-secondary">{repair.batteryUnit.clientName}</span>
                        </div>
                        {repair.batteryUnit.clientPhone && (
                          <div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Phone</span>
                            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              {repair.batteryUnit.clientPhone}
                            </span>
                          </div>
                        )}
                        {repair.batteryUnit.clientAssignedAt && (
                          <div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Purchase Date</span>
                            <span className="text-xs font-bold text-secondary">{new Date(repair.batteryUnit.clientAssignedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center py-4 text-center">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">No client details assigned</p>
                      </div>
                    )}
                  </div>

                  {/* Column 3: Warranty analysis */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Warranty Analysis</h4>
                    {repair.batteryUnit.clientAssignedAt && repair.batteryUnit.model?.warrantyMonths ? (() => {
                      const purchaseDate = new Date(repair.batteryUnit.clientAssignedAt);
                      const expiryDate = new Date(purchaseDate);
                      const warrantyDuration = repair.batteryUnit.warrantyMonthsOverride || repair.batteryUnit.model?.warrantyMonths || 0;
                      expiryDate.setMonth(expiryDate.getMonth() + warrantyDuration);
                      
                      const today = new Date();
                      const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      const isExpired = diffDays <= 0;

                      return (
                        <div className="space-y-3">
                          <div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Status</span>
                            <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mt-1 ${
                              isExpired ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                            }`}>
                              {isExpired ? 'Expired' : 'Active'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Expiration Date</span>
                            <span className="text-xs font-bold text-secondary">{expiryDate.toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Timeline</span>
                            <p className={`text-xs font-black uppercase tracking-widest mt-0.5 ${isExpired ? 'text-red-500' : 'text-emerald-600'}`}>
                              {isExpired ? 'Expired' : `${diffDays} Days Left`}
                            </p>
                          </div>
                        </div>
                      );
                    })() : (
                      <div className="h-full flex items-center justify-center py-4 text-center">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">Warranty not active</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional remarks if any */}
                {(repair.batteryUnit.remark || repair.batteryUnit.dealerRemark) && (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {repair.batteryUnit.remark && (
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Internal Remark</span>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">{repair.batteryUnit.remark}</p>
                      </div>
                    )}
                    {repair.batteryUnit.dealerRemark && (
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Dealer Remark</span>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">{repair.batteryUnit.dealerRemark}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="flex items-center gap-4 mb-10 pb-4 border-b border-slate-50">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-primary flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-secondary uppercase tracking-[0.2em]">Maintenance Reports</h3>
               </div>

               <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-orange-500">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Problem Remarks (Dealer Reported)</span>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                      <p className="text-slate-600 font-medium leading-relaxed">
                        {repair.problemRemark || "No detailed remarks provided at entry."}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-500">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Resolution Remarks (Engineer Notes)</span>
                    </div>
                    <div className="bg-emerald-50/30 p-8 rounded-[2rem] border border-emerald-100">
                      <p className="text-slate-600 font-medium leading-relaxed">
                        {repair.solvedRemark || (repair.status === 'completed' ? "Solved without additional notes." : "Resolution pending...")}
                      </p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
