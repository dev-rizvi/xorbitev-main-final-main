"use client";

import React, { useState, useEffect, use } from "react";
import { ArrowLeft, Loader2, Save, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Model {
  id: string;
  name: string;
  category: string;
}

export default function EditBatteryUnitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [assignedTo, setAssignedTo] = useState<string | null>(null);
  const [form, setForm] = useState({
    qrNumber: "",
    modelId: "",
    manufactureDate: "",
    status: "active",
    remark: "",
    supplierId: ""
  });
  const [suppliers, setSuppliers] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/batteries").then(r => r.json()),
      fetch(`/api/battery-units/${id}`).then(r => r.json()),
      fetch("/api/suppliers").then(r => r.json()),
    ]).then(([modelsData, unitData, suppliersData]) => {
      setModels(Array.isArray(modelsData) ? modelsData : []);
      setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
      if (unitData && !unitData.error) {
        setForm({
          qrNumber: unitData.qrNumber || "",
          modelId: unitData.modelId || "",
          manufactureDate: unitData.manufactureDate ? new Date(unitData.manufactureDate).toISOString().split("T")[0] : "",
          status: unitData.status || "active",
          remark: unitData.remark || "",
          supplierId: unitData.supplierId || ""
        });
        if (unitData.dealerId) {
          setIsLocked(true);
          setAssignedTo(unitData.dealer?.name || "Partner");
        }
      }
    }).catch(console.error).finally(() => setIsFetching(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/battery-units/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 409) {
        setError("QR Number already exists. Please use a unique number.");
        setIsLoading(false);
        return;
      }
      if (!res.ok) throw new Error("Failed to update");
      router.push("/admin/battery-units");
    } catch (err) {
      setError("Failed to update battery unit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="p-8 md:p-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <Link href="/admin/battery-units" className="flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-[0.3em] mb-4 hover:translate-x-[-4px] transition-transform w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Inventory
          </Link>
          <h1 className="text-4xl font-display font-black text-secondary uppercase tracking-tight">
            Edit <span className="italic text-primary">Battery</span>
          </h1>
          <p className="text-slate-400 font-medium mt-1">Update battery unit details</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8 relative">
          {isLocked && (
            <div className="p-6 bg-amber-50 border border-amber-100 rounded-[2rem] flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black text-amber-900 uppercase tracking-widest">Inventory Record Locked</p>
                <p className="text-[11px] font-bold text-amber-700 mt-1 leading-relaxed">
                  This battery unit is currently assigned to <span className="underline decoration-2">{assignedTo}</span>. 
                  Individual unit records cannot be modified once distributed for field operations.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs font-bold text-red-600">{error}</div>
          )}

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${isLocked ? 'opacity-50 pointer-events-none' : ''}`}>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2 ml-1">QR Number *</label>
              <input
                type="text"
                required
                disabled={isLocked}
                value={form.qrNumber}
                onChange={(e) => setForm({ ...form, qrNumber: e.target.value.toUpperCase() })}
                className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary rounded-2xl px-5 py-4 font-bold text-secondary placeholder:text-slate-300 transition-all"
                placeholder="e.g. XOR1"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2 ml-1">Battery Model *</label>
              <select
                required
                disabled={isLocked}
                value={form.modelId}
                onChange={(e) => setForm({ ...form, modelId: e.target.value })}
                className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary rounded-2xl px-5 py-4 font-bold text-secondary transition-all"
              >
                <option value="">Select a model...</option>
                {models.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} — {m.category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2 ml-1">Manufacture Date</label>
              <input
                type="date"
                disabled={isLocked}
                value={form.manufactureDate}
                onChange={(e) => setForm({ ...form, manufactureDate: e.target.value })}
                className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary rounded-2xl px-5 py-4 font-bold text-secondary transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2 ml-1">Operational Status</label>
              <select
                disabled={isLocked}
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary rounded-2xl px-5 py-4 font-bold text-secondary transition-all outline-none"
              >
                <option value="active">Active & Ready</option>
                <option value="faulty">Faulty / Needs Check</option>
                <option value="retired">Retired / End of Life</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2 ml-1">Internal Remark</label>
              <input
                type="text"
                disabled={isLocked}
                value={form.remark}
                onChange={(e) => setForm({ ...form, remark: e.target.value })}
                className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary rounded-2xl px-5 py-4 font-bold text-secondary placeholder:text-slate-300 transition-all outline-none"
                placeholder="Quality notes..."
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2 ml-1">Supplier Selection</label>
              <select
                disabled={isLocked}
                value={form.supplierId}
                onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
                className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary rounded-2xl px-5 py-4 font-bold text-secondary transition-all outline-none"
              >
                <option value="">Select a supplier...</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            {!isLocked ? (
              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto px-12 flex items-center justify-center gap-3 bg-primary text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {isLoading ? "Updating..." : "Update Battery"}
              </button>
            ) : (
              <div className="flex items-center gap-3 px-8 py-4 bg-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <ShieldCheck className="w-5 h-5" /> Immutable field record
              </div>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
