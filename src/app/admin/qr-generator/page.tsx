"use client";

import React, { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  RefreshCw, Layers, Plus, Download, History,
  ShieldAlert, CheckCircle2, X, Battery, Loader2
} from "lucide-react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function QRGeneratorPage() {
  const [prefix, setPrefix] = useState("XOR");
  const [startNumber, setStartNumber] = useState(1);
  const [count, setCount] = useState(100);
  const MAX_QR_COUNT = 100;
  const [qrCodes, setQrCodes] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedNumber, setLastGeneratedNumber] = useState<number | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const baseUrl = "https://xorbitev.com";
  const [scannedUnit, setScannedUnit] = useState<any>(null);
  const [isVerifyingScan, setIsVerifyingScan] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scannedQR, setScannedQR] = useState<string | null>(null);

  const handleLoadScannedQR = async (qrNum: string) => {
    setIsVerifyingScan(true);
    setScanError(null);
    setScannedUnit(null);
    try {
      const res = await fetch(`/api/verify?sn=${encodeURIComponent(qrNum.trim())}`);
      const data = await res.json();
      if (res.ok && data.verified) {
        setScannedUnit(data.battery);
      } else {
        setScanError(`Battery unit with QR serial "${qrNum}" is not registered in our database (Potential Copy/Counterfeit Battery).`);
      }
    } catch (err) {
      console.error(err);
      setScanError("An error occurred while fetching the battery unit data.");
    } finally {
      setIsVerifyingScan(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const qrParam = params.get("qr");
      if (qrParam) {
        setScannedQR(qrParam);
        handleLoadScannedQR(qrParam);
      }
    }

    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.lastQRNumber !== undefined) {
          setLastGeneratedNumber(data.lastQRNumber);
          // Suggest next number
          setStartNumber((data.lastQRNumber || 0) + 1);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const generateQRCodes = async () => {
    const newCodes = [];
    const qrData = [];
    const lastNum = startNumber + count - 1;

    // Check for duplicates first
    try {
      const checkRes = await fetch(`/api/qr?checkRange=true&prefix=${prefix}&start=${startNumber}&end=${lastNum}`);
      const checkData = await checkRes.json();

      if (checkData.exists) {
        alert(`Warning: Some QR codes in the range ${prefix}${startNumber} to ${prefix}${lastNum} have already been generated in the past. Please use a different starting number.`);
        return;
      }
    } catch (error) {
      console.warn("Pre-generation check failed, proceeding with caution...");
    }

    for (let i = 0; i < count; i++) {
      const code = `${prefix}${startNumber + i}`;
      newCodes.push(code);
      qrData.push({
        qrCode: code,
        prefix: prefix,
        number: startNumber + i
      });
    }
    setQrCodes(newCodes);

    // Save to DB
    try {
      console.log("Saving QRs to database...", qrData);
      // 1. Save individual QR codes to history
      const qrRes = await fetch("/api/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrs: qrData })
      });

      if (!qrRes.ok) {
        const errorData = await qrRes.json();
        throw new Error(errorData.error || "Failed to save QRs to history");
      }

      console.log("QRs saved successfully to history");

      // 2. Update last generated number in settings
      const settingsRes = await fetch("/api/settings");
      const currentSettings = await settingsRes.json();

      const setRes = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentSettings,
          lastQRNumber: lastNum
        })
      });

      if (!setRes.ok) {
        console.warn("Failed to update last QR number in settings");
      }

      setLastGeneratedNumber(lastNum);
      setStartNumber(lastNum + 1); // Automatically suggest next number
      alert(`Success: ${count} QR codes generated and saved to history!`);
    } catch (error) {
      console.error("Failed to update QR database:", error);
      alert(`Error saving to database: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleDownloadPDF = async () => {
    if (!qrCodes.length) return;
    setIsGenerating(true);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');

      // 5 columns x 6 rows grid
      const COLUMNS = 5;
      const ROWS = 6;
      const ITEMS_PER_PAGE = COLUMNS * ROWS;
      const pageCount = Math.ceil(qrCodes.length / ITEMS_PER_PAGE);

      const marginX = 10;
      const startY = 4.5;
      const colWidth = 38;
      const rowHeight = 48;

      for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
        if (pageIndex > 0) pdf.addPage();
        
        const pageItems = qrCodes.slice(pageIndex * ITEMS_PER_PAGE, (pageIndex + 1) * ITEMS_PER_PAGE);
        
        pdf.setDrawColor(0, 0, 0); // Black lines for grid
        pdf.setLineWidth(0.3);

        for (let idx = 0; idx < pageItems.length; idx++) {
          const code = pageItems[idx];
          const col = idx % COLUMNS;
          const row = Math.floor(idx / COLUMNS);
          
          const x = marginX + col * colWidth;
          const y = startY + row * rowHeight;
          
          // Draw cell border
          pdf.rect(x, y, colWidth, rowHeight, "S");
          
          // Small Index Number at top-left
          const globalIndex = pageIndex * ITEMS_PER_PAGE + idx + 1;
          const indexStr = String(globalIndex).padStart(2, '0');
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(6);
          pdf.setTextColor(100, 100, 100);
          pdf.text(indexStr, x + 2, y + 4);
          
          // Fetch QR canvas
          const canvas = document.querySelector(`canvas[data-code="${code}"]`) as HTMLCanvasElement;
          if (canvas) {
            const qrDataUrl = canvas.toDataURL("image/png");
            // Draw QR code inside the cell
            const qrSize = 35;
            const qrX = x + (colWidth - qrSize) / 2;
            const qrY = y + 3; // small padding from top
            pdf.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);
          }

          // Serial text under QR
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(8);
          pdf.setTextColor(0, 0, 0);
          pdf.text(code, x + colWidth / 2, y + 43, { align: "center" });
        }
        
        // Page header (Range and Page Number)
        const rangeText = `Batch Range: ${qrCodes[0]} - ${qrCodes[qrCodes.length - 1]}`;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(6);
        pdf.setTextColor(100, 100, 100);
        pdf.text(rangeText, 10, 3);
        pdf.text(`Page ${pageIndex + 1} of ${pageCount}`, 200, 3, { align: "right" });
      }

      pdf.save(`${prefix}_Batch_${startNumber}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed:", error);
      alert("Failed to generate bulk PDF: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadZIP = async () => {
    if (!qrCodes.length) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();
      const folder = zip.folder(`${prefix}_Batch_${startNumber}`);

      for (const code of qrCodes) {
        const canvas = document.querySelector(`canvas[data-code="${code}"]`) as HTMLCanvasElement;
        if (!canvas) continue;

        // Create a new canvas with extra space at the bottom for the number
        const textHeight = 40;
        const newCanvas = document.createElement('canvas');
        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height + textHeight;
        const ctx = newCanvas.getContext('2d');

        if (ctx) {
          // Fill background with white
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

          // Draw the QR code canvas
          ctx.drawImage(canvas, 0, 0);

          // Draw the QR text below the QR code
          ctx.fillStyle = '#0a112a'; // slate/secondary color
          const fontSize = Math.floor(canvas.width * 0.08); // Proportional font size
          ctx.font = `bold ${fontSize}px Helvetica, Arial, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(code, newCanvas.width / 2, canvas.height + (textHeight / 2));
        }

        const blob = await new Promise<Blob | null>((resolve) => newCanvas.toBlob(resolve, 'image/png'));
        if (blob) {
          folder?.file(`${code}.png`, blob);
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${prefix}_Batch_${startNumber}.zip`);
    } catch (error) {
      console.error("ZIP Generation failed:", error);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Verification Result Card */}
      {scannedQR && (
        <div className="glass p-8 rounded-3xl border border-slate-100 shadow-xl space-y-6 relative overflow-hidden bg-white mb-8">
          <div className="absolute top-6 right-6 z-10">
            <button
              onClick={() => {
                setScannedQR(null);
                setScannedUnit(null);
                setScanError(null);
                if (typeof window !== "undefined") {
                  window.history.replaceState({}, "", "/admin/qr-generator");
                }
              }}
              className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-red-500 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isVerifyingScan ? 'bg-primary/10 text-primary' : scanError ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
              {isVerifyingScan ? (
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              ) : scanError ? (
                <ShieldAlert className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              )}
            </div>
            <div>
              <h2 className="font-black uppercase tracking-widest text-xs text-secondary">Battery Verification Status</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Scanned QR Serial: <span className="text-primary font-black">{scannedQR}</span></p>
            </div>
          </div>

          {isVerifyingScan && (
            <div className="py-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Querying unit credentials...</p>
            </div>
          )}

          {scanError && (
            <div className="p-6 rounded-2xl bg-red-50/50 border border-red-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-red-600 uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Unregistered Product Detected
                </h3>
                <p className="text-xs font-medium text-slate-500 mt-1">{scanError}</p>
              </div>
              <div className="px-4 py-2 bg-red-100/50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest shrink-0 border border-red-200">
                Warning: Potential Copy
              </div>
            </div>
          )}

          {scannedUnit && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-emerald-50/30 border border-emerald-100/80">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-base font-black text-emerald-600 uppercase tracking-tight flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Verified Authentic Product
                    </h3>
                    <p className="text-xs font-medium text-slate-400 mt-1">This battery is an officially registered XORBIT EV unit.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${scannedUnit.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                      Unit Status: {scannedUnit.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Battery Model</p>
                  <p className="text-sm font-black text-secondary mt-1">{scannedUnit.name || 'N/A'}</p>
                  <p className="text-[9px] font-bold text-primary mt-0.5 uppercase tracking-wide">{scannedUnit.category || 'N/A'}</p>
                </div>

                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Technical Specs</p>
                  <p className="text-sm font-black text-secondary mt-1">{scannedUnit.nominalVoltage}V / {scannedUnit.nominalCapacity}Ah</p>
                  <p className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">Energy: {scannedUnit.totalEnergy || 'N/A'}</p>
                </div>

                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Partner Association</p>
                  <p className="text-sm font-black text-secondary mt-1 truncate">{scannedUnit.dealerName || 'Unassigned (In Stock)'}</p>
                  <p className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">
                    {scannedUnit.clientName ? `Client: ${scannedUnit.clientName}` : 'XORBIT EV Stock'}
                  </p>
                </div>

                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Warranty Protection</p>
                  {scannedUnit.clientAssignedAt && scannedUnit.warrantyMonths ? (() => {
                    const purchaseDate = new Date(scannedUnit.clientAssignedAt);
                    const expiryDate = new Date(purchaseDate);
                    expiryDate.setMonth(expiryDate.getMonth() + scannedUnit.warrantyMonths);
                    const diffDays = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    const isExpired = diffDays <= 0;
                    return (
                      <>
                        <p className={`text-sm font-black mt-1 ${isExpired ? 'text-red-500' : 'text-emerald-600'}`}>
                          {isExpired ? 'Expired' : `${diffDays} Days Left`}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">
                          Expires: {expiryDate.toLocaleDateString()}
                        </p>
                      </>
                    );
                  })() : (
                    <>
                      <p className="text-sm font-black text-slate-400 mt-1">No Active Warranty</p>
                      <p className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">Unit not yet sold to user</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tighter italic text-secondary uppercase">
            QR <span className="text-primary not-italic">Generator</span>
          </h1>
          <p className="text-slate-500 font-medium">Bulk serial number QR generator for battery labels</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={generateQRCodes}
            className="flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:bg-secondary/90 transition-all shadow-lg hover:shadow-secondary/20"
          >
            <RefreshCw className="w-4 h-4" />
            Generate Preview
          </button>

          {qrCodes.length > 0 && (
            <div className="flex gap-4">
              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {isGenerating ? "Generating..." : "Download PDF"}
              </button>

              <button
                onClick={handleDownloadZIP}
                disabled={isZipping}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isZipping ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Layers className="w-4 h-4" />
                )}
                {isZipping ? "Zipping..." : "Download ZIP"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Configuration Card */}
        <div className="w-full space-y-6 print:hidden">
          <div className="glass p-8 rounded-3xl premium-shadow space-y-6 border border-white/40">
            <div className="flex items-center gap-3 text-secondary">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-black uppercase tracking-widest text-xs">Configuration</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {lastGeneratedNumber !== null && (
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3 md:col-span-1">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <History className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Last Generated</p>
                    <p className="text-sm font-black text-secondary">{prefix}{lastGeneratedNumber}</p>
                  </div>
                </div>
              )}

              <div className={lastGeneratedNumber !== null ? "md:col-span-1" : "md:col-span-1"}>
                <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2 ml-1">
                  Serial Prefix
                </label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary rounded-2xl px-5 py-4 font-bold text-secondary placeholder:text-slate-300 transition-all"
                  placeholder="e.g. XOR"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 md:col-span-1">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2 ml-1">
                    Start From
                  </label>
                  <input
                    type="number"
                    value={startNumber}
                    onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary rounded-2xl px-5 py-4 font-bold text-secondary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2 ml-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={count}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setCount(Math.min(val, MAX_QR_COUNT));
                    }}
                    className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-primary rounded-2xl px-5 py-4 font-bold text-secondary transition-all"
                    max={MAX_QR_COUNT}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider leading-relaxed text-center">
                Tip: Standard label size is optimized for printing. Maximum 100 codes per batch recommended.
              </p>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="w-full">
          <div className="glass min-h-[500px] p-8 rounded-3xl premium-shadow border border-white/40 overflow-hidden print:bg-white print:border-none print:shadow-none print:p-0">
            {qrCodes.length > 0 ? (
              <div ref={printRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 print:grid-cols-5 print:gap-2">
                {qrCodes.map((code) => (
                  <div
                    key={code}
                    className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-slate-100 hover:border-primary/20 transition-all group print:border-none print:p-2 print:gap-1"
                  >
                    <div className="bg-slate-50 p-3 rounded-xl group-hover:bg-primary/5 transition-colors print:bg-transparent print:p-0">
                      <QRCodeCanvas
                        value={`${baseUrl}/warranty?qr=${code}`}
                        size={200}
                        level="H"
                        includeMargin={true}
                        data-code={code}
                        className="print:w-32 print:h-32"
                      />
                    </div>
                    <span className="font-black text-[10px] tracking-widest text-secondary group-hover:text-primary transition-colors uppercase print:text-xs">
                      {code}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-300 space-y-4 py-20 print:hidden">
                <div className="w-20 h-20 rounded-full border-4 border-dashed border-slate-200 flex items-center justify-center">
                  <Plus className="w-8 h-8" />
                </div>
                <p className="font-black uppercase tracking-widest text-[10px]">Configure and generate to see preview</p>
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
}
