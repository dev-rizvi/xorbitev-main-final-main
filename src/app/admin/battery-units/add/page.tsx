"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader2, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Select from "react-select";

interface Model {
  id: string;
  name: string;
  category: string;
}

interface Supplier {
  id: string;
  name: string;
}

export default function AddBatteryUnitPage() {
  const router = useRouter();
  const [models, setModels] = useState<Model[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [dbDuplicates, setDbDuplicates] = useState<Set<number>>(new Set());
  const [units, setUnits] = useState([
    { qrNumber: "", modelId: "", manufactureDate: "", status: "active", checking: false, supplierId: "", remark: "" }
  ]);

  useEffect(() => {
    fetch("/api/batteries")
      .then(res => res.json())
      .then(data => setModels(Array.isArray(data) ? data : []))
      .catch(() => {});

    fetch("/api/suppliers")
      .then(res => res.json())
      .then(data => setSuppliers(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const addRow = () => {
    setUnits([...units, { 
      qrNumber: "", 
      modelId: units[units.length - 1]?.modelId || "", 
      manufactureDate: "", 
      status: "active",
      checking: false,
      supplierId: units[units.length - 1]?.supplierId || "",
      remark: units[units.length - 1]?.remark || ""
    }]);
  };

  const setDuplicates = (callback: (prev: Set<number>) => Set<number>) => {
    setDbDuplicates(callback);
  };

  const removeRow = (index: number) => {
    if (units.length > 1) {
      setUnits(units.filter((_, i) => i !== index));
      setDuplicates(prev => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }
  };

  const checkDuplicatesLocal = (newUnits: typeof units) => {
    const seenQRs = new Set<string>();
    const localDups = new Set<number>();
    
    newUnits.forEach((u, i) => {
      if (u.qrNumber) {
        if (seenQRs.has(u.qrNumber)) {
          localDups.add(i);
        }
        seenQRs.add(u.qrNumber);
      }
    });

    return localDups;
  };

  const checkQR = async (index: number, qr: string) => {
    if (!qr) {
      setDbDuplicates(prev => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
      return;
    }

    setUnits(prev => prev.map((u, i) => i === index ? { ...u, checking: true } : u));
    try {
      const res = await fetch(`/api/battery-units/check-qr?qr=${qr}`);
      const { exists } = await res.json();
      
      setDbDuplicates(prev => {
        const next = new Set(prev);
        if (exists) next.add(index);
        else next.delete(index);
        return next;
      });
    } catch (err) {} finally {
      setUnits(prev => prev.map((u, i) => i === index ? { ...u, checking: false } : u));
    }
  };

  const updateRow = (index: number, field: string, value: string) => {
    const newUnits = [...units];
    newUnits[index] = { ...newUnits[index], [field]: value };
    setUnits(newUnits);
    
    if (field === "qrNumber") {
      checkQR(index, value);
    }
  };

  const localDuplicates = checkDuplicatesLocal(units);
  const allDuplicates = new Set([...Array.from(dbDuplicates), ...Array.from(localDuplicates)]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (units.some(u => !u.qrNumber || !u.modelId)) {
      setError("Please fill QR Number and Model for all rows");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/battery-units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(units),
      });
      const result = await res.json();
      if (res.status === 409) {
        setError(result.error || "One or more QR Numbers already exist. Please check your entries.");
        setIsLoading(false);
        return;
      }
      if (!res.ok) throw new Error(result.details || "Failed to create");
      router.push("/admin/battery-units");
    } catch (err: any) {
      setError(err.message || "Failed to create battery units. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const modelOptions = models.map(m => ({
    value: m.id,
    label: `${m.name} (${m.category})`
  }));

  const supplierOptions = suppliers.map(s => ({
    value: s.id,
    label: s.name
  }));

  const customSelectStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: '#f8fafc',
      border: '1px solid #f1f5f9',
      borderRadius: '0.75rem',
      padding: '0.125rem 0.25rem',
      fontSize: '0.75rem',
      fontWeight: '700',
      color: '#0a112a',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#0066ff',
      },
    }),
    option: (base: any, state: any) => ({
      ...base,
      fontSize: '0.75rem',
      fontWeight: '700',
      backgroundColor: state.isSelected ? '#0066ff' : state.isFocused ? '#f1f5f9' : 'white',
      color: state.isSelected ? 'white' : '#0a112a',
      '&:active': {
        backgroundColor: '#0066ff',
      },
    }),
  };

  return (
    <main className="p-8 md:p-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <Link href="/admin/battery-units" className="flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-[0.3em] mb-4 hover:translate-x-[-4px] transition-transform w-fit">
              <ArrowLeft className="w-4 h-4" /> Back to Inventory
            </Link>
            <h1 className="text-4xl font-display font-black text-secondary uppercase tracking-tight">
              Add <span className="italic text-primary">Batteries</span>
            </h1>
            <p className="text-slate-400 font-medium mt-1">Register new battery units in bulk</p>
          </div>
          
          <div className="flex gap-3">
             <button 
              onClick={addRow}
              type="button"
              className="bg-white border border-slate-200 text-secondary px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4 inline mr-2" /> Add Manual Row
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs font-bold text-red-600">{error}</div>
          )}

          <div className="grid grid-cols-1 gap-8">
            {units.map((unit, index) => (
              <div key={index} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 relative group">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center text-[10px] font-black">
                      #{index + 1}
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Battery Unit Entry</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeRow(index)}
                    disabled={units.length === 1}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors disabled:opacity-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">QR Number *</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={unit.qrNumber}
                          onChange={(e) => updateRow(index, "qrNumber", e.target.value.toUpperCase())}
                          className={`w-full bg-slate-50 border-none ring-1 focus:ring-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                            allDuplicates.has(index) 
                              ? "ring-red-500 focus:ring-red-500 text-red-600 bg-red-50" 
                              : "ring-slate-100 focus:ring-primary text-secondary"
                          }`}
                          placeholder="SCAN OR TYPE QR..."
                        />
                        {unit.checking && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
                          </div>
                        )}
                        {allDuplicates.has(index) && (
                          <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">Duplicate QR Number</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Battery Model *</label>
                      <Select
                        options={modelOptions}
                        value={modelOptions.find(opt => opt.value === unit.modelId)}
                        onChange={(opt) => updateRow(index, "modelId", opt?.value || "")}
                        styles={customSelectStyles}
                        placeholder="Search model..."
                        instanceId={`model-select-${index}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Operational Status</label>
                      <select
                        value={unit.status}
                        onChange={(e) => updateRow(index, "status", e.target.value)}
                        className="w-full h-[46px] bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary rounded-xl px-4 py-2 text-xs font-bold text-secondary outline-none transition-all appearance-none"
                      >
                        <option value="active">Active & Ready</option>
                        <option value="faulty">Faulty / Needs Check</option>
                        <option value="retired">Retired / End of Life</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Manufacture Date</label>
                      <input
                        type="date"
                        value={unit.manufactureDate}
                        onChange={(e) => updateRow(index, "manufactureDate", e.target.value)}
                        className="w-full bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary rounded-xl px-4 py-3 text-xs font-bold text-secondary"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Internal Remark</label>
                      <input
                        type="text"
                        value={unit.remark}
                        onChange={(e) => updateRow(index, "remark", e.target.value)}
                        className="w-full bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary rounded-xl px-4 py-3 text-xs font-bold text-secondary"
                        placeholder="Quality notes..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Supplier Selection</label>
                      <Select
                        options={supplierOptions}
                        value={supplierOptions.find(opt => opt.value === unit.supplierId)}
                        onChange={(opt) => updateRow(index, "supplierId", opt?.value || "")}
                        styles={customSelectStyles}
                        placeholder="Select..."
                        instanceId={`supplier-select-${index}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading || allDuplicates.size > 0}
              className="px-12 flex items-center justify-center gap-3 bg-primary text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isLoading ? "Saving Units..." : `Save ${units.length} Units`}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
