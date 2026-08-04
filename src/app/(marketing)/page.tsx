"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, ShieldCheck, Battery, Bike, Sun, Trophy, Users, ChevronLeft, ChevronRight, Gauge, Database, Loader2, Play } from "lucide-react";
import { CTABanner } from "@/components/sections/CTABanner";
import { ProductCard } from "@/components/ui/ProductCard";
import Link from "next/link";

const slides = [
  {
    id: 1,
    number: "01",
    category: "Low speed E-scooters",
    headline: ["Next-Gen", "Energy", "Ecosystems"],
    accentWord: 1, // index of headline word to colorize
    tagline: "Refining Low speed E-bike performance through LFP chemistry which provides a high cycle lifespan, stable thermal tolerance, and worry-free daily charging.",
    image: "/tech-hero.png",
    thumb: "/tech-hero.png",
    primaryCta: { label: "Start Partnership", href: "/contact" },
    secondaryCta: { label: "Explore Technology", href: "/technology" },
    stats: [
      { value: "2000+", label: "Cycle Life" },
      { value: "99.8%", label: "Efficiency" },
    ],
    icon: <Zap className="w-5 h-5" />,
    accentColor: "#2563EB",
    tag: "Low speed E- scooters",
  },
  {
    id: 2,
    number: "02",
    category: "X-Mobility Fleet",
    headline: ["Smart", "Electric", "Mobility"],
    accentWord: 1,
    tagline: "Dual-motor precision cycles engineered for high-efficiency urban transit and last-mile logistics.",
    image: "/cycle-hero.png",
    thumb: "/cycle-hero.png",
    primaryCta: { label: "Start Partnership", href: "/contact" },
    secondaryCta: { label: "View EV Cycles", href: "/ev-cycles" },
    stats: [
      { value: "40 km", label: "Max Range" },
      { value: "250W", label: "Motor" },
      { value: "Zero", label: "Emissions" },
    ],
    icon: <Bike className="w-5 h-5" />,
    accentColor: "#10B981",
    tag: "E-Mobility",
  },
  {
    id: 3,
    number: "03",
    category: "Solar battery packs",
    headline: ["Solar Inverter", "Battery Packs"],
    accentWord: 1,
    tagline: "BIS-certified lithium battery packs with active balancing and advanced thermal management systems.",
    image: "/battery-hero.png",
    thumb: "/battery-hero.png",
    primaryCta: { label: "Start Partnership", href: "/contact" },
    secondaryCta: { label: "Browse Batteries", href: "/batteries" },
    stats: [
      { value: "BIS", label: "Certified" },
      { value: "Active", label: "Balancing" },
      { value: "3 Yr", label: "Warranty" },
    ],
    icon: <Battery className="w-5 h-5" />,
    accentColor: "#F59E0B",
    tag: "Solar battery packs",
  },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [featuredBatteries, setFeaturedBatteries] = useState<any[]>([]);
  const [loadingBatteries, setLoadingBatteries] = useState(true);

  // Auto-play logic for hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Fetch top 3 batteries for showcase
  useEffect(() => {
    fetch("/api/batteries?visible=true")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Take first 3 batteries and map them to ProductCard format
          const top3 = data.slice(0, 3).map(b => {
            const features: string[] = [];
            if (b.cellConfiguration || b.motorCompatibility)
              features.push(`${b.cellConfiguration || ''} • ${b.motorCompatibility || ''}`);
            if (b.avgRidingCurrent)
              features.push(`Avg Riding Current: ${b.avgRidingCurrent}`);
            if (b.estRange)
              features.push(`Est Range: ${b.estRange}`);
            if (b.energyEfficiency || b.cycleLife)
              features.push(`Efficiency ${b.energyEfficiency || 'N/A'} • ${b.cycleLife || ''} Cycles`);

            return {
              id: b.id,
              name: b.name || `Battery ${b.sn}`,
              category: b.category || "Industrial LFP",
              image: b.image || "",
              specs: {
                voltage: b.nominalVoltage || "N/A",
                capacity: b.nominalCapacity || "N/A",
                range: b.estRange || "N/A"
              },
              features: features.slice(0, 3) // Take top 3 features
            };
          });
          setFeaturedBatteries(top3);
        }
        setLoadingBatteries(false);
      })
      .catch(() => setLoadingBatteries(false));
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;
    setMousePosition({ x, y });
  };

  // Parallax for Background Watermark
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const watermarkX = useTransform(scrollYProgress, [0, 1], ["-50%", "-60%"]);
  const springX = useSpring(watermarkX, { stiffness: 100, damping: 30 });

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.1 },
    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.2 }
  };

  const goToSlide = useCallback((idx: number) => {
    setCurrentSlide(idx);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="bg-white min-h-screen overflow-x-hidden"
    >
      {/* ===================== PREMIUM HERO SLIDER ===================== */}
      <section className="relative w-full h-screen min-h-[700px] overflow-hidden bg-[#060B17] text-white">

        {/* ── Full-screen background image (subtle, darkened) ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${slide.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <img
              src={slide.image}
              alt={slide.category}
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.12) saturate(1.4)" }}
            />
          </motion.div>
        </AnimatePresence>

        {/* ── Multi-layer gradient for depth ── */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#060B17] via-[#060B17]/85 to-[#060B17]/30 pointer-events-none" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#060B17] via-transparent to-transparent pointer-events-none" />
        {/* Accent glow */}
        <motion.div
          key={`glow-${slide.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 right-0 w-1/2 h-full z-[1] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 70% 40%, ${slide.accentColor}18 0%, transparent 65%)`,
          }}
        />
        {/* Subtle grid */}
        <div className="absolute inset-0 z-[1] opacity-[0.04] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* ── MAIN LAYOUT: Split grid ── */}
        <div className="relative z-10 h-full grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_500px] gap-0 max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">

          {/* ═══ LEFT: Content Panel ═══ */}
          <div className="flex flex-col justify-center py-32 lg:py-0 pr-0 lg:pr-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${slide.id}`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.65, ease: [0.33, 1, 0.68, 1] }}
              >
                {/* Top meta row */}
                <div className="flex items-center gap-4 mb-10">
                  {/* Slide number */}
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[11px] font-black tabular-nums leading-none"
                      style={{ color: slide.accentColor }}
                    >
                      {slide.number}
                    </span>
                    <span className="text-white/20 text-[11px] font-bold">/ {String(slides.length).padStart(2, "0")}</span>
                  </div>
                  <div className="w-px h-3 bg-white/20" />
                  {/* Category badge */}
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-[0.3em]"
                    style={{
                      borderColor: `${slide.accentColor}40`,
                      color: slide.accentColor,
                      backgroundColor: `${slide.accentColor}10`,
                    }}
                  >
                    {slide.icon}
                    {slide.category}
                  </div>
                </div>

                {/* Headline */}
                <h1
                  className="font-display font-black uppercase leading-[0.88] tracking-tighter mb-7"
                  style={{ fontSize: "clamp(2.6rem, 5.5vw, 5.8rem)" }}
                >
                  {slide.headline.map((word, wi) =>
                    wi === slide.accentWord ? (
                      <span
                        key={wi}
                        className="block italic"
                        style={{ color: slide.accentColor }}
                      >
                        {word}
                      </span>
                    ) : (
                      <span key={wi} className="block text-white">
                        {word}
                      </span>
                    )
                  )}
                </h1>

                {/* Tagline */}
                <p className="text-white/50 text-sm md:text-base font-medium leading-[1.75] max-w-md mb-10">
                  {slide.tagline}
                </p>

                {/* Stats row */}
                <div className="flex flex-wrap gap-6 mb-10">
                  {slide.stats.map((s, i) => (
                    <div key={i} className="flex flex-col gap-0.5">
                      <span
                        className="text-2xl font-display font-black leading-none tracking-tight"
                        style={{ color: slide.accentColor }}
                      >
                        {s.value}
                      </span>
                      <span className="text-[9px] font-bold text-white/35 uppercase tracking-[0.2em]">
                        {s.label}
                      </span>
                    </div>
                  ))}
                  <div className="self-stretch w-px bg-white/10" />
                  <div className="flex flex-col gap-0.5 justify-center">
                    <span className="text-[9px] font-black text-white/25 uppercase tracking-[0.2em]">Segment</span>
                    <span className="text-sm font-black text-white/60 uppercase tracking-tight">{slide.tag}</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-4">
                  <Link href={slide.primaryCta.href}>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="group relative overflow-hidden text-white px-7 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-[0.25em] flex items-center gap-3 shadow-2xl transition-all duration-300"
                      style={{ backgroundColor: slide.accentColor }}
                    >
                      <span className="relative z-10">{slide.primaryCta.label}</span>
                      <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                    </motion.button>
                  </Link>
                  <Link href={slide.secondaryCta.href}>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="group bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white/80 hover:text-white px-7 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-[0.25em] flex items-center gap-3 transition-all duration-300"
                    >
                      {slide.secondaryCta.label}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ═══ RIGHT: Image Card Panel (desktop only) ═══ */}
          <div className="hidden lg:flex items-center justify-center py-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={`card-${slide.id}`}
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.75, ease: [0.33, 1, 0.68, 1] }}
                className="relative w-full h-full max-h-[560px] flex items-center"
              >
                {/* Card frame */}
                <div className="relative w-full rounded-3xl overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]"
                  style={{ aspectRatio: "3/4", border: `1px solid ${slide.accentColor}30` }}
                >
                  <img
                    src={slide.image}
                    alt={slide.category}
                    className="w-full h-full object-cover"
                    style={{ filter: "brightness(0.75) saturate(1.1)" }}
                  />
                  {/* Bottom info overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-3 text-[9px] font-black uppercase tracking-[0.25em]"
                      style={{ backgroundColor: `${slide.accentColor}20`, color: slide.accentColor, border: `1px solid ${slide.accentColor}30` }}
                    >
                      {slide.icon} {slide.category}
                    </div>
                    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${slide.stats.length}, minmax(0, 1fr))` }}>
                      {slide.stats.map((s, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10">
                          <div className="text-base font-black text-white leading-none mb-1" style={{ color: i === 0 ? slide.accentColor : "white" }}>
                            {s.value}
                          </div>
                          <div className="text-[8px] font-bold text-white/40 uppercase tracking-wider">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Corner accent */}
                  <div
                    className="absolute top-4 right-4 w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: slide.accentColor }}
                  />
                </div>

                {/* Floating glow behind card */}
                <div
                  className="absolute -z-10 w-48 h-48 rounded-full blur-3xl opacity-30 bottom-0 right-0"
                  style={{ backgroundColor: slide.accentColor }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ═══ BOTTOM CONTROLS BAR ═══ */}
        <div className="absolute bottom-0 left-0 right-0 z-20 flex items-stretch" style={{ height: "72px", borderTop: "1px solid rgba(255,255,255,0.06)", backgroundColor: "rgba(6,11,23,0.85)", backdropFilter: "blur(20px)" }}>

          {/* Prev button */}
          <button
            onClick={goPrev}
            aria-label="Previous slide"
            className="flex items-center justify-center w-16 hover:bg-white/5 transition-colors duration-200 border-r border-white/[0.06] flex-shrink-0"
          >
            <ChevronLeft className="w-5 h-5 text-white/50 hover:text-white transition-colors" />
          </button>

          {/* Thumbnail strip */}
          <div className="flex flex-1 items-center gap-0 overflow-hidden">
            {slides.map((s, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                aria-label={`Slide ${idx + 1}: ${s.category}`}
                className={`relative flex-1 h-full flex items-center gap-3 px-5 transition-all duration-300 border-r border-white/[0.06] overflow-hidden ${idx === currentSlide ? "bg-white/5" : "hover:bg-white/[0.03]"}`}
              >
                {/* Active indicator line at top */}
                {idx === currentSlide && (
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ backgroundColor: s.accentColor }}
                  />
                )}
                {/* Thumb image */}
                <div className={`w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 ${idx === currentSlide ? "ring-2" : "opacity-50"}`}
                  style={idx === currentSlide ? { boxShadow: `0 0 0 2px ${s.accentColor}` } : undefined}
                >
                  <img src={s.thumb} alt={s.category} className="w-full h-full object-cover" />
                </div>
                {/* Label */}
                <div className="text-left hidden sm:block min-w-0">
                  <div className={`text-[9px] font-black uppercase tracking-[0.2em] truncate transition-colors duration-300 ${idx === currentSlide ? "text-white" : "text-white/35"}`}>
                    {s.category}
                  </div>
                  <div className="text-[8px] font-bold text-white/25 uppercase tracking-widest">{s.number}</div>
                </div>

                {/* Progress bar (only active) */}
                {idx === currentSlide && (
                  <motion.div
                    key={currentSlide}
                    className="absolute bottom-0 left-0 h-[2px]"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 8, ease: "linear" }}
                    style={{ backgroundColor: s.accentColor, opacity: 0.4 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={goNext}
            aria-label="Next slide"
            className="flex items-center justify-center w-16 hover:bg-white/5 transition-colors duration-200 border-l border-white/[0.06] flex-shrink-0"
          >
            <ChevronRight className="w-5 h-5 text-white/50 hover:text-white transition-colors" />
          </button>
        </div>
      </section>


      {/* 2. Industrial Benchmarks Section */}
      {/* 2. Digital Fingerprint / Warranty Verification Section (Premium Home Integration) */}
      {/* 2. Manufacturing Excellence & R&D (Replacing Warranty Section) */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-primary/5 rounded-r-[10rem] blur-3xl opacity-50"></div>
        <div className="section-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="inline-flex items-center gap-4">
                <div className="w-12 h-1 bg-primary rounded-full"></div>
                <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.6em]">Scale & Precision</h2>
              </div>

              <h3 className="text-4xl md:text-7xl font-display font-black text-secondary tracking-tighter leading-none uppercase">
                Manufacturing <br /> <span className="text-primary italic">Excellence.</span>
              </h3>

              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
                Our facility in kashipur is Engineered for high volume, High Precision and Low defect-Production. From Automatic Spot Welding to AI-driven battery balancing machines, We define Standard for Lithium Battery Reliability.
              </p>

              <div className="grid grid-cols-2 gap-8 pt-6">
                {[
                  { label: "Daily Capacity", value: "100+", unit: "Packs", icon: <Database className="w-5 h-5" /> },
                  { label: "R&D Consultants", value: "25+", unit: "Experts", icon: <Users className="w-5 h-5" /> },
                  { label: "Certification", value: "BIS", unit: "Certified", icon: <ShieldCheck className="w-5 h-5" /> },
                  { label: "Testing Hub", value: "100%", unit: "QA/QC", icon: <Trophy className="w-5 h-5" /> }
                ].map((stat, i) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                      {stat.icon}
                    </div>
                    <div>
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</h5>
                      <p className="text-xl font-display font-black text-secondary">
                        {stat.value} <span className="text-[10px] text-primary">{stat.unit}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-10">
                <Link href="/about">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-secondary text-white px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 shadow-xl hover:bg-secondary/90 transition-all"
                  >
                    Read More <ArrowRight className="w-4 h-4 text-primary" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(10,17,42,0.3)] border-[12px] border-white relative aspect-video lg:aspect-square group bg-black">
                <iframe
                  src="https://www.youtube.com/embed/eS8XFro3Q78?autoplay=0&controls=1&rel=0&modestbranding=0"
                  title="XORBIT EV Manufacturing & Technical Comparison"
                  className="w-full h-full object-cover"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>

                {/* Watch on YouTube Overlay (Top Right) */}
                <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <a
                    href="https://www.youtube.com/watch?v=eS8XFro3Q78"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass px-6 py-3 rounded-full text-[10px] font-black text-secondary uppercase tracking-widest flex items-center gap-3 hover:bg-primary hover:text-white transition-all shadow-2xl"
                  >
                    View on YouTube <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Floating HUD Element (Repositioned to not block controls) */}
                {/* <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 left-10 glass-dark p-6 rounded-[2.5rem] shadow-2xl border border-white/10 z-20 pointer-events-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                      <Gauge className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="text-[8px] font-black text-white/50 uppercase tracking-[0.3em]">Batch Efficiency</h5>
                      <p className="text-lg font-display font-black text-white uppercase tracking-tighter">99.98% OKR</p>
                    </div>
                  </div>
                </motion.div> */}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Strategic Partners Section */}

      {/* Industries We Serve Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="section-container relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-black text-secondary mb-6 uppercase tracking-tighter">
              Industries We Serve
            </h2>
            <div className="w-32 h-1.5 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { title: "E-Bike & E-Scooter", image: "/e-bike.jpg" },
              { title: "E-Rickshaw & E-Cargo", image: "/e-r.webp" },
              { title: "Solar Battery", image: "/solo.webp" }
            ].map((industry, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-[3rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-100 group hover:shadow-[0_30px_80px_rgba(0,0,0,0.12)] transition-all duration-700 hover:-translate-y-2"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={industry.image}
                    alt={industry.title}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                  />
                </div>
                <div className="p-10 text-center">
                  <h4 className="text-lg font-black text-secondary uppercase tracking-tight leading-tight group-hover:text-primary transition-colors duration-300">
                    {industry.title}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Battery Innovation Spotlight (Dynamic from DB) */}
      <section className="py-24 bg-white relative">
        <div className="section-container relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.6em] mb-6">Core Business</h2>
              <h3 className="text-4xl md:text-6xl font-display font-black text-secondary tracking-tighter uppercase leading-none">
                LFP <span className="text-primary italic">Innovation</span> Spotlight.
              </h3>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Link href="/batteries" className="group inline-flex items-center gap-4 bg-slate-50 px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest text-secondary hover:bg-primary hover:text-white transition-all">
                Full Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {loadingBatteries ? (
            <div className="py-20 flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : featuredBatteries.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">No battery models in spotlight.</p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {featuredBatteries.map((battery) => (
                <ProductCard
                  key={battery.id}
                  name={battery.name}
                  category={battery.category}
                  image={battery.image}
                  specs={battery.specs}
                  features={battery.features}
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>



      {/* 5. Global Ecosystem Grid */}
      <section className="py-24 bg-white relative">
        <div className="section-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.6em] mb-6">Our Ecosystem</h2>
            <h3 className="text-4xl md:text-7xl font-display font-black text-secondary tracking-tighter leading-none uppercase italic break-words">The Standard.</h3>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {[
              { icon: Battery, title: "LFP PACKS", desc: "Industrial-grade lithium modules for high-capacity EV mobility.", link: "/batteries" },
              { icon: Bike, title: "X-MOBILITY", desc: "Precision electric cycle fleets for urban logistics.", link: "/ev-cycles" },
              { icon: Zap, title: "BATTERY CUSTOMIZATION", desc: "Custom BMS hardware and intelligence engineering.", link: "/technology" }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-white p-12 rounded-[4rem] shadow-[0_40px_80px_-20px_rgba(10,17,42,0.08)] transition-all duration-500 border border-slate-50 hover:border-primary/20 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-10 text-secondary transition-all duration-500 shadow-inner">
                  <item.icon className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-display font-black text-secondary mb-6 tracking-tight uppercase">{item.title}</h4>
                <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10">{item.desc}</p>
                <Link href={item.link} className="inline-flex items-center gap-3 font-black text-primary uppercase tracking-[0.2em] text-[10px] border-b-2 border-primary/10 hover:border-primary transition-all pb-1">
                  Specifications <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <CTABanner />
    </div>
  );
}
