"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";

const products = [
  {
    name: "Thunder EV Series",
    category: "Electric Vehicle Batteries",
    image: "/ev-battery.png",
    features: ["BMS Integrated", "High Thermal Stability", "Fast Charging Support"],
    specs: "48V - 72V | 20Ah - 100Ah",
  },
  {
    name: "Solar Helios G1",
    category: "Solar ESS (Storage)",
    image: "/ev-battery.png",
    features: ["LiFePO4 Chemistry", "Wall Mount Design", "10-Year Warranty"],
    specs: "51.2V | 100Ah - 200Ah",
  },
];

export function ProductHighlights() {
  return (
    <section className="py-24 md:py-32 bg-slate-50">
      <div className="section-container">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Product Highlights</h2>
          <h3 className="text-4xl md:text-5xl font-display font-bold text-secondary mb-6">
            Engineered for <span className="text-primary">Extreme</span> Performance
          </h3>
          <p className="text-slate-500 text-lg">
            Our batteries are built using high-grade cells and intelligent BMS to ensure maximum safety and longest lifecycle in the industry.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row gap-10 items-center border border-white"
            >
              <div className="w-full md:w-1/2 aspect-square relative rounded-3xl overflow-hidden shadow-inner bg-slate-100">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-primary text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-full tracking-widest">
                  {product.category}
                </div>
              </div>

              <div className="w-full md:w-1/2 space-y-6">
                <div>
                  <h4 className="text-2xl font-display font-bold text-secondary mb-2">{product.name}</h4>
                  <p className="text-primary font-bold text-sm tracking-tight">{product.specs}</p>
                </div>

                <ul className="space-y-3">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-slate-600 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className="flex items-center gap-2 text-secondary font-bold text-sm bg-slate-100 hover:bg-primary hover:text-white px-6 py-3 rounded-full transition-all group">
                  View Specs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
            <Link 
              href="/batteries" 
              className="text-secondary hover:text-primary font-bold border-b-2 border-secondary/10 hover:border-primary transition-all pb-1 inline-flex items-center gap-2"
            >
                View Full Product Catalog <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
      </div>
    </section>
  );
}
