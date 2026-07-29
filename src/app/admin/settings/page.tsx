"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Image as ImageIcon, Building, Mail, Phone, MapPin, Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    address: "",
    logo: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setFormData({
            companyName: data.companyName || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
            logo: data.logo || ""
          });
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 400; // Logos don't need to be massive
        const MAX_HEIGHT = 400;
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
          // Keep PNG to preserve transparency common in logos
          const base64String = canvas.toDataURL("image/png"); 
          setFormData(prev => ({ ...prev, logo: base64String }));
        }
        setUploading(false);
      };
      img.onerror = () => {
         alert("Failed to process logo image.");
         setUploading(false);
      };
      img.src = reader.result as string;
    };
    reader.onerror = () => {
       alert("Failed to read file.");
       setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;
    setIsSaving(true);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("System Configuration saved successfully.");
      } else {
        alert("Failed to save settings. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to the server.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }

    setIsChangingPassword(true);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newPassword: passwordData.newPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password updated successfully.");
        setPasswordData({
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        alert(data.error || "Failed to update password.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to the server.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="p-8 md:p-12 bg-slate-50 min-h-screen overflow-y-auto">
      <div className="w-full space-y-12">
        
        {/* Header */}
        <div>
          <h1 className="text-4xl font-display font-black text-secondary uppercase tracking-tight flex items-center gap-4">
            <SettingsIcon className="w-10 h-10 text-primary" />
            Global <span className="italic text-primary">Settings</span>
          </h1>
          <p className="text-slate-400 font-medium mt-2">Manage your core enterprise identity and contact parameters.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-12">
          
          {/* Logo Section */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] border-b border-primary/10 pb-2">Brand Identity</h4>
            
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50 hover:bg-slate-50 transition-all group relative overflow-hidden max-w-sm">
              {formData.logo ? (
                <div className="relative w-full aspect-square max-w-[200px] rounded-xl overflow-hidden flex items-center justify-center bg-white p-4 shadow-sm border border-slate-100">
                  <img src={formData.logo} alt="Brand Logo" className="max-w-full max-h-full object-contain" />
                  <div className="absolute inset-0 bg-secondary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                    <p className="text-white text-[10px] font-black uppercase tracking-widest">Update Logo</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-300 group-hover:text-primary transition-colors">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Upload Corporate Logo</p>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={handleLogoUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {uploading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
                  <p className="text-[9px] font-black uppercase text-primary tracking-widest">Processing...</p>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 font-medium">Recommended: Square PNG with transparent background. Max 400x400px.</p>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] border-b border-primary/10 pb-2">Corporate Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                  <Building className="w-3 h-3" /> Enterprise Name
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.companyName}
                  onChange={e => setFormData({...formData, companyName: e.target.value})}
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="e.g. XOrbit EV Solutions"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Support Email
                </label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="support@xorbitev.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                  <Phone className="w-3 h-3" /> Contact Hotline
                </label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> Headquarters Address
                </label>
                <textarea 
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[120px]"
                  placeholder="Enter full registered corporate address..."
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-50">
            <button 
              type="submit" 
              disabled={isSaving || uploading}
              className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isSaving ? "Synchronizing..." : "Save Configuration"}
            </button>
          </div>
        </form>

        {/* Security Section */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-12">
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] border-b border-primary/10 pb-2">Security & Access</h4>
            
            <form onSubmit={handlePasswordChange} className="space-y-8 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    New Password
                  </label>
                  <input 
                    type="password" 
                    required
                    value={passwordData.newPassword}
                    onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Confirm New Password
                  </label>
                  <input 
                    type="password" 
                    required
                    value={passwordData.confirmPassword}
                    onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isChangingPassword}
                  className="bg-secondary text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-secondary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isChangingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : <SettingsIcon className="w-5 h-5" />}
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
