"use client";

import React from "react";
import { motion } from "framer-motion";
import { Car, Sun, Factory, Zap, BatteryMedium, Cpu } from "lucide-react";

const industries = [
  {
    title: "Electric Vehicles (EV)",
    description: "High-density lithium packs for 2, 3, and 4 wheelers. Optimized for range and thermal safety.",
    icon: Car,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Solar Storage",
    description: "Smart ESS (Energy Storage Systems) for residential and commercial solar installations.",
    icon: Sun,
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    title: "Industrial UPS",
    description: "Heavy-duty power solutions for data centers, medical devices, and manufacturing units.",
    icon: Factory,
    bgColor: "bg-slate-50",
    iconColor: "text-slate-600",
  },
];

export function Industries() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="section-container">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Industries Served</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-secondary">
              Powering Every <span className="text-primary">Innovation</span>
            </h3>
          </div>
          <p className="max-w-md text-slate-500 text-lg">
            Our specialized battery solutions are engineered to meet the unique power demands of modern industries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {industries.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group p-10 rounded-[2rem] border border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 bg-slate-50/30"
            >
              <div className={`${item.bgColor} ${item.iconColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold text-secondary mb-4">{item.title}</h4>
              <p className="text-slate-500 leading-relaxed mb-8">
                {item.description}
              </p>
              <div className="flex items-center gap-2 text-primary font-bold text-sm cursor-pointer hover:gap-4 transition-all">
                Learn More <Zap className="w-4 h-4 fill-current" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
