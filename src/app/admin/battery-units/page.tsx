"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Eye, Filter, Loader2, Battery, Calendar, Users, Info, ShieldCheck, User, QrCode, X, Download, Building2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

interface BatteryUnit {
  id: string;
  qrNumber: string;
  modelId: string;
  dealerId?: string;
  manufactureDate: string;
  assignedAt?: string;
  status: string;
  createdAt: string;
  model: {
    id: string;
    name: string;
    category: string;
    nominalVoltage: string;
    nominalCapacity: string;
    warrantyMonths?: number;
  };
  dealer?: {
    id: string;
    name: string;
  };
  clientName?: string;
  clientPhone?: string;
  clientAssignedAt?: string;
  warrantyMonthsOverride?: number;
  supplier?: {
    id: string;
    name: string;
  };
}

export default function BatteryUnitsPage() {
  const [units, setUnits] = useState<BatteryUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [qrModal, setQrModal] = useState<{ isOpen: boolean; qr: string } | null>(null);
  const baseUrl = "https://xorbitev.com";

  const fetchUnits = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/battery-units");
      const data = await res.json();
      setUnits(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this battery unit?")) {
      try {
        await fetch(`/api/battery-units/${id}`, { method: "DELETE" });
        fetchUnits();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const filteredUnits = units.filter(u => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      (u.qrNumber?.toLowerCase() || "").includes(searchLower) ||
      (u.model?.name?.toLowerCase() || "").includes(searchLower) ||
      (u.dealer?.name?.toLowerCase() || "").includes(searchLower);
    
    const matchesStatus = filterStatus === "All" || u.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUnits = filteredUnits.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, filterStatus]);

  const statusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-50 text-emerald-600";
      case "faulty": return "bg-red-50 text-red-600";
      case "retired": return "bg-slate-100 text-slate-500";
      default: return "bg-slate-50 text-slate-400";
    }
  };

  return (
    <main className="p-8 md:p-12">
      <div className="w-full space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-display font-black text-secondary uppercase tracking-tight">
              Battery <span className="italic text-primary">Inventory</span>
            </h1>
            <p className="text-slate-400 font-medium mt-1">Track individual battery units with QR numbers</p>
          </div>
          
          <Link 
            href="/admin/battery-units/add"
            className="bg-primary text-white px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-5 h-5" /> Add Battery
          </Link>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="relative flex-1 max-md:w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="text" 
                  placeholder="Search by QR Number, Model, or Dealer..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="flex items-center gap-4">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  Showing {paginatedUnits.length} of {filteredUnits.length} Units
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">#</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">QR Number</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Model</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vendor</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lifecycle</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-20 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Batteries...</p>
                    </td>
                  </tr>
                ) : paginatedUnits.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-20 text-center">
                      <Battery className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Battery Units Found</p>
                    </td>
                  </tr>
                ) : paginatedUnits.map((unit, index) => (
                    <tr key={unit.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6 text-center">
                        <span className="text-xs font-black text-slate-300">{startIndex + index + 1}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-display font-black text-primary text-xs tracking-wider">{unit.qrNumber}</span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-secondary text-sm">{unit.model?.name || "—"}</p>
                        <div className="flex flex-col gap-1 mt-1">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{unit.model?.category}</p>
                          {unit.supplier && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <Building2 className="w-3 h-3 text-primary/60" />
                              <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                                Supplier: {unit.supplier.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {unit.dealer ? (
                          <div className="flex items-center gap-2">
                             <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                <Users className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <p className="text-xs font-black text-secondary uppercase tracking-tight">{unit.dealer.name}</p>
                                {unit.assignedAt && unit.model?.warrantyMonths ? (() => {
                                  const assignDate = new Date(unit.assignedAt);
                                  const expiryDate = new Date(assignDate);
                                  const warrantyDuration = unit.warrantyMonthsOverride || unit.model?.warrantyMonths || 0;
                                  expiryDate.setMonth(expiryDate.getMonth() + warrantyDuration);
                                  expiryDate.setDate(expiryDate.getDate() + 60);
                                  
                                  const diffDays = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                  const isExpired = diffDays <= 0;
                                  
                                  return (
                                    <div className="flex flex-col">
                                      <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic">
                                        Assigned: {new Date(unit.assignedAt).toLocaleDateString()}
                                      </p>
                                      <p className={`text-[9px] font-black uppercase tracking-widest ${isExpired ? 'text-red-500' : 'text-primary'}`}>
                                        {isExpired ? 'Warranty Expired' : `${diffDays} Days Warranty`}
                                      </p>
                                    </div>
                                  );
                                })() : (
                                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic">Authorized Partner</p>
                                )}
                              </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 opacity-40">
                             <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                <Users className="w-3.5 h-3.5" />
                              </div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">XORBIT EV</p>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-4">
                          {unit.clientName ? (
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                                <User className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <p className="text-xs font-black text-secondary uppercase tracking-tight">{unit.clientName}</p>
                                {unit.clientAssignedAt && unit.model?.warrantyMonths ? (() => {
                                  const purchaseDate = new Date(unit.clientAssignedAt);
                                  const expiryDate = new Date(purchaseDate);
                                  const warrantyDuration = unit.warrantyMonthsOverride || unit.model?.warrantyMonths || 0;
                                  expiryDate.setMonth(expiryDate.getMonth() + warrantyDuration);
                                  const diffDays = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                  const isExpired = diffDays <= 0;
                                  return (
                                    <p className={`text-[9px] font-black uppercase tracking-widest ${isExpired ? 'text-red-500' : 'text-emerald-500'}`}>
                                      {isExpired ? 'Warranty Expired' : `${diffDays} Days Left`}
                                    </p>
                                  );
                                })() : (
                                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">No Warranty Data</p>
                                )}
                              </div>
                            </div>
                          ) : unit.dealer ? (
                            <Link href={`/admin/dealers/view/${unit.dealer.id}`} className="flex items-center gap-2 group/link">
                              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                <Users className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <p className="text-xs font-black text-secondary group-hover/link:text-primary transition-colors">{unit.dealer.name}</p>
                                {unit.assignedAt && unit.model?.warrantyMonths ? (() => {
                                  const assignDate = new Date(unit.assignedAt);
                                  const expiryDate = new Date(assignDate);
                                  const warrantyDuration = unit.warrantyMonthsOverride || unit.model?.warrantyMonths || 0;
                                  expiryDate.setMonth(expiryDate.getMonth() + warrantyDuration);
                                  expiryDate.setDate(expiryDate.getDate() + 60); // 60 Days Buffer for Dealer
                                  
                                  const diffDays = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                  const isExpired = diffDays <= 0;
                                  
                                  return (
                                    <p className={`text-[9px] font-black uppercase tracking-widest ${isExpired ? 'text-red-500' : 'text-blue-500'}`}>
                                      {isExpired ? 'Dealer Warranty Expired' : `Dealer: ${diffDays} Days Left`}
                                    </p>
                                  );
                                })() : (
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Partner Assigned</p>
                                )}
                              </div>
                            </Link>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300">
                                <Info className="w-3.5 h-3.5" />
                              </div>
                              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">In Stock</p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColor(unit.status)}`}>
                          {unit.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setQrModal({ isOpen: true, qr: unit.qrNumber })}
                            className="p-3 rounded-xl hover:bg-white hover:shadow-md text-slate-400 hover:text-primary transition-all"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                          <Link href={`/admin/battery-units/view/${unit.id}`} className="p-3 rounded-xl hover:bg-white hover:shadow-md text-slate-400 hover:text-primary transition-all">
                            <Eye className="w-4 h-4" />
                          </Link>
                          {unit.dealer ? (
                            <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <ShieldCheck className="w-3 h-3" /> Locked
                            </div>
                          ) : (
                            <>
                              <Link href={`/admin/battery-units/edit/${unit.id}`} className="p-3 rounded-xl hover:bg-white hover:shadow-md text-slate-400 hover:text-primary transition-all">
                                <Edit2 className="w-4 h-4" />
                              </Link>
                              <button onClick={() => handleDelete(unit.id)} className="p-3 rounded-xl hover:bg-white hover:shadow-md text-slate-400 hover:text-red-500 transition-all">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
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

      {/* QR Code Modal */}
      {qrModal?.isOpen && (
        <div className="fixed inset-0 bg-secondary/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-10 space-y-8 flex flex-col items-center">
              <div className="w-full flex justify-between items-center">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Visual QR Identity</p>
                <button onClick={() => setQrModal(null)} className="text-slate-300 hover:text-red-500 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 bg-white border-4 border-slate-50 rounded-[2.5rem] shadow-inner">
                <QRCodeSVG 
                  value={`${baseUrl}/warranty?qr=${qrModal.qr}`} 
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="text-center space-y-2">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">QR Signature</p>
                <h4 className="text-xl font-black text-secondary tracking-tight">{qrModal.qr}</h4>
              </div>

              <button 
                onClick={() => window.print()}
                className="w-full py-5 bg-secondary text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all"
              >
                <Download className="w-4 h-4" /> Print Label
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
