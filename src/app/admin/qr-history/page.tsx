"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader2, QrCode, X, Download, Activity, Calendar, History, Trash2, CheckCircle2, Filter, Layers, FileDown } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import Link from "next/link";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";


interface GeneratedQR {
  id: string;
  qrCode: string;
  prefix: string;
  number: number;
  createdAt: string;
}

export default function QRHistoryPage() {
  const [qrs, setQrs] = useState<GeneratedQR[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [startFilter, setStartFilter] = useState("");
  const [endFilter, setEndFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isZipping, setIsZipping] = useState(false);
  const [isBulkPDFGenerating, setIsBulkPDFGenerating] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [qrModal, setQrModal] = useState<{ isOpen: boolean; qr: string } | null>(null);
  const baseUrl = "https://xorbitev.com";

  const fetchQRs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/qr");
      const data = await res.json();
      setQrs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch QR codes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQRs();
  }, []);

  const filteredQRs = qrs.filter(qr => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      (qr.qrCode?.toLowerCase() || "").includes(searchLower) ||
      (qr.prefix?.toLowerCase() || "").includes(searchLower) ||
      qr.number.toString().includes(searchLower);

    let matchesRange = true;
    if (startFilter || endFilter) {
      // Extract prefix and number from qrCode
      const qrNum = qr.number;
      const startNum = parseInt(startFilter.replace(/^\D+/g, '')) || 0;
      const endNum = parseInt(endFilter.replace(/^\D+/g, '')) || 99999999;
      
      if (startFilter && qrNum < startNum) matchesRange = false;
      if (endFilter && qrNum > endNum) matchesRange = false;
    }

    return matchesSearch && matchesRange;
  });

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredQRs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredQRs.map(qr => qr.id)));
    }
  };


  const downloadSelectedZIP = async () => {
    if (selectedIds.size === 0) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("QR_History_Export");
      
      const selectedData = qrs.filter(qr => selectedIds.has(qr.id));
      
      for (const qr of selectedData) {
        const canvas = document.createElement('canvas');
        // We'll use a temporary canvas to generate the QR
        // Since we can't easily access the canvas from the table, we recreate it
        folder?.file(`${qr.qrCode}.png`, ""); // Placeholder, let's do it properly
      }
      
      // Real implementation would need a way to render these QRs to blobs
      // I'll add a hidden renderer for this
      alert("ZIP generation for " + selectedIds.size + " items started. Please wait...");
      
      // To keep it simple and reliable, let's use the current page's canvas if they exist
      // or just provide the list for now. 
      // Actually, I'll implement a proper ZIP downloader in a separate step if needed.
      // For now, let's just finalize the UI.
    } catch (error) {
      console.error(error);
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadZIP = async () => {
    if (selectedIds.size === 0) return;
    
    if (selectedIds.size > 100) {
      alert("System Limit: You can only download a maximum of 100 QR codes at a time to ensure performance. Please reduce your selection.");
      return;
    }

    setIsZipping(true);
    
    try {
      const zip = new JSZip();
      const folder = zip.folder(`QR_Export_${new Date().getTime()}`);
      
      const selectedItems = qrs.filter(qr => selectedIds.has(qr.id));
      
      for (const qr of selectedItems) {
        const canvas = document.querySelector(`canvas[data-code="${qr.qrCode}"]`) as HTMLCanvasElement;
        if (!canvas) {
          // If not in DOM (not on current page), we might need to render it
          // But for now, let's assume they are downloading from the current page
          continue;
        }

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
          ctx.fillText(qr.qrCode, newCanvas.width / 2, canvas.height + (textHeight / 2));
        }

        const blob = await new Promise<Blob | null>((resolve) => newCanvas.toBlob(resolve, 'image/png'));
        if (blob) folder?.file(`${qr.qrCode}.png`, blob);
      }
      
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `QR_Selected_Batch.zip`);
    } catch (error) {
      console.error("ZIP failed", error);
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadBulkPDF = async () => {
    if (selectedIds.size === 0) return;

    setIsBulkPDFGenerating(true);
    
    try {
      const selectedItems = qrs
        .filter(qr => selectedIds.has(qr.id))
        .sort((a, b) => a.number - b.number);
      const pdf = new jsPDF('p', 'mm', 'a4');

      // 5 columns x 6 rows grid
      const COLUMNS = 5;
      const ROWS = 6;
      const ITEMS_PER_PAGE = COLUMNS * ROWS;
      const pageCount = Math.ceil(selectedItems.length / ITEMS_PER_PAGE);

      const marginX = 10;
      const startY = 4.5;
      const colWidth = 38;
      const rowHeight = 48;

      for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
        if (pageIndex > 0) pdf.addPage();
        
        const pageItems = selectedItems.slice(pageIndex * ITEMS_PER_PAGE, (pageIndex + 1) * ITEMS_PER_PAGE);
        
        pdf.setDrawColor(0, 0, 0); // Black lines for grid
        pdf.setLineWidth(0.3);

        for (let idx = 0; idx < pageItems.length; idx++) {
          const item = pageItems[idx];
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
          const canvas = document.querySelector(`canvas[data-code="${item.qrCode}"]`) as HTMLCanvasElement;
          if (canvas) {
            const qrDataUrl = canvas.toDataURL("image/png");
            // Draw QR code inside the cell (leaving some space for text)
            const qrSize = 35;
            const qrX = x + (colWidth - qrSize) / 2;
            const qrY = y + 3; // small padding from top
            pdf.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);
          }

          // Serial text under QR
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(8);
          pdf.setTextColor(0, 0, 0);
          pdf.text(item.qrCode, x + colWidth / 2, y + 43, { align: "center" });
        }
        
        // Page header (Range and Page Number)
        const rangeText = `Batch Range: ${selectedItems[0].qrCode} - ${selectedItems[selectedItems.length - 1].qrCode}`;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(6);
        pdf.setTextColor(100, 100, 100);
        pdf.text(rangeText, 10, 3);
        pdf.text(`Page ${pageIndex + 1} of ${pageCount}`, 200, 3, { align: "right" });
      }

      pdf.save(`Bulk_QR_Batch_${new Date().getTime()}.pdf`);

    } catch (error) {
      console.error("Bulk PDF failed", error);
      alert("Failed to generate bulk PDF: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsBulkPDFGenerating(false);
    }
  };


  const downloadSinglePDF = async (qrCode: string) => {
    try {
      const canvas = document.querySelector(`canvas[data-code="${qrCode}"]`) as HTMLCanvasElement;
      if (!canvas) {
        alert("Unable to find the QR code element to download. Please make sure the QR is visible on this page.");
        return;
      }
      
      const qrDataUrl = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [60, 60] // Custom square label size e.g. 60mm x 60mm
      });
      
      // Calculate layout
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const qrSize = 35; // 35mm
      const qrX = (pdfWidth - qrSize) / 2;
      const qrY = 6; // 6mm margin top
      
      // Draw QR Code
      pdf.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);
      
      // Draw XORBIT EV text as brand label
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(10, 17, 42); // slate color #0a112a
      pdf.text("XORBIT EV", pdfWidth / 2, qrY + qrSize + 4, { align: "center" });
      
      // Draw QR serial number text under the QR code
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(0, 102, 255); // primary blue color #0066ff
      pdf.text(qrCode, pdfWidth / 2, qrY + qrSize + 9, { align: "center" });
      
      pdf.save(`${qrCode}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };


  const totalPages = Math.ceil(filteredQRs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQRs = filteredQRs.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  return (
    <main className="p-8 md:p-12 animate-fade-in">
      <div className="w-full space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-display font-black text-secondary uppercase tracking-tight">
              QR Code <span className="italic text-primary">History</span>
            </h1>
            <p className="text-slate-400 font-medium mt-1">Audit log of all bulk-generated serial numbers</p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={fetchQRs}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 text-secondary rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
            >
              <Activity className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? "Refreshing..." : "Refresh Data"}
            </button>

            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                <History className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Total Generated</p>
                <p className="text-sm font-black text-secondary">{qrs.length} Codes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden premium-shadow">
          <div className="p-8 border-b border-slate-50 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="relative flex-1 max-md:w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="text" 
                  placeholder="Search by QR Serial or Prefix..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-secondary placeholder:text-slate-300"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                  <input 
                    type="number" 
                    placeholder="Start QR #" 
                    value={startFilter}
                    onChange={(e) => setStartFilter(e.target.value)}
                    className="w-24 px-3 py-2 bg-transparent text-xs font-bold focus:outline-none"
                  />
                  <span className="text-slate-300">—</span>
                  <input 
                    type="number" 
                    placeholder="End QR #" 
                    value={endFilter}
                    onChange={(e) => setEndFilter(e.target.value)}
                    className="w-24 px-3 py-2 bg-transparent text-xs font-bold focus:outline-none"
                  />
                </div>
                
                {selectedIds.size > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <button 
                      onClick={handleDownloadBulkPDF}
                      disabled={isBulkPDFGenerating}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg ${
                        selectedIds.size > 100 
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                          : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
                      }`}
                    >
                      {isBulkPDFGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
                      PDF Selected ({selectedIds.size})
                    </button>
                    <button 
                      onClick={handleDownloadZIP}
                      disabled={isZipping}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg ${
                        selectedIds.size > 100 
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                          : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20'
                      }`}
                    >
                      {isZipping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                      ZIP Selected ({selectedIds.size})
                    </button>
                    {selectedIds.size > 100 && (
                      <span className="text-[8px] font-bold text-red-500 uppercase tracking-widest block w-full text-center mt-1">Max 100 limit exceeded</span>
                    )}
                  </div>
                )}


                <div className="flex items-center gap-4">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    Showing {paginatedQRs.length} of {filteredQRs.length} Records
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-6 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.size === filteredQRs.length && filteredQRs.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                  </th>

                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">#</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">QR Serial</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Prefix</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Sequence</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Generated On</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-20 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Records...</p>
                    </td>
                  </tr>
                ) : paginatedQRs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-20 text-center">
                      <QrCode className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">No QR History Found</p>
                      <Link 
                        href="/admin/qr-generator"
                        className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 text-primary rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
                      >
                        Generate New Batch
                      </Link>
                    </td>
                  </tr>

                ) : paginatedQRs.map((qr, index) => (
                    <tr key={qr.id} className={`hover:bg-slate-50/50 transition-colors group ${selectedIds.has(qr.id) ? 'bg-primary/5' : ''}`}>
                      <td className="px-8 py-6 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.has(qr.id)}
                          onChange={() => toggleSelect(qr.id)}
                          className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="text-xs font-black text-slate-300">{startIndex + index + 1}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-display font-black text-primary text-xs tracking-wider uppercase">{qr.qrCode}</span>
                        {/* Hidden Canvas for ZIP rendering */}
                        <div className="hidden">
                          <QRCodeCanvas value={`${baseUrl}/warranty?qr=${qr.qrCode}`} size={200} data-code={qr.qrCode} />
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          {qr.prefix}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="text-xs font-bold text-secondary">#{qr.number}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-300" />
                          <span className="text-xs font-bold text-slate-500">
                            {new Date(qr.createdAt).toLocaleDateString(undefined, { 
                              day: '2-digit', 
                              month: 'short', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button 
                            onClick={() => downloadSinglePDF(qr.qrCode)}
                            title="Download PDF"
                            className="p-3 rounded-xl hover:bg-white hover:shadow-md text-slate-400 hover:text-emerald-500 transition-all group-hover:scale-110"
                          >
                            <FileDown className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setQrModal({ isOpen: true, qr: qr.qrCode })}
                            title="Preview QR"
                            className="p-3 rounded-xl hover:bg-white hover:shadow-md text-slate-400 hover:text-primary transition-all group-hover:scale-110"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
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
                  className="px-6 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary disabled:opacity-50 transition-all shadow-sm"
                >
                  Previous
                </button>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-6 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary disabled:opacity-50 transition-all shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Preview Modal */}
      {qrModal?.isOpen && (
        <div className="fixed inset-0 bg-secondary/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 animate-scale-up">
            <div className="p-10 space-y-8 flex flex-col items-center">
              <div className="w-full flex justify-between items-center">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Visual QR Identity</p>
                <button onClick={() => setQrModal(null)} className="p-2 rounded-full hover:bg-slate-50 text-slate-300 hover:text-red-500 transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Keep a visible canvas with data-code for helper querySelector if needed, or pass directly */}
              <div className="p-8 bg-white border-4 border-slate-50 rounded-[2.5rem] shadow-inner">
                <QRCodeCanvas 
                  value={`${baseUrl}/warranty?qr=${qrModal.qr}`} 
                  size={180}
                  level="H"
                  includeMargin={true}
                  data-code={qrModal.qr}
                />
              </div>

              <div className="text-center space-y-2">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">QR Signature</p>
                <h4 className="text-xl font-black text-secondary tracking-tight uppercase">{qrModal.qr}</h4>
              </div>

              <div className="w-full space-y-3">
                <button 
                  onClick={() => downloadSinglePDF(qrModal.qr)}
                  className="w-full py-4 bg-emerald-500 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10"
                >
                  <FileDown className="w-4 h-4" /> Download PDF
                </button>
                <button 
                  onClick={() => window.print()}
                  className="w-full py-4 bg-secondary text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-lg"
                >
                  <Download className="w-4 h-4" /> Print Label
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden QRCodeCanvas generator for all filtered QRs to support ZIP and PDF exports across pages */}
      <div className="hidden">
        {filteredQRs.map(qr => (
          <QRCodeCanvas 
            key={`hidden-qr-${qr.id}`}
            value={`${baseUrl}/warranty?qr=${qr.qrCode}`} 
            size={200} 
            data-code={qr.qrCode} 
          />
        ))}
      </div>
    </main>

  );
}
