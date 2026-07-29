"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ProductCard } from "@/components/ui/ProductCard";
import { CTABanner } from "@/components/sections/CTABanner";
import { Bike, Wind, ShieldCheck, Zap, Activity, Battery, Gauge } from "lucide-react";

const cycleProducts = [
  {
    name: "XORBIT EV - DODO",
    category: "Premium E-Bike",
    image: "/dodo.png",
    specs: { price: "₹33,000", range: "50 km", speed: "24 km/h", motor: "0.25 kW" },
    features: [
      "7-Speed Manual + Automatic Transmission",
      "Charging Time: 6 to 7 hours",
      "Available in Black, Red, Blue",
      "Extended Range Pedal Assist Mode"
    ],
  },
  {
    name: "XORBIT EV - X-COPTER",
    category: "City Commuter",
    image: "/xcopter.png",
    specs: { price: "₹28,000", range: "30 km", type: "Pedal Assist" },
    features: [
      "Advanced Dual Disc Brakes",
      "High-Visibility Front LED Light",
      "Available in Black, Red, Silver",
      "Perfect for Short-Distance Urban Travel"
    ],
  },
  {
    name: "XORBIT EV - RANGER +",
    category: "All-Terrain E-Bike",
    image: "/range.png",
    specs: { price: "₹23,000", range: "20 km", modes: "3-Speed Assist" },
    features: [
      "3-Speed Pedal Assist Button",
      "Shocker Suspension System",
      "Height-Adjustable Comfort Seat",
      "Available in Black, Red, Silver"
    ],
  },
];

import { PageHero } from "@/components/ui/PageHero";

export default function EVCyclesPage() {
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
        title="Move"
        subtitle="Smarter"
        badge="Sustainable Urban Systems"
        icon={Bike}
        description="Redefining the Indian daily commute. Discover our lineup of high-performance E-Bikes meticulously engineered for industrial-grade efficiency."
      />

      {/* 2. Overlapping Value Props */}
      <section className="py-20 section-container">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[
            { icon: Wind, title: "Effortless Assist", desc: "Intelligent drivetrain seamlessly multiplies your pedaling power for a sweat-free commute." },
            { icon: ShieldCheck, title: "Total Security", desc: "Dual disc brakes and industrial-grade shocker systems for maximum control." },
            { icon: Activity, title: "Smart Interface", d: "Real-time LED indicators and intuitive assist modes at your fingertips." }
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
                {item.desc || (item as any).d}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 3. The Catalog (Precision Grid) */}
      <section className="py-20 bg-slate-50 rounded-[4rem] border-y border-slate-100">
        <div className="section-container">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-4">The Fleet</h2>
            <h3 className="text-4xl md:text-5xl font-display font-black text-secondary tracking-tighter uppercase">Urban <span className="text-primary italic">Catalog.</span></h3>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            {cycleProducts.map((product) => (
              <ProductCard
                key={product.name}
                name={product.name}
                category={product.category}
                image={product.image}
                specs={product.specs as unknown as Record<string, string>}
                features={product.features}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. Impact Statistics (High-Density) */}
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
              <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">The Philosophy</h2>
            </div>

            <h3 className="text-4xl md:text-5xl font-display font-black text-secondary tracking-tighter leading-none uppercase text-balance">
              Engineered for <br /><span className="italic underline underline-offset-[8px] decoration-primary/20">Efficiency.</span>
            </h3>

            <div className="space-y-6 text-slate-500 font-medium leading-relaxed">
              <p>
                XORBIT EV cycles are more than just bikes—they are high-efficiency transportation systems. By blending human energy with advanced electric assistance, we've created a zero-emission solution that beats the city traffic and reduces operational costs to nearly zero.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-primary">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Assist</h5>
                  <p className="text-[12px] text-slate-400">Intelligent PAS 5.0</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center shrink-0 text-accent">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Economics</h5>
                  <p className="text-[12px] text-slate-400">₹0.15 / KM Travel</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6"
          >
            {[
              { label: "CO2 Emissions", value: "0g", desc: "Every kilometer contributed to a cleaner urban atmosphere." },
              { label: "Battery Life", value: "3000+", desc: "Standardized LFP cells with industry-leading longevity." },
              { label: "Commute Time", value: "-40%", desc: "Bypass urban congestion with nimble EV mobility." }
            ].map((stat, i) => (
              <div key={i} className="bg-secondary p-8 rounded-[3rem] text-white flex items-center justify-between group overflow-hidden relative">
                <div className="absolute inset-0 bg-primary/10 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">{stat.label}</h4>
                  <p className="text-xs text-white/40 font-medium max-w-[200px]">{stat.desc}</p>
                </div>
                <div className="text-5xl font-display font-black italic relative z-10 text-primary group-hover:text-white transition-colors duration-500">{stat.value}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. Production Showcase */}
      <section className="section-container pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="rounded-[4rem] overflow-hidden aspect-[21/9] relative shadow-2xl group border-[12px] border-white"
        >
          <img
            src="/back.png"
            alt="Electric Cycle Production"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent opacity-60"></div>
          <div className="absolute bottom-10 left-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-1 bg-primary rounded-full"></div>
              <span className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Precision Urban Mobility Systems</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 6. Final CTA */}
      <CTABanner />
    </div>
  );
}
