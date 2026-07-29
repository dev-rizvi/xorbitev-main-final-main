"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/ui/ProductCard";
import { CTABanner } from "@/components/sections/CTABanner";
import { Zap, Settings, ShieldCheck, Factory, Trophy, Target, Thermometer, Database, Loader2 } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";

export default function BatteriesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [batteries, setBatteries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/batteries?visible=true")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBatteries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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

  // Transform DB battery into ProductCard props
  const mapBatteryToCard = (b: any) => {
    const features: string[] = [];
    if (b.cellConfiguration || b.motorCompatibility)
      features.push(`${b.cellConfiguration || ''} • ${b.motorCompatibility || ''}`);
    if (b.avgRidingCurrent)
      features.push(`Avg Riding Current: ${b.avgRidingCurrent}`);
    if (b.estRange)
      features.push(`Est Range: ${b.estRange}`);
    if (b.energyEfficiency || b.cycleLife)
      features.push(`Efficiency ${b.energyEfficiency || 'N/A'} • ${b.cycleLife || ''} Cycle Life`);
    if (b.chargingTime)
      features.push(`Charging Time: ${b.chargingTime}`);

    return {
      id: b.id,
      name: b.name || `Battery ${b.sn}`,
      category: b.category || "EV Batteries",
      image: b.image || "",
      specs: {
        voltage: b.nominalVoltage || "N/A",
        capacity: b.nominalCapacity || "N/A",
        energy: b.totalEnergy || "N/A"
      },
      features
    };
  };

  return (
    <div ref={containerRef} className="bg-white min-h-screen overflow-x-hidden">
      {/* 1. Cinematic Hero */}
      <PageHero 
        title="Extreme"
        subtitle="Precision Cells"
        badge="High-Performance Energy Storage"
        icon={Zap}
        description="Meticulously engineered lithium systems designed for industrial longevity and unconditional safety in the most demanding environments."
      />

      {/* 2. Value Proposition Grid */}
      <section className="py-20 section-container">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { icon: Factory, title: "Nano-LFP Cell", desc: "Highest energy density LiFePO4 cells with 3000+ charge cycles." },
              { icon: Settings, title: "Intelligent BMS", desc: "Real-time AI balancing and 24/7 autonomous safety monitoring." },
              { icon: Database, title: "Density Max", desc: "Compact form factor with maximum energy-to-weight ratio." }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-2xl transition-all duration-500"
              >
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-secondary uppercase tracking-tight mb-4">{item.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                   {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
      </section>

      {/* 3. The Portfolio (Dynamic from DB) */}
      <section className="py-20 bg-slate-50 rounded-[4rem] border-y border-slate-100">
        <div className="section-container">
            <motion.div 
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-4">The Collection</h2>
                <h3 className="text-4xl md:text-5xl font-display font-black text-secondary tracking-tighter uppercase">Industrial <span className="text-primary italic">Lineup.</span></h3>
            </motion.div>

            {loading ? (
              <div className="py-20 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : batteries.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">No battery models available yet.</p>
              </div>
            ) : (
              <motion.div 
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="whileInView"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
              >
                  {batteries.map((b) => {
                    const card = mapBatteryToCard(b);
                    return (
                      <ProductCard
                        key={card.id}
                        name={card.name}
                        category={card.category}
                        image={card.image}
                        specs={card.specs}
                        features={card.features}
                      />
                    );
                  })}
              </motion.div>
            )}
        </div>
      </section>

      {/* 4. Technical Comparison Table */}
      <section className="py-24 section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                className="space-y-8"
              >
                  <div className="inline-flex items-center gap-4">
                      <div className="w-12 h-1 bg-primary rounded-full"></div>
                      <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">The Edge</h2>
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-display font-black text-secondary tracking-tighter leading-none uppercase text-balance">
                     Superior <br /><span className="italic underline underline-offset-[8px] decoration-primary/20">Chemistry.</span>
                  </h3>
                  
                  <div className="space-y-6 text-slate-500 font-medium leading-relaxed">
                      <p>
                        XORBIT EV lithium systems outperform traditional lead-acid batteries in every mission-critical metric. From 4x longer cycle life to 60% weight reduction, our LFP technology is the cornerstone of modern industrial mobility.
                      </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-4">
                      <div className="flex gap-4 items-start">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-primary">
                              <Zap className="w-5 h-5" />
                          </div>
                          <div>
                              <h5 className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Efficiency</h5>
                              <p className="text-[12px] text-slate-400">95% Energy Retention</p>
                          </div>
                      </div>
                      <div className="flex gap-4 items-start">
                          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center shrink-0 text-accent">
                              <Thermometer className="w-5 h-5" />
                          </div>
                          <div>
                              <h5 className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Thermal</h5>
                              <p className="text-[12px] text-slate-400">Zero Runaway Risk</p>
                          </div>
                      </div>
                  </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-[4rem] shadow-2xl border border-slate-100"
              >
                  <div className="overflow-x-auto">
                      <table className="w-full text-left">
                          <thead>
                              <tr className="border-b border-slate-100">
                                  <th className="pb-6 text-[9px] font-black uppercase tracking-widest text-slate-400">Metric</th>
                                  <th className="pb-6 text-[9px] font-black uppercase tracking-widest text-slate-400">Lead Acid</th>
                                  <th className="pb-6 text-[9px] font-black uppercase tracking-widest text-primary">XORBIT LFP</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                              {[
                                { m: "Cycle Life", o: "300 - 500", x: "3000+" },
                                { m: "Weight", o: "Heavy (~28kg)", x: "Ultra Light (~12kg)" },
                                { m: "Charging", o: "8-10 Hours", x: "2-4 Hours" },
                                { m: "Maintenance", o: "High", x: "Zero" },
                              ].map((row, idx) => (
                                  <tr key={idx} className="group">
                                      <td className="py-6 font-bold text-secondary text-sm group-hover:text-primary transition-colors">{row.m}</td>
                                      <td className="py-6 text-slate-500 text-sm">{row.o}</td>
                                      <td className="py-6 text-primary font-black text-sm">{row.x}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </motion.div>
          </div>
      </section>

      {/* 5. Advanced Manufacturing Showcase */}
      <section className="section-container pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Column: The Specs Flyer */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative group"
              >
                  {/* Decorative Background Glow */}
                  <div className="absolute -inset-4 bg-primary/5 rounded-[4rem] blur-3xl group-hover:bg-primary/10 transition-colors duration-1000"></div>
                  
                  <div className="relative rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-[12px] border-white aspect-[3/4] bg-white">
                      <img 
                        src="/imgXo.png" 
                        alt="Product Specifications" 
                        className="w-full h-full object-contain p-4"
                      />
                  </div>
              </motion.div>

              {/* Right Column: Content + Video */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-12"
              >
                  <div className="space-y-6">
                      <div className="inline-flex items-center gap-4">
                          <div className="w-12 h-1 bg-primary rounded-full"></div>
                          <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Industrial Intelligence</h2>
                      </div>
                      <h3 className="text-5xl md:text-6xl font-display font-black text-secondary tracking-tighter uppercase leading-[0.9]">
                        Next-Gen <br /><span className="text-primary italic">Assembly.</span>
                      </h3>
                      <p className="text-slate-500 font-medium leading-relaxed max-w-lg text-lg">
                        Witness the microscopic accuracy of our industrial-grade manufacturing process. Every XORBIT cell undergoes rigorous automated assembly for peak consistency and unconditional safety.
                      </p>
                  </div>

                  <div className="rounded-[3rem] overflow-hidden relative shadow-2xl aspect-video border-8 border-white bg-secondary group">
                      <video 
                        autoPlay 
                        muted 
                        loop 
                        playsInline
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      >
                        <source src="/videoXo.mp4" type="video/mp4" />
                      </video>
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-transparent"></div>
                      
                      <div className="absolute bottom-6 left-6">
                          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 p-2 pr-6 rounded-full">
                              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center animate-pulse">
                                  <div className="w-2 h-2 rounded-full bg-white"></div>
                              </div>
                              <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Factory Feed</span>
                          </div>
                      </div>
                  </div>
              </motion.div>
          </div>
      </section>

      {/* 6. Final CTA */}
      <CTABanner />
    </div>
  );
}
