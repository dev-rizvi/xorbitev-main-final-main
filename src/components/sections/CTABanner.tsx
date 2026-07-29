"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare, ArrowRight, Zap, ShieldCheck, Gauge, Trophy } from "lucide-react";

export function CTABanner() {
  return (
    <section className="py-16 bg-secondary text-white overflow-hidden relative">
      {/* 1. Dynamic Background Architecture */}
      <div className="absolute inset-0 z-0">
          {/* Animated Mesh Gradient */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-primary/10 via-secondary to-secondary opacity-80" />
          
          {/* Technical Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.05]" 
               style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
          
          {/* Cinematic Glows */}
          <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[160px] animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[140px] opacity-40" />
      </div>
      
      <div className="section-container relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center"
          >
            {/* Status Indicator */}
            <div className="flex items-center gap-3 border border-white/10 bg-white/5 backdrop-blur-2xl px-5 py-1.5 rounded-full text-white/90 text-[9px] font-black tracking-[0.4em] uppercase mb-8 shadow-2xl">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                Limited Manufacturing Slots Available
            </div>

            {/* High-Impact Heading */}
            <h2 className="text-4xl md:text-[5rem] font-display font-black leading-[1.05] tracking-tighter mb-6 text-balance">
                Ready to <span className="text-primary italic inline-block relative group">
                    Electrify
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </span> <br /> 
                Your Industrial Future?
            </h2>

            {/* Subtext with specific value prop */}
            <p className="text-white/40 text-md md:text-xl max-w-2xl mx-auto font-medium leading-relaxed mb-10 text-balance">
                Join the fleet of global pioneers relying on XORBIT EV for mission-critical LFP technology and high-density mobility solutions.
            </p>

            {/* Primary Action Suite */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                <Link
                  href="/contact"
                  className="group relative inline-flex items-center justify-center px-10 py-5 overflow-hidden font-black text-xs uppercase tracking-[0.3em] text-white transition-all duration-300 bg-primary rounded-full hover:scale-105 active:scale-95 shadow-2xl shadow-primary/30"
                >
                  <span className="relative flex items-center gap-3">
                    Secure Consultation
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </Link>

                <Link
                  href="https://wa.me/919876543210"
                  className="group relative inline-flex items-center justify-center px-10 py-5 overflow-hidden font-black text-xs uppercase tracking-[0.3em] text-white transition-all duration-300 border border-white/10 bg-white/5 backdrop-blur-xl rounded-full hover:bg-white/10 active:scale-95"
                >
                  <span className="relative flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Direct Connect
                  </span>
                </Link>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
