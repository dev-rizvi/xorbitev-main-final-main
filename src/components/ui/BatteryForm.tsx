"use client";

import React, { useState } from "react";
import { Save, X, Loader2, ArrowLeft, Upload, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";


interface BatteryDetail {
  id?: string;
  sn?: string;
  name?: string;
  category?: string;
  nominalVoltage?: string;
  fullyChargedVoltage?: string;
  dischargeCutOff?: string;
  nominalCapacity?: string;
  totalEnergy?: string;
  cellConfiguration?: string;
  motorCompatibility?: string;
  application?: string;
  avgRidingCurrent?: string;
  estRuntime?: string;
  estRange?: string;
  energyEfficiency?: string;
  cycleLife?: string;
  chargingTime?: string;
  warrantyMonths?: number;
  image?: string;
  showOnWebsite?: boolean;
}

interface Props {
  initialData?: Partial<BatteryDetail>;
  isEditing?: boolean;
}

export function BatteryForm({ initialData, isEditing }: Props) {
  const [formData, setFormData] = useState<Partial<BatteryDetail>>(initialData || {});
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialData?.image || null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Show local preview immediately
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Compress and convert to Base64 using Canvas to prevent payload size issues
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Compress to webp format with 0.8 quality
            const base64String = canvas.toDataURL("image/webp", 0.8);
            setFormData(prev => ({ ...prev, image: base64String }));
          } else {
            // Fallback if canvas fails
            setFormData(prev => ({ ...prev, image: reader.result as string }));
          }
          setUploading(false);
        };
        img.onerror = () => {
          alert("Failed to process image.");
          setUploading(false);
        };
        img.src = reader.result as string;
      };
      reader.onerror = () => {
        alert("Failed to read file.");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image file.');
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;
    setIsLoading(true);

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `/api/batteries/${formData.id}` : "/api/batteries";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/batteries");
        router.refresh();
      }
    } catch (error) {
      console.error("Operation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Basic Info */}
        <div className="space-y-8">
          <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] border-b border-primary/10 pb-2">Identification Protocol</h4>
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50 hover:bg-slate-50 transition-all group relative overflow-hidden">
              {preview ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-[10px] font-black uppercase tracking-widest">Change Image</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-300 group-hover:text-primary transition-colors">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Upload Battery Image</p>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {uploading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
                  <p className="text-[9px] font-black uppercase text-primary tracking-widest">Uploading...</p>
                </div>
              )}
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">System Name</label>
              <input 
                type="text" 
                required
                value={formData.name || ""}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full mt-2 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="e.g. XORBIT 48V 24AH"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Category / Application</label>
              <input 
                type="text"
                value={formData.category || ""}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full mt-2 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="e.g. E-Scooter / Industrial"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-4 cursor-pointer select-none group">
                <div className="relative">
                  <input 
                    type="checkbox"
                    checked={formData.showOnWebsite !== false}
                    onChange={e => setFormData({...formData, showOnWebsite: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-secondary tracking-widest block">Show on Website</span>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Toggle model visibility on the public website catalog</span>
                </div>
              </label>
            </div>
          </div>

          <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] border-b border-primary/10 pb-2 mt-10">Electrical Specs</h4>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nominal Voltage</label>
              <input type="text" value={formData.nominalVoltage || ""} onChange={e => setFormData({...formData, nominalVoltage: e.target.value})} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="48V" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Charged Voltage</label>
              <input type="text" value={formData.fullyChargedVoltage || ""} onChange={e => setFormData({...formData, fullyChargedVoltage: e.target.value})} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="54V" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nominal Capacity</label>
              <input type="text" value={formData.nominalCapacity || ""} onChange={e => setFormData({...formData, nominalCapacity: e.target.value})} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="24AH" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Total Energy</label>
              <input type="text" value={formData.totalEnergy || ""} onChange={e => setFormData({...formData, totalEnergy: e.target.value})} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="1.24 KWH" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Discharge Cut-off</label>
              <input type="text" value={formData.dischargeCutOff || ""} onChange={e => setFormData({...formData, dischargeCutOff: e.target.value})} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="40V" />
            </div>
          </div>
        </div>

        {/* Performance Info */}
        <div className="space-y-8">
          <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] border-b border-primary/10 pb-2">Operational Data</h4>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Est. Range</label>
              <input type="text" value={formData.estRange || ""} onChange={e => setFormData({...formData, estRange: e.target.value})} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="40-60 km" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Charging Time</label>
              <input type="text" value={formData.chargingTime || ""} onChange={e => setFormData({...formData, chargingTime: e.target.value})} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="6-7 Hours" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Cycle Life</label>
              <input type="text" value={formData.cycleLife || ""} onChange={e => setFormData({...formData, cycleLife: e.target.value})} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="2000+ Cycles" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Efficiency</label>
              <input type="text" value={formData.energyEfficiency || ""} onChange={e => setFormData({...formData, energyEfficiency: e.target.value})} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder=">95%" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Est. Runtime</label>
              <input type="text" value={formData.estRuntime || ""} onChange={e => setFormData({...formData, estRuntime: e.target.value})} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="e.g. 4 Hours" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Avg. Riding Current</label>
              <input type="text" value={formData.avgRidingCurrent || ""} onChange={e => setFormData({...formData, avgRidingCurrent: e.target.value})} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="e.g. 15A" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Warranty (Months)</label>
              <input 
                type="number" 
                value={formData.warrantyMonths || ""} 
                onChange={e => setFormData({...formData, warrantyMonths: parseInt(e.target.value) || 0})} 
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                placeholder="e.g. 24" 
              />
            </div>
          </div>

          <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] border-b border-primary/10 pb-2 mt-10">Advanced Config</h4>
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Cell Configuration</label>
              <input type="text" value={formData.cellConfiguration || ""} onChange={e => setFormData({...formData, cellConfiguration: e.target.value})} className="w-full mt-2 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="15S LFP CELLS" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Application Type</label>
              <input type="text" value={formData.application || ""} onChange={e => setFormData({...formData, application: e.target.value})} className="w-full mt-2 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Low Speed E-Scooter" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Motor Compatibility</label>
              <input type="text" value={formData.motorCompatibility || ""} onChange={e => setFormData({...formData, motorCompatibility: e.target.value})} className="w-full mt-2 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="250W - 1000W Motors" />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row gap-4 justify-start">
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isEditing ? "Update System" : "Initialize System"}
        </button>
        <Link href="/admin/batteries" className="px-8 bg-slate-100 text-slate-400 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-slate-200 transition-all flex items-center justify-center gap-3">
          <X className="w-5 h-5" /> Cancel
        </Link>
      </div>
    </form>
  );
}
