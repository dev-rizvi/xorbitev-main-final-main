"use client";

import React from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { label: "Battery Life Cycles", value: "2500+", suffix: "" },
  { label: "Global Clients", value: "500+", suffix: "" },
  { label: "Energy Storage", value: "120", suffix: "MWg" },
  { label: "Safety Rating", value: "99.9", suffix: "%" },
];

export function Stats() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-secondary text-white relative overflow-hidden">
      {/* Decorative background grid */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      
      <div className="section-container relative z-10 text-center">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col gap-3"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-primary">
                {stat.value}{stat.suffix}
              </div>
              <p className="text-sm md:text-base font-medium text-white/50 uppercase tracking-widest leading-tight">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
