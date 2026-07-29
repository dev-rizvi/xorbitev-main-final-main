"use client";

import React, { useEffect, useState, use } from "react";
import { 
  ArrowLeft, MapPin, Phone, Mail, Package, 
  Wrench, History, ExternalLink, Battery, 
  ShieldCheck, Loader2, Plus, Calendar, Search,
  Trash2
} from "lucide-react";
import Link from "next/link";

interface Dealer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  createdAt: string;
  assignedUnits: any[];
  repairs: any[];
}

export default function DealerViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchDealer = () => {
    fetch(`/api/dealers/${id}`)
      .then(res => res.json())
      .then(data => {
        setDealer(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchDealer();
  }, [id]);

  const handleDeleteUnit = async (unitId: string) => {
    if (confirm("Are you sure you want to remove this battery unit from the dealer? This will return the unit to general stock.")) {
      try {
        const res = await fetch(`/api/battery-units/${unitId}/unassign`, {
          method: "POST",
        });
        if (res.ok) {
          fetchDealer();
        } else {
          const errData = await res.json();
          alert(errData.error || "Failed to remove unit");
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred while removing the unit");
      }
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!dealer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-400 font-bold uppercase tracking-widest">Partner Not Found</p>
      </div>
    );
  }

  const filteredUnits = (dealer.assignedUnits || []).filter(u => 
    u.qrNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.model?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);
  const paginatedUnits = filteredUnits.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="p-8 md:p-12 bg-slate-50 min-h-screen">
      <div className="w-full space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <Link href="/admin/dealers" className="flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-[0.3em] mb-4 hover:translate-x-[-4px] transition-transform w-fit">
              <ArrowLeft className="w-4 h-4" /> Back to Network
            </Link>
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-display font-black text-secondary uppercase tracking-tight">
                Partner <span className="italic text-primary">Profile</span>
              </h1>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${dealer.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                {dealer.status}
              </span>
            </div>
          </div>
          
          <Link 
            href={`/admin/dealers/view/${id}/assign`}
            className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-5 h-5" /> Deploy Inventory
          </Link>
        </div>

        <div className="flex flex-col gap-12">
          {/* Partner Info Section */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="flex items-center gap-6 shrink-0">
                <div className="w-20 h-20 rounded-[2.5rem] bg-secondary text-white flex items-center justify-center text-3xl font-black shadow-xl shadow-secondary/10">
                  {dealer.name.substring(0, 1)}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-secondary tracking-tight">{dealer.name}</h3>
                  <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] mt-1">Authorized Partner Profile</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 flex-1 pt-8 md:pt-0 md:pl-12 md:border-l border-slate-50">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Email Address</p>
                    <p className="text-sm font-bold text-secondary truncate">{dealer.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Contact Phone</p>
                    <p className="text-sm font-bold text-secondary">{dealer.phone || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Location</p>
                    <p className="text-sm font-bold text-secondary leading-tight">{dealer.address || 'No Address'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Member Since</p>
                    <p className="text-sm font-bold text-secondary">{new Date(dealer.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deployed Units Section */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-secondary uppercase tracking-[0.2em]">Deployed Units</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Inventory under Partner Control</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-6 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="text" 
                    placeholder="Search QR or Model..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
                <div className="text-right shrink-0">
                  <p className="text-3xl font-display font-black text-secondary italic leading-none">{dealer.assignedUnits?.length || 0}</p>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Total Active</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto overflow-hidden rounded-3xl border border-slate-50">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">#</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">QR Number</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Model System</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Specifications</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Deployed On</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Warranty Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedUnits.length > 0 ? (
                    paginatedUnits.map((unit: any, index: number) => (
                      <tr key={unit.id} className="group hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4 text-[10px] font-black text-slate-300">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-black text-primary uppercase tracking-wider">{unit.qrNumber}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-bold text-secondary">{unit.model?.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{unit.model?.category}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-[10px] font-bold text-slate-500">{unit.model?.nominalVoltage}V / {unit.model?.nominalCapacity}Ah</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <p className="text-xs font-bold text-secondary">{unit.assignedAt ? new Date(unit.assignedAt).toLocaleDateString() : 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4">
                          {unit.assignedAt && unit.model?.warrantyMonths ? (() => {
                            const assignDate = new Date(unit.assignedAt);
                            const expiryDate = new Date(assignDate);
                            const warrantyDuration = unit.warrantyMonthsOverride || unit.model?.warrantyMonths || 0;
                            expiryDate.setMonth(expiryDate.getMonth() + warrantyDuration);
                            expiryDate.setDate(expiryDate.getDate() + 60);
                            
                            const diffDays = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                            const isExpired = diffDays <= 0;
                            
                            return (
                              <p className={`text-[10px] font-black uppercase tracking-widest ${isExpired ? 'text-red-500' : 'text-blue-500'}`}>
                                {isExpired ? 'Expired' : `${diffDays} Days Left`}
                              </p>
                            );
                          })() : (
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">N/A</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/battery-units/view/${unit.id}`} className="inline-flex p-2 rounded-lg bg-slate-50 text-slate-300 hover:text-primary transition-colors" title="View Details">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteUnit(unit.id)}
                              className="inline-flex p-2 rounded-lg bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                              title="Remove/Unassign Unit"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center bg-slate-50/50 border border-dashed border-slate-200">
                        <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">No matching units found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="px-6 py-2 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:bg-white border border-transparent hover:border-slate-100 disabled:opacity-50 transition-all"
                  >
                    Previous
                  </button>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-6 py-2 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:bg-white border border-transparent hover:border-slate-100 disabled:opacity-50 transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
