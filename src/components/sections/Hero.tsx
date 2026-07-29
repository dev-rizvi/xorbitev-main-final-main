"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Zap, ShieldCheck, Gauge } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32 lg:pt-56 lg:pb-40 bg-slate-50/50">
      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-8"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide w-fit border border-primary/20">
              <Zap className="w-4 h-4 fill-current" />
              <span>Leading Lithium Battery Manufacturer</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight text-secondary">
              Powering the <span className="text-primary">Future</span> with Advanced Lithium Tech
            </h1>

            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
              High-performance, safety-optimized lithium-ion solutions for Electric Vehicles, Solar Energy Systems, and Industrial Applications. Built for reliability.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto bg-primary text-white px-10 py-5 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/30 group"
              >
                Get Custom Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/batteries"
                className="w-full sm:w-auto bg-white border border-slate-200 text-secondary px-10 py-5 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"
              >
                Explore Products
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-10 gap-y-6 pt-5">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-secondary">Safety First</h4>
                  <p className="text-xs text-slate-500">Advanced BMS Protection</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                  <Gauge className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-secondary">Ultra Optimized</h4>
                  <p className="text-xs text-slate-500">2500+ Battery Cycles</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative z-10 bg-white p-4 rounded-3xl shadow-2xl border border-slate-100/50 backdrop-blur-sm overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />
              <img 
                src="/hero-bg.png" 
                alt="Lithium Battery Array" 
                className="w-full h-auto rounded-2xl group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Background blobs */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl -z-0" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-50 rounded-full blur-3xl -z-0" />
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-2 text-slate-400">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Scroll to Explore</span>
        <div className="w-[1px] h-10 bg-slate-200" />
      </div>
    </section>
  );
}
