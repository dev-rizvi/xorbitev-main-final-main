"use client";

import React from "react";
import { motion } from "framer-motion";
import { Download, MessageSquare, Zap, Shield, Recycle, Battery } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  name: string;
  category: string;
  image?: string;
  specs: Record<string, string>;
  features: string[];
}

export function ProductCard({ name, category, image, specs, features }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50/50 group border-b border-slate-100 flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-slate-300 group-hover:scale-105 transition-transform duration-700">
            <Battery className="w-12 h-12 stroke-[1]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">XORBIT EV</span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow gap-4">
        <div>
          <h3 className="text-xl font-bold text-secondary mb-1">{name}</h3>
          <div className="flex flex-wrap gap-4 pt-2">
            {Object.entries(specs).slice(0, 2).map(([key, value]) => (
              <div key={key} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-tighter">
                <Zap className="w-3.5 h-3.5 text-primary" /> {value}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Key Features</h4>
          <ul className="grid grid-cols-1 gap-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* <div className="mt-auto pt-6 flex flex-col gap-3">
          <button className="w-full bg-secondary text-white py-3 rounded-xl font-bold hover:bg-secondary/90 transition-all flex items-center justify-center gap-2">
            <MessageSquare className="w-4 h-4" /> Send Inquiry
          </button>
          <button className="w-full bg-slate-50 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2 border border-slate-100">
            <Download className="w-4 h-4" /> Download Datasheet
          </button>
        </div> */}
      </div>
    </motion.div>
  );
}
