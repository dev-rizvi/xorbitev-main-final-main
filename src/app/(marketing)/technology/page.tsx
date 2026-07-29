"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Cpu, ShieldCheck, Zap, Thermometer, BatteryFull, Recycle, Layers, Settings, Microscope, FlaskConical } from "lucide-react";
import { CTABanner } from "@/components/sections/CTABanner";
import { PageHero } from "@/components/ui/PageHero";

const techFeatures = [
  {
    title: "Advanced AI BMS",
    description: "Proprietary Next-Gen system with 24/7 cell balancing and predictive thermal protection.",
    icon: Cpu,
  },
  {
    title: "Eco-Grade LFP",
    description: "High-density Lithium Iron Phosphate with 3000+ lifecycle safety and zero cobalt usage.",
    icon: BatteryFull,
  },
  {
    title: "IP67 Protection",
    description: "Industrial-grade waterproofing for operation in extreme monsoon and vibration conditions.",
    icon: ShieldCheck,
  },
];



export default function TechnologyPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.1 }
  };

  return (
    <div ref={containerRef} className="bg-white min-h-screen overflow-x-hidden">
      {/* 1. Cinematic Hero */}
      <PageHero 
        title="Engineering"
        subtitle="Excellence"
        badge="The Science of Reliability"
        icon={Microscope}
        description="We don't just assemble batteries; we engineer energy ecosystems. Every cell is a testament to rigorous precision at XORBIT EV."
      />

      {/* 2. Overlapping Technical Hub */}
      <section className="py-20 section-container relative z-20 -mt-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-16 rounded-[4rem] shadow-2xl border border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
          >
              <div className="relative group overflow-hidden rounded-[3rem] aspect-square border-[8px] border-slate-50 shadow-inner">
                  <img 
                    src="/tech-circuits.png" 
                    alt="Advanced BMS Hardware" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 via-transparent to-transparent"></div>
              </div>

              <div className="space-y-8">
                  <div className="inline-flex items-center gap-4">
                      <div className="w-12 h-1 bg-primary rounded-full"></div>
                      <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">The Intelligence</h2>
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-display font-black text-secondary tracking-tighter leading-none uppercase">
                     Smart BMS: The <br /><span className="italic underline underline-offset-[8px] decoration-primary/20 text-primary">Brain.</span>
                  </h3>
                  
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Our proprietary AI-enhanced Battery Management System (BMS) balances every cell in real-time. By monitoring individual temperatures and voltages with 20S precision, we prevent failure before it happens.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: Thermometer, t: "Thermal Protection" },
                        { icon: Zap, t: "Active Balancing" },
                        { icon: Settings, t: "Predictive AI" },
                        { icon: Layers, t: "Modular Core" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                           <item.icon className="w-4 h-4 text-primary" />
                           <span className="text-[10px] font-black text-secondary uppercase tracking-widest">{item.t}</span>
                        </div>
                      ))}
                  </div>
              </div>
          </motion.div>
      </section>

      {/* 3. Tech Standards Grid */}
      <section className="py-20 bg-slate-50 rounded-[4rem] border-y border-slate-100">
        <div className="section-container">
            <motion.div 
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-4">The Standards</h2>
                <h3 className="text-4xl md:text-5xl font-display font-black text-secondary tracking-tighter uppercase">Laboratory <span className="text-primary italic">Precision.</span></h3>
            </motion.div>

            <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            >
                {techFeatures.map((item, index) => (
                <motion.div 
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ y: -5 }}
                    className="bg-white p-12 rounded-[3rem] border border-slate-100 hover:border-primary/20 hover:shadow-2xl transition-all duration-500"
                >
                    <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-10">
                    <item.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-black text-secondary uppercase tracking-tight mb-4">{item.title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    {item.description}
                    </p>
                </motion.div>
                ))}
            </motion.div>
        </div>
      </section>

      {/* 4. Industrial Stress Test Showcase */}
      <section className="py-24 section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                className="space-y-8 order-2 lg:order-1"
              >
                  <div className="inline-flex items-center gap-4">
                      <div className="w-12 h-1 bg-primary rounded-full"></div>
                      <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">The Testing</h2>
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-display font-black text-secondary tracking-tighter leading-none uppercase">
                     Safety Without <br /><span className="italic underline underline-offset-[8px] decoration-primary/20">Compromise.</span>
                  </h3>
                  
                  <div className="space-y-6 text-slate-500 font-medium leading-relaxed">
                      <p>
                        Our batteries undergo extreme stress tests at our dedicated R&D facility. From nail penetration to high-altitude thermal simulation, we ensure zero compromise on safety for our global enterprise partners.
                      </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { icon: Microscope, t: "Laboratory Grade R&D" },
                        { icon: FlaskConical, t: "Chemical Stability" },
                        { icon: Recycle, t: "Zero Thermal Runway" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 group">
                           <div className="w-2 h-2 rounded-full bg-primary group-hover:scale-150 transition-transform"></div>
                           <span className="text-[10px] font-black text-secondary uppercase tracking-widest">{item.t}</span>
                        </div>
                      ))}
                  </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2 bg-secondary rounded-[4rem] p-12 text-white relative overflow-hidden"
              >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                  <div className="relative z-10">
                      <div className="text-primary font-black text-5xl mb-6 italic tracking-tighter">0% Failure.</div>
                      <p className="text-white/40 text-sm font-medium leading-relaxed mb-8">
                        Every XORBIT EV pack is rigorously analyzed and certified to meet BIS and ISO standards, ensuring a mission-critical reliability rate of 99.9%.
                      </p>
                      <div className="flex gap-4">
                          <div className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[9px] font-black tracking-widest uppercase">ISO 9001</div>
                          <div className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[9px] font-black tracking-widest uppercase">BIS CERTI.</div>
                      </div>
                  </div>
              </motion.div>
          </div>
      </section>

      {/* 5. Production Visual */}
      <section className="section-container pb-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="rounded-[4rem] overflow-hidden aspect-[21/9] relative shadow-2xl group border-[12px] border-white"
          >
              <img 
                src="/tech-hero.png" 
                alt="XORBIT EV Research Facility" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-10 left-10">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-1 bg-primary rounded-full"></div>
                      <span className="text-[10px] font-black text-white uppercase tracking-[0.5em]">R&D Hub | Kashipur Unit</span>
                  </div>
              </div>
          </motion.div>
      </section>

      {/* 6. Final CTA */}
      <CTABanner />
    </div>
  );
}
