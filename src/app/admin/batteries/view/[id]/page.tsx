"use client";

import React, { useEffect, useState, use } from "react";
import { 
  Battery, ArrowLeft, Loader2, Zap, Activity, Shield, 
  Download, Package, MapPin, ExternalLink, AlertTriangle, 
  CheckCircle2, Box, Info, Users, Search
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { BatteryPdfTemplate } from "@/components/ui/BatteryPdfTemplate";

export default function ViewBatteryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [battery, setBattery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unitPage, setUnitPage] = useState(1);
  const [unitSearch, setUnitSearch] = useState("");
  const unitsPerPage = 10;
  const [currentUrl, setCurrentUrl] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const pdfRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentUrl(window.location.origin + "/admin/batteries/view/" + id);
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
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => { if (data?.logo) setLogoUrl(data.logo); })
      .catch(() => {});
  }, [id]);

  const handleDownloadPdf = async () => {
    if (!pdfRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(pdfRef.current, { quality: 1, pixelRatio: 2 });
      const pdf = new jsPDF("l", "mm", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 5;
      const availW = pageWidth - margin * 2;
      const availH = pageHeight - margin * 2;
      const ratio = Math.min(availW / imgProps.width, availH / imgProps.height);
      const imgW = imgProps.width * ratio;
      const imgH = imgProps.height * ratio;
      const x = (pageWidth - imgW) / 2;
      const y = (pageHeight - imgH) / 2;
      pdf.addImage(dataUrl, "PNG", x, y, imgW, imgH);
      pdf.save(`Battery-Spec-${battery.sn}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Decrypting Protocol...</p>
        </div>
      </div>
    );
  }

  if (!battery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm font-bold text-slate-400">System Not Found.</p>
      </div>
    );
  }

  const totalDeployed = battery.assignments?.reduce((acc: number, curr: any) => acc + curr.quantity, 0) || 0;
  const totalFaults = battery.repairs?.reduce((acc: number, curr: any) => acc + curr.quantity, 0) || 0;
  const activeNodes = battery.assignments?.length || 0;

  const specGroups = [
    { title: "Electrical Foundation", icon: Zap, color: "text-amber-500", bg: "bg-amber-50", specs: [
      { label: "Nominal Voltage", value: battery.nominalVoltage },
      { label: "Fully Charged", value: battery.fullyChargedVoltage },
      { label: "Discharge Cut-off", value: battery.dischargeCutOff },
      { label: "Nominal Capacity", value: battery.nominalCapacity },
      { label: "Total Energy", value: battery.totalEnergy },
    ]},
    { title: "Performance Metrics", icon: Activity, color: "text-blue-500", bg: "bg-blue-50", specs: [
      { label: "Avg. Riding Current", value: battery.avgRidingCurrent },
      { label: "Estimated Runtime", value: battery.estRuntime },
      { label: "Estimated Range", value: battery.estRange },
      { label: "Energy Efficiency", value: battery.energyEfficiency },
    ]},
    { title: "System Configuration", icon: Shield, color: "text-emerald-500", bg: "bg-emerald-50", specs: [
      { label: "Cell Configuration", value: battery.cellConfiguration },
      { label: "Motor Compatibility", value: battery.motorCompatibility },
      { label: "Cycle Life", value: battery.cycleLife },
      { label: "Charging Time", value: battery.chargingTime },
      { label: "Warranty Period", value: battery.warrantyMonths ? `${battery.warrantyMonths} Months` : "Not Defined" },
    ]}
  ];

  return (
    <main className="p-8 md:p-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <Link href="/admin/batteries" className="flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-[0.3em] mb-4 hover:translate-x-[-4px] transition-transform w-fit">
              <ArrowLeft className="w-4 h-4" /> Back to Fleet
            </Link>
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-display font-black text-secondary uppercase tracking-tight">
                Model <span className="italic text-primary">{battery.name}</span>
              </h1>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-6 py-4 bg-white border border-slate-100 text-secondary rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 active:scale-[0.98] transition-all shadow-sm flex items-center gap-3 disabled:opacity-50"
            >
              {isDownloading ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Download className="w-4 h-4 text-primary" />}
              Export Specs
            </button>
            <Link href={`/admin/batteries/edit/${battery.id}`} className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20">
              Update Protocol
            </Link>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar: Identity & QR */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden relative group">
              <div className="aspect-square rounded-[2rem] bg-slate-50 overflow-hidden mb-8 border border-slate-100 relative z-10">
                {battery.image ? (
                  <img src={battery.image} alt={battery.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                    <Battery className="w-16 h-16 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No Image Loaded</p>
                  </div>
                )}
              </div>
              <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Type</span>
                  <span className="text-xs font-bold text-secondary uppercase">{battery.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Warranty Period</span>
                  <span className="text-xs font-black text-primary uppercase">
                    {battery.warrantyMonths ? `${battery.warrantyMonths} Months` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Age</span>
                  <span className="text-xs font-bold text-secondary">{new Date(battery.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content: Specs & Logs */}
          <div className="lg:col-span-8 space-y-12">
            {/* Spec Tabs Layout */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
              {specGroups.map((group, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`w-10 h-10 rounded-xl ${group.bg} ${group.color} flex items-center justify-center`}>
                      <group.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-[11px] font-black text-secondary uppercase tracking-[0.2em]">{group.title}</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {group.specs.map((spec, j) => (
                      <div key={j} className="p-4 rounded-2xl bg-slate-50/50 border border-slate-50 group hover:bg-white hover:border-slate-100 hover:shadow-sm transition-all">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{spec.label}</p>
                        <p className="text-xs font-black text-secondary group-hover:text-primary transition-colors">{spec.value || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inventory Units Table - Full Width */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-slate-50 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[11px] font-black text-secondary uppercase tracking-[0.2em]">Inventory Units</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  {battery.units?.length || 0} Units Registered
                </p>
              </div>
            </div>
            
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
              <input 
                type="text"
                placeholder="Search QR Number..."
                value={unitSearch}
                onChange={(e) => {
                  setUnitSearch(e.target.value);
                  setUnitPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {(() => {
            const filteredUnits = (battery.units || []).filter((u: any) => 
              u.qrNumber.toLowerCase().includes(unitSearch.toLowerCase())
            );
            const paginatedUnits = filteredUnits.slice((unitPage - 1) * unitsPerPage, unitPage * unitsPerPage);

            return filteredUnits.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="pb-6 pl-4 text-center">#</th>
                        <th className="pb-6">QR Number</th>
                        <th className="pb-6">Manufacture Date</th>
                        <th className="pb-6 pr-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {paginatedUnits.map((unit: any, index: number) => (
                        <tr key={unit.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-5 pl-4 text-center text-xs font-black text-slate-300">
                            {(unitPage - 1) * unitsPerPage + index + 1}
                          </td>
                          <td className="py-5">
                            <span className="font-display font-black text-primary text-xs tracking-wider">{unit.qrNumber}</span>
                          </td>
                          <td className="py-5">
                            <p className="text-xs font-bold text-slate-500 uppercase">
                              {unit.manufactureDate ? new Date(unit.manufactureDate).toLocaleDateString() : "—"}
                            </p>
                          </td>
                          <td className="py-5 pr-4 text-right">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              unit.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 
                              unit.status === 'faulty' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {unit.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {filteredUnits.length > unitsPerPage && (
                  <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Showing {(unitPage - 1) * unitsPerPage + 1} to {Math.min(unitPage * unitsPerPage, filteredUnits.length)} of {filteredUnits.length}
                    </p>
                    <div className="flex gap-2">
                      <button 
                        disabled={unitPage === 1}
                        onClick={() => setUnitPage(prev => prev - 1)}
                        className="px-6 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary disabled:opacity-50 transition-all"
                      >
                        Previous
                      </button>
                      <button 
                        disabled={unitPage * unitsPerPage >= filteredUnits.length}
                        onClick={() => setUnitPage(prev => prev + 1)}
                        className="px-6 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary disabled:opacity-50 transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 text-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-100">
                <Search className="w-8 h-8 text-slate-200 mx-auto mb-4" />
                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">No matching units found</p>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Hidden PDF Template */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <BatteryPdfTemplate ref={pdfRef} battery={battery} logoUrl={logoUrl} qrUrl={battery.sn} />
      </div>
    </main>
  );
}
