"use client";

import React, { useEffect, useState, use } from "react";
import { Battery, LayoutDashboard, Settings, Users, LogOut, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BatteryForm } from "@/components/ui/BatteryForm";

export default function EditBatteryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [battery, setBattery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/batteries/${id}`)
      .then(res => res.json())
      .then(data => {
        setBattery(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  return (
    <main className="p-8 md:p-12 overflow-y-auto">
      <div className="w-full space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <Link href="/admin/batteries" className="flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-[0.3em] mb-4 hover:translate-x-[-4px] transition-transform">
              <ArrowLeft className="w-4 h-4" /> Back to Fleet
            </Link>
            <h1 className="text-4xl font-display font-black text-secondary uppercase tracking-tight">
              Modify <span className="italic text-primary">Protocol</span>
            </h1>
            <p className="text-slate-400 font-medium mt-1">System Identification: {battery?.sn || "..."}</p>
          </div>
        </div>

        {loading ? (
          <div className="bg-white p-20 rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-sm font-bold text-slate-400">Fetching System Data...</p>
          </div>
        ) : battery ? (
          <BatteryForm initialData={battery} isEditing={true} />
        ) : (
          <div className="bg-white p-20 rounded-[3rem] border border-slate-100 text-center">
            <p className="text-sm font-bold text-slate-400">System Not Found.</p>
          </div>
        )}
      </div>
    </main>
  );
}
