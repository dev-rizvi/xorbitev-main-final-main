"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, QrCode, Search, CheckCircle2, AlertCircle, Battery, Calendar, Zap, Activity, Info, Users, Wrench, Clock, Download } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

import { PageHero } from "@/components/ui/PageHero";

export default function VerifyPage() {
  const [activeTab, setActiveTab] = useState<"serial" | "qr">("serial");
  const [serialNumber, setSerialNumber] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<null | "success" | "error">(null);
  const [batteryData, setBatteryData] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  // Dual Warranty Calculations
  const hasEndUser = !!batteryData?.clientName && !!batteryData?.clientAssignedAt;
  const hasDealer = !!batteryData?.dealerName && !!batteryData?.dealerAssignedAt;

  let warrantyStartDate = null;
  let warrantyLabel = "Not Activated";
  let ownerName = "Awaiting Registration";
  let isExpired = false;
  let diffDays = 0;
  let validUntilDate = "N/A";
  let purchaseDateString = "N/A";

  if (hasEndUser) {
    warrantyStartDate = new Date(batteryData.clientAssignedAt);
    ownerName = batteryData.clientName;
    warrantyLabel = "End User Warranty";
  } else if (hasDealer) {
    warrantyStartDate = new Date(batteryData.dealerAssignedAt);
    ownerName = batteryData.dealerName;
    warrantyLabel = "Dealer Warranty";
  }

  let totalWarrantyDays = 0;
  if (warrantyStartDate && batteryData?.warrantyMonths) {
    const expiryDate = new Date(warrantyStartDate);
    expiryDate.setMonth(expiryDate.getMonth() + batteryData.warrantyMonths);
    if (!hasEndUser && hasDealer) {
      expiryDate.setDate(expiryDate.getDate() + 60); // 60 Days Buffer for Dealer
    }
    diffDays = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    isExpired = diffDays <= 0;
    validUntilDate = expiryDate.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    purchaseDateString = warrantyStartDate.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
    // Calculate total warranty span in calendar days
    totalWarrantyDays = Math.ceil((expiryDate.getTime() - warrantyStartDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  const percentLeft = totalWarrantyDays > 0 
    ? Math.max(0, Math.min(100, Math.round((diffDays / totalWarrantyDays) * 100))) 
    : 0;

  useEffect(() => {
    if (activeTab === "qr" && !verificationResult) {
      // Delay scanner initialization to ensure DOM is ready
      const timer = setTimeout(() => {
        const scanner = new Html5QrcodeScanner(
          "reader",
          { fps: 10, qrbox: { width: 250, height: 250 } },
          /* verbose= */ false
        );

        scanner.render(onScanSuccess, onScanFailure);
        scannerRef.current = scanner;
      }, 500);

      return () => {
        clearTimeout(timer);
        if (scannerRef.current) {
          scannerRef.current.clear().catch(error => console.error("Failed to clear scanner", error));
        }
      };
    }
  }, [activeTab, verificationResult]);

  function onScanSuccess(decodedText: string) {
    if (scannerRef.current) {
      scannerRef.current.clear().then(() => {
        setSerialNumber(decodedText);
        triggerVerify(decodedText);
      }).catch(error => console.error("Failed to clear scanner on success", error));
    }
  }

  function onScanFailure(error: any) {
    // console.warn(`Code scan error = ${error}`);
  }

  const triggerVerify = async (sn: string) => {
    setIsVerifying(true);
    setVerificationResult(null);
    setBatteryData(null);

    try {
      const res = await fetch(`/api/verify?sn=${encodeURIComponent(sn.trim())}`);
      const data = await res.json();
      if (res.ok && data.verified) {
        setBatteryData(data.battery);
        setVerificationResult("success");
      } else {
        setVerificationResult("error");
      }
    } catch {
      setVerificationResult("error");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const qrParam = params.get("qr");
      if (qrParam) {
        setSerialNumber(qrParam);
        triggerVerify(qrParam);
      }
    }
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serialNumber.trim()) return;
    triggerVerify(serialNumber);
  };

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(certificateRef.current, { 
        pixelRatio: 3,
        backgroundColor: 'white',
        style: {
            borderRadius: '0'
        }
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`XORBIT_Certificate_${serialNumber}.pdf`);
    } catch (error) {
      console.error("Certificate download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24 overflow-x-hidden">
      {/* 1. Cinematic Hero */}
      <PageHero 
        title="Product"
        subtitle="Warranty"
        badge="Product warranty"
        icon={ShieldCheck}
        description="Ensure the integrity and warranty status of your XORBIT EV Lithium battery by verifying its unique digital fingerprint."
      />

      {/* 2. Verification Interface */}
      <section className="section-container py-16 -mt-16 relative z-20 mt-2">
        <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-8 md:p-12">
                
                {/* Tabs */}
                <div className="flex bg-slate-100 p-2 rounded-2xl mb-12 relative">
                    <button 
                        onClick={() => { setActiveTab("serial"); setVerificationResult(null); }}
                        className={`flex-1 flex items-center justify-center gap-3 py-4 text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-300 relative z-10 ${activeTab === "serial" ? "text-white" : "text-slate-500 hover:text-secondary"}`}
                    >
                        <Search className="w-4 h-4" /> Serial Number
                    </button>
                    <button 
                        onClick={() => { setActiveTab("qr"); setVerificationResult(null); }}
                        className={`flex-1 flex items-center justify-center gap-3 py-4 text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-300 relative z-10 ${activeTab === "qr" ? "text-white" : "text-slate-500 hover:text-secondary"}`}
                    >
                        <QrCode className="w-4 h-4" /> Scan QR
                    </button>
                    
                    {/* Active Tab Background Pill */}
                    <div className={`absolute top-2 bottom-2 w-[calc(50%-0.5rem)] bg-secondary rounded-xl transition-transform duration-500 ease-in-out ${activeTab === "serial" ? "translate-x-0" : "translate-x-[calc(100%+0.5rem)]"}`}></div>
                </div>

                {/* Input Area */}
                <div className="min-h-[200px]">
                    <AnimatePresence mode="wait">
                        {activeTab === "serial" ? (
                            <motion.form 
                                key="serial"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleVerify}
                                className="space-y-6"
                            >
                                <div>
                                    <label htmlFor="serial" className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Battery Serial ID</label>
                                    <input 
                                        type="text" 
                                        id="serial"
                                        value={serialNumber}
                                        onChange={(e) => setSerialNumber(e.target.value)}
                                        placeholder="e.g. XORB-72V30-10492"
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-xl font-medium text-secondary focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={isVerifying || !serialNumber.trim()}
                                    className="w-full bg-primary hover:bg-primary/90 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-sm uppercase tracking-[0.1em] py-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 disabled:shadow-none"
                                >
                                    {isVerifying ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck className="w-5 h-5" />
                                            Verify Battery
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.div 
                                key="qr"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col items-center justify-center min-h-[350px] border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 relative overflow-hidden"
                            >
                                <div id="reader" className="w-full max-w-sm overflow-hidden rounded-2xl"></div>
                                {!isVerifying && !verificationResult && (
                                  <div className="mt-4 text-center">
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Align QR Code</p>
                                    <p className="text-xs text-slate-400 mt-2">Position the battery QR code within the frame.</p>
                                  </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
      </section>

      {/* 3. Results Section */}
      <AnimatePresence>
        {verificationResult && (
            <section className="section-container pb-24">
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-screen-xl mx-auto"
                >
                    {verificationResult === "success" ? (
                        <div className="bg-slate-50 border border-slate-200 rounded-[3rem] p-10 md:p-16 relative overflow-hidden shadow-2xl">
                            {/* Success Background Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                            
                            <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
                                {/* Success Icon */}
                                <div className="w-20 h-20 bg-green-500 text-white rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-green-500/30">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                
                                <div className="flex-1 w-full">
                                    <h3 className="text-3xl font-display font-black text-secondary tracking-tight mb-2">Verified Authentic Product</h3>
                                    <p className="text-slate-500 font-medium mb-12 flex items-center gap-2">
                                        <Info className="w-4 h-4 text-primary" /> 
                                        <span>Official XORBIT EV manufactured unit.</span>
                                    </p>

                                    {/* Premium Digital Certificate View */}
                                    <div className="mt-8">
                                        <div className="relative group" ref={certificateRef}>
                                            {/* Subtle Animated Glow Effect */}
                                            <div className="absolute -inset-1.5 bg-gradient-to-r from-primary/10 via-emerald-500/10 to-primary/10 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-300 print:hidden"></div>
                                            
                                            <div className="relative bg-white text-secondary rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
                                                {/* Top Glowing Bar */}
                                                <div className="h-2 bg-gradient-to-r from-primary via-emerald-400 to-blue-500"></div>

                                                <div className="p-8 md:p-14 space-y-10 relative z-10">
                                                    {/* Certificate Header / Title Block */}
                                                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 pb-8 border-b border-slate-100">
                                                        <div className="space-y-3">
                                                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                                {warrantyLabel}
                                                            </div>
                                                            <h4 className="text-4xl md:text-5xl font-display font-black tracking-tight leading-none text-secondary uppercase italic">
                                                                {ownerName}
                                                            </h4>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                                Official Digital Authentication Certificate
                                                            </p>
                                                        </div>

                                                        {/* Circular Progress Gauge */}
                                                        <div className="flex items-center gap-4 bg-slate-50/50 border border-slate-100 p-5 rounded-3xl shrink-0 w-full sm:w-auto">
                                                            <div className="relative w-20 h-20 shrink-0">
                                                                <svg className="w-full h-full transform -rotate-90">
                                                                    {/* Background track */}
                                                                    <circle
                                                                        cx="40"
                                                                        cy="40"
                                                                        r="32"
                                                                        className="stroke-slate-100"
                                                                        strokeWidth="6"
                                                                        fill="transparent"
                                                                    />
                                                                    {/* Foreground progress */}
                                                                    <circle
                                                                        cx="40"
                                                                        cy="40"
                                                                        r="32"
                                                                        className={isExpired ? "stroke-red-500" : "stroke-emerald-500"}
                                                                        strokeWidth="6"
                                                                        fill="transparent"
                                                                        strokeDasharray="201"
                                                                        strokeDashoffset={201 - (201 * (isExpired ? 0 : percentLeft)) / 100}
                                                                        strokeLinecap="round"
                                                                    />
                                                                </svg>
                                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                                                    {isExpired ? (
                                                                        <span className="text-[10px] font-black text-red-500 uppercase tracking-tighter">EXP</span>
                                                                    ) : (
                                                                        <>
                                                                            <span className="text-sm font-black text-secondary leading-none">{percentLeft}%</span>
                                                                            <span className="text-[8px] font-bold text-slate-400 uppercase">Left</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Warranty Status</p>
                                                                <p className={`text-2xl font-black uppercase tracking-tight leading-none ${isExpired ? 'text-red-500' : 'text-emerald-600'}`}>
                                                                    {isExpired ? 'Expired' : `${diffDays} Days`}
                                                                </p>
                                                                <p className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">
                                                                    {isExpired ? 'Coverage Ended' : 'Protected Coverage'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Dynamic Grid Layout showing only the 5 specified fields */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 pt-2">
                                                        {/* Field 1: Battery Model */}
                                                        <div className="bg-slate-50/30 border border-slate-100 p-5 rounded-2xl flex flex-col justify-between space-y-3 hover:border-slate-200 transition duration-300">
                                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                                                <Battery className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Battery Model</p>
                                                                <p className="text-sm font-black text-secondary uppercase tracking-tight mt-1">{batteryData.name || 'N/A'}</p>
                                                            </div>
                                                        </div>

                                                        {/* Field 2: Mfg Date */}
                                                        <div className="bg-slate-50/30 border border-slate-100 p-5 rounded-2xl flex flex-col justify-between space-y-3 hover:border-slate-200 transition duration-300">
                                                            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500">
                                                                <Calendar className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mfg Date</p>
                                                                <p className="text-sm font-black text-secondary uppercase tracking-tight mt-1">
                                                                    {batteryData.mfgDate ? new Date(batteryData.mfgDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Field 3: Warranty Duration */}
                                                        <div className="bg-slate-50/30 border border-slate-100 p-5 rounded-2xl flex flex-col justify-between space-y-3 hover:border-slate-200 transition duration-300">
                                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                                                                <ShieldCheck className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Warranty</p>
                                                                <p className={`text-sm font-black uppercase tracking-tight mt-1 ${warrantyStartDate ? (isExpired ? 'text-red-500' : 'text-emerald-600') : 'text-secondary'}`}>
                                                                    {warrantyStartDate ? (isExpired ? 'Expired' : `${diffDays} Days Left`) : 'Awaiting Assignment'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Field 4: Dealer Name */}
                                                        <div className="bg-slate-50/30 border border-slate-100 p-5 rounded-2xl flex flex-col justify-between space-y-3 hover:border-slate-200 transition duration-300">
                                                            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
                                                                <Users className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Dealer Name</p>
                                                                <p className="text-sm font-black text-secondary uppercase tracking-tight mt-1" title={batteryData.dealerName || "Awaiting Assignment"}>
                                                                    {batteryData.dealerName || "Awaiting Assignment"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Field 5: End User Name */}
                                                        <div className="bg-slate-50/30 border border-slate-100 p-5 rounded-2xl flex flex-col justify-between space-y-3 hover:border-slate-200 transition duration-300">
                                                            <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500">
                                                                <Users className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">End User Name</p>
                                                                <p className="text-sm font-black text-secondary uppercase tracking-tight mt-1" title={batteryData.clientName || "Awaiting Registration"}>
                                                                    {batteryData.clientName || "Awaiting Registration"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Certificate Footer */}
                                                <div className="bg-slate-50 px-8 py-5 flex justify-between items-center border-t border-slate-100 text-slate-400 relative z-10">
                                                    <p className="text-[8px] font-bold uppercase tracking-[0.25em]">© 2026 XORBIT EV TECHNOLOGY • DIGITAL AUTHENTICATION CERTIFICATE</p>
                                                    <ShieldCheck className="w-4 h-4 text-emerald-500/20" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-red-50 border border-red-100 rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
                            <div className="w-20 h-20 bg-red-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-red-500/30">
                                <AlertCircle className="w-10 h-10" />
                            </div>
                            <h3 className="text-3xl font-display font-black text-secondary tracking-tight mb-4">Record Not Found</h3>
                            <p className="text-slate-600 font-medium max-w-lg mx-auto mb-10 leading-relaxed">
                                We couldn't verify the serial number <span className="font-bold text-secondary">"{serialNumber}"</span> in our database. Please ensure you entered it correctly or contact our support team.
                            </p>
                            <button 
                                onClick={() => setVerificationResult(null)}
                                className="bg-secondary text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-black transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </motion.div>
            </section>
        )}
      </AnimatePresence>
    </div>
  );
}
