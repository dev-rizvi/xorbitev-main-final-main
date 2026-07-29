"use client";

import React from "react";
import { Battery, LayoutDashboard, Settings, Users, LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BatteryForm } from "@/components/ui/BatteryForm";

export default function AddBatteryPage() {
  return (
    <main className="p-8 md:p-12">
      <div className="w-full space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <Link href="/admin/batteries" className="flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-[0.3em] mb-4 hover:translate-x-[-4px] transition-transform">
              <ArrowLeft className="w-4 h-4" /> Back to Fleet
            </Link>
            <h1 className="text-4xl font-display font-black text-secondary uppercase tracking-tight">
              Initialize <span className="italic text-primary">New System</span>
            </h1>
            <p className="text-slate-400 font-medium mt-1">Industrial Intelligence Terminal • v1.0.4</p>
          </div>
        </div>

        <BatteryForm />
      </div>
    </main>
  );
}
