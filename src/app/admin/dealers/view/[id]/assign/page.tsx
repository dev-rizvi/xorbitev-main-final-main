"use client";

import React, { useEffect, useState, use } from "react";
import { 
  ArrowLeft, Search, Check, Save, Loader2, Battery, Users, Package, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AssignUnitsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [dealer, setDealer] = useState<any>(null);
  const [availableUnits, setAvailableUnits] = useState<any[]>([]);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [assignedAt, setAssignedAt] = useState(new Date().toISOString().split('T')[0]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/dealers/${id}`).then(res => res.json()),
      fetch('/api/battery-units').then(res => res.json())
    ]).then(([dealerData, unitsData]) => {
      setDealer(dealerData);
      const available = (unitsData || []).filter((u: any) => !u.dealerId);
      setAvailableUnits(available);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  const handleAssign = async () => {
    if (selectedUnits.length === 0) return;
    setIsAssigning(true);
    try {
      const res = await fetch('/api/battery-units/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitIds: selectedUnits,
          dealerId: id,
          assignedAt: assignedAt
        })
      });
      if (res.ok) {
        router.push(`/admin/dealers/view/${id}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const filteredUnits = availableUnits.filter(u => 
    u.qrNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.model.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="p-8 md:p-12 bg-slate-50 min-h-screen">
      <div className="w-full space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <Link href={`/admin/dealers/view/${id}`} className="flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-[0.3em] mb-4 hover:translate-x-[-4px] transition-transform w-fit">
              <ArrowLeft className="w-4 h-4" /> Back to Partner Profile
            </Link>
            <h1 className="text-4xl font-display font-black text-secondary uppercase tracking-tight">
              Inventory <span className="italic text-primary">Deployment</span>
            </h1>
            <p className="text-slate-400 font-medium mt-1">Assigning units to: <span className="text-secondary font-bold">{dealer?.name}</span></p>
          </div>

          <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Partner</p>
              <p className="text-xs font-bold text-secondary">{dealer?.name}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-primary flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-secondary uppercase tracking-[0.2em]">Available Master Stock</h3>
                </div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{filteredUnits.length} Units Found</p>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="text"
                  placeholder="Search QR Number or Model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredUnits.length > 0 ? (
                  filteredUnits.map((unit) => (
                    <div 
                      key={unit.id}
                      onClick={() => {
                        if (selectedUnits.includes(unit.id)) {
                          setSelectedUnits(selectedUnits.filter(id => id !== unit.id));
                        } else {
                          setSelectedUnits([...selectedUnits, unit.id]);
                        }
                      }}
                      className={`p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between group ${
                        selectedUnits.includes(unit.id) 
                        ? 'bg-primary/5 border-primary shadow-sm' 
                        : 'bg-white border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                          selectedUnits.includes(unit.id) ? 'bg-primary text-white' : 'bg-slate-50 text-slate-300 group-hover:bg-slate-100'
                        }`}>
                          <Battery className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-secondary uppercase tracking-tight">{unit.qrNumber}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{unit.model.name}</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${
                        selectedUnits.includes(unit.id) ? 'bg-primary border-primary text-white' : 'border-slate-100 bg-slate-50'
                      }`}>
                        {selectedUnits.includes(unit.id) && <Check className="w-4 h-4" />}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                    <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">No matching units in stock</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm sticky top-8">
              <h3 className="text-sm font-black text-secondary uppercase tracking-[0.2em] mb-8 pb-4 border-b border-slate-50">Deployment Summary</h3>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Units</p>
                  <p className="text-sm font-black text-primary">{selectedUnits.length}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Partner Name</p>
                  <p className="text-xs font-bold text-secondary text-right">{dealer?.name}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assignment Type</p>
                  <p className="text-[9px] px-2 py-1 bg-blue-50 text-blue-500 rounded font-black uppercase">Standard Deployment</p>
                </div>
                
                <div className="pt-4 border-t border-slate-50">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Deployment Date</label>
                  <input 
                    type="date"
                    value={assignedAt}
                    onChange={(e) => setAssignedAt(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-primary/10 outline-none"
                  />
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl mb-10 flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                  Assigned units will be locked in master inventory and cannot be edited until returned.
                </p>
              </div>

              <button
                disabled={selectedUnits.length === 0 || isAssigning}
                onClick={handleAssign}
                className="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
              >
                {isAssigning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {isAssigning ? 'Deploying...' : 'Confirm Deployment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
