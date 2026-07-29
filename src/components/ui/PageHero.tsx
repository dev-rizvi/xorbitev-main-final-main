"use client";

import React from "react";
import { motion } from "framer-motion";
interface PageHeroProps {
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  icon: React.ElementType;
}

export function PageHero({ title, subtitle, description, badge, icon: Icon }: PageHeroProps) {
  return (
    <section className="relative w-full min-h-[45vh] overflow-hidden bg-secondary text-white pt-32 pb-16 flex flex-col items-center justify-center">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,102,255,0.1)_0%,transparent_70%)]"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] animate-pulse-slow"></div>
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]"></div>
      
      <div className="section-container relative z-10 text-center">
        {/* Glassmorphic Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 border border-white/10 bg-white/5 backdrop-blur-2xl px-6 py-2 rounded-full text-white/90 text-[10px] font-black tracking-widest uppercase mb-10 shadow-2xl"
        >
            <Icon className="w-4 h-4 text-primary" />
            {badge}
        </motion.div>
        
        {/* Large Typography Header */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-[5.5rem] font-display font-black mb-6 uppercase tracking-tight leading-[0.9]"
        >
          {title} <br /> <span className="text-primary italic">{subtitle}.</span>
        </motion.h1>
        
        {/* Subtext */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/60 text-lg md:text-xl font-medium max-w-5xl mx-auto leading-relaxed"
        >
           {description}
        </motion.p>
      </div>
    </section>
  );
}
