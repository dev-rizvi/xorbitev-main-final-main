"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Target, Factory, Zap, Trophy, Eye, TrendingUp, GraduationCap, Globe, Award } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";

export default function AboutPage() {
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
        subtitle="Sustainable"
        badge="Legacy & Vision"
        icon={Target}
        description="From a research project at Symbiosis to an industrial leader in lithium-ion technology, our journey is defined by a relentless pursuit of clean energy."
      />

      {/* 2. Founder Section: Akash Joshi */}
      <section className="py-24 section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-primary/10 blur-2xl rounded-full scale-110 opacity-30"></div>
            <div className="rounded-[4rem] overflow-hidden border-[12px] border-white shadow-2xl relative aspect-[4/5] group">
              <img
                src="/image2.png"
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent"></div>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-4">
              <div className="w-12 h-1 bg-primary rounded-full"></div>
              <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">The Origin</h2>
            </div>

            <h3 className="text-4xl md:text-5xl font-display font-black text-secondary tracking-tighter leading-none uppercase">
              It started with <br /><span className="italic underline underline-offset-[8px] decoration-primary/20">Research.</span>
            </h3>

            <div className="space-y-6 text-slate-500 font-medium leading-relaxed">
              <p>
                In 2022, while pursuing a Post Graduate Diploma in Renewable Energy Management at <span className="text-secondary font-bold">Symbiosis, Pune</span>, our founder Akash Joshi conducted a pivotal research project on Government Policies on Renewable Energy.
              </p>
              <p>
                This deep dive revealed the critical role EV technology would play in curbing global emissions. What began as an academic report transformed into a corporate mission: to build the future of clean mobility, starting with precision-engineered EV cycles.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-primary">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Academic Root</h5>
                  <p className="text-[12px] text-slate-400">Symbiosis Pune Alumnus</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center shrink-0 text-accent">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Inception</h5>
                  <p className="text-[12px] text-slate-400">Est. 2022</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. The Identity Grid (Ultra-Compact Mission & Vision) */}
      <section className="py-20 bg-slate-50 rounded-[4rem] border-y border-slate-100">
        <div className="section-container">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Vision Card */}
            <motion.div
              variants={fadeInUp}
              className="bg-white p-10 rounded-[3rem] shadow-xl border border-white h-full flex flex-col items-start hover:border-primary/20 transition-all duration-500"
            >
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-secondary uppercase tracking-tight mb-4">Our Vision</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                To become the <span className="text-secondary font-bold">World Leader</span> in clean energy based vehicles through a step-by-step introduction of high-performance, durable electric vehicles backed by exceptional service.
              </p>
            </motion.div>

            {/* Differentiation Card */}
            <motion.div
              variants={fadeInUp}
              className="bg-white p-10 rounded-[3rem] shadow-xl border border-white h-full flex flex-col items-start hover:border-primary/20 transition-all duration-500"
            >
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-8">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-secondary uppercase tracking-tight mb-4">What Sets Us Apart</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Our passion for sustainability extends beyond products. We actively drive EV awareness through campaigns across industry, schools, and colleges, adding a human dimension to the energy transition.
              </p>
            </motion.div>

            {/* Impact Card */}
            <motion.div
              variants={fadeInUp}
              className="bg-secondary p-10 rounded-[3rem] shadow-2xl text-white h-full flex flex-col items-start relative overflow-hidden group"
            >
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
              <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-8">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4">Global Reach</h3>
              <p className="text-sm text-white/50 font-medium leading-relaxed mb-8">
                Research and Development centered in Kashipur, powering a cleaner, more resilient energy future across the globe.
              </p>
              <div className="pt-6 border-t border-white/10 w-full flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Made in India</span>
                <ShieldCheck className="w-5 h-5 text-white/20" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4. Core Values Grid (Compact DNA) */}
      <section className="py-24 section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-xl mx-auto mb-16"
        >
          <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-4">Our DNA</h2>
          <h3 className="text-4xl md:text-5xl font-display font-black text-secondary mb-3 tracking-tighter">Proper Engineering.</h3>
          <div className="w-20 h-1 bg-primary/20 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: ShieldCheck, title: "Zero Defect", desc: "Rigorous testing for every single cell assembled in our Kashipur facility." },
            { icon: Factory, title: "Precision Hub", desc: "Advanced clean-room assembly lines for maximum technical reliability." },
            { icon: Zap, title: "High Perf", desc: "Bespoke battery management systems optimized for Indian conditions." },
            { icon: Trophy, title: "Longevity", desc: "Engineered for 3000+ charge cycles with industry-leading warranties." },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white p-10 rounded-[3rem] border border-slate-100 hover:border-primary/30 hover:shadow-2xl transition-all duration-700 group flex flex-col h-full"
            >
              <div className="bg-slate-50 text-slate-400 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-700 shadow-inner">
                <item.icon className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-black text-secondary mb-3 tracking-tight uppercase">{item.title}</h4>
              <p className="text-[14px] text-slate-500 font-medium leading-relaxed flex-grow">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Final CTA */}
      <CTABanner />
    </div>
  );
}
