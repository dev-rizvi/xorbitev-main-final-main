"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Logo({ 
  className = "", 
  scrolled = false,
  src: initialSrc 
}: { 
  className?: string; 
  scrolled?: boolean;
  src?: string;
}) {
  const [logo, setLogo] = useState(initialSrc);
  const [companyName, setCompanyName] = useState("XORBIT EV");

  useEffect(() => {
    if (!initialSrc) {
      fetch("/api/settings")
        .then(res => res.json())
        .then(data => {
          if (data.logo) setLogo(data.logo);
          if (data.companyName) setCompanyName(data.companyName);
        })
        .catch(err => console.error("Logo settings fetch failed:", err));
    }
  }, [initialSrc]);

  return (
    <div className={cn("flex items-center cursor-pointer", className)}>
      <div className={cn(
        "px-4 py-2 rounded-2xl border transition-all duration-500 flex items-center justify-center shadow-2xl",
        scrolled 
          ? "bg-white border-slate-100 shadow-slate-200/50" 
          : "bg-white/5 backdrop-blur-xl border-white/10 shadow-black/20"
      )}>
        {logo ? (
          <img
            src={logo}
            alt={`${companyName} Logo`}
            className="h-9 w-auto object-contain"
            onError={(e) => {
              // Hide broken image and show text fallback
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.parentElement?.querySelector('.logo-fallback') as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
        ) : null}
        <div className={cn(
          "logo-fallback font-display font-black text-xl tracking-tighter",
          logo ? "hidden" : "block",
          scrolled ? "text-secondary" : "text-white"
        )}>
          {companyName.includes("XORBIT") ? (
            <>XORBIT<span className="text-primary italic">EV</span></>
          ) : (
            companyName
          )}
        </div>
      </div>
    </div>
  );
}