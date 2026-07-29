"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageSquare, Send, Zap, ShieldCheck, Globe } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";

export default function ContactPage() {
  const [settings, setSettings] = React.useState<any>(null);

  React.useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => { });
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    email: "",
    focus: "EV Mobility (Cycles/Bikes)",
    requirements: ""
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsSuccess(true);
        setFormData({ name: "", phone: "", email: "", focus: "EV Mobility (Cycles/Bikes)", requirements: "" });
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        alert("Failed to send request. Please try again.");
      }
    } catch (error) {
      alert("Error connecting to server. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24 overflow-x-hidden">
      {/* 1. Cinematic Hero */}
      <PageHero
        title="Powering Your"
        subtitle="Transition"
        badge="Global Inquiry Hub"
        icon={MessageSquare}
        description="Specialized engineering support for high-performance Lithium-Ion battery packs and precision-engineered EV Mobility fleets."
      />

      {/* 2. Overlapping Contact Grid with Premium Cards */}
      <section className="relative -mt-16 z-20 section-container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Corporate Info (4 cols) */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-6"
          >
            <motion.div
              variants={fadeInUp}
              className="glass-dark p-10 rounded-[3rem] border border-white/5 space-y-10"
            >
              <div className="space-y-4">
                <h2 className="text-3xl font-display font-black text-white tracking-tight uppercase">Direct Access</h2>
                <p className="text-white/40 text-sm leading-relaxed font-medium">
                  Our engineering team is available for technical consultations regarding LFP battery integration and EV cycle fleet deployments.
                </p>
              </div>

              <div className="space-y-4">
                {/* Call Card */}
                <div className="flex gap-6 p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-500 group">
                  <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shrink-0 shadow-[0_10px_30px_rgba(0,102,255,0.3)]">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Corporate Hotline</h4>
                    <p className="text-xl font-bold text-white tracking-tight">{settings?.phone || '+91 8533012312'}</p>
                  </div>
                </div>

                {/* Email Card */}
                <div className="flex gap-6 p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-500 group">
                  <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center shrink-0 shadow-[0_10px_30px_rgba(16,185,129,0.2)]">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Inquiry Support</h4>
                    <p className="text-xl font-bold text-white tracking-tight">{settings?.email || 'sales@xorbitev.com'}</p>
                  </div>
                </div>

                {/* Location Card */}
                <div className="flex gap-6 p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-500 group">
                  <div className="w-14 h-14 bg-slate-700 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Manufacturing Hub</h4>
                    <p className="text-lg font-bold text-white tracking-tight leading-tight">{settings?.address || 'Kashipur, Uttarakhand, India'}</p>
                  </div>
                </div>
              </div>

              {/* Social/Trust */}
              <div className="pt-8 border-t border-white/10 flex items-center justify-between">
                <div className="flex gap-4">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">BIS Certified Facility</span>
                </div>
                <Globe className="w-5 h-5 text-white/20" />
              </div>
            </motion.div>

            {/* Operational Image Card */}
            <motion.div
              variants={fadeInUp}
              className="relative rounded-[3rem] overflow-hidden aspect-video border-4 border-white shadow-2xl group"
            >
              <img
                src="/contact-hero.png"
                alt="R&D Lab"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/20 to-transparent"></div>
              <div className="absolute bottom-6 left-8">
                <h4 className="text-xl font-display font-black text-white tracking-tighter uppercase">Quantum Cell Labs</h4>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: High-Tech Inquiry Form (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-[#f8fafc] p-8 md:p-16 rounded-[4rem] border border-black/5 shadow-[0_50px_100px_-20px_rgba(10,17,42,0.1)] relative overflow-hidden"
          >
            {/* Decorative Subtle Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20l17.32 10V10L20 0 2.68 10v20L20 40z' fill-rule='evenodd' stroke='%23000' stroke-width='1' fill='none'/%3E%3C/svg%3E")`, backgroundSize: '20px' }}></div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-16 h-1 bg-primary rounded-full"></div>
                <h3 className="text-3xl md:text-5xl font-display font-black text-secondary tracking-tight uppercase">
                  Send an Inquiry
                </h3>
              </div>

              {isSuccess ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-black text-secondary uppercase tracking-tight mb-2">Request Dispatched</h4>
                  <p className="text-sm font-medium text-slate-500">Our engineering team has received your inquiry and will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8 font-medium">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter Name"
                        className="w-full bg-white border border-slate-200 p-5 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-semibold text-secondary shadow-sm"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98XXX XXXXX"
                        className="w-full bg-white border border-slate-200 p-5 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-semibold text-secondary shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter Email Address"
                      className="w-full bg-white border border-slate-200 p-5 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-semibold text-secondary shadow-sm"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Application Focus</label>
                    <div className="relative">
                      <select
                        value={formData.focus}
                        onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
                        className="w-full bg-white border border-slate-200 p-5 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-semibold text-secondary appearance-none cursor-pointer shadow-sm"
                      >
                        <option>EV Mobility (Cycles/Bikes)</option>
                        <option>Lithium-Ion / LFP Battery Packs</option>
                        <option>Industrial EV Power Systems</option>
                        <option>Custom Battery Engineering</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                        <Zap className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Technical Requirements</label>
                    <textarea
                      rows={5}
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      placeholder="Specify voltage, capacity, or fleet size..."
                      className="w-full bg-white border border-slate-200 p-5 rounded-[2.5rem] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-semibold text-secondary resize-none shadow-sm"
                    ></textarea>
                  </div>

                  <div className="pt-6">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="shimmer-btn w-full text-white py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl shadow-primary/30 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? "Dispatching..." : "Dispatch Request"} {!isSubmitting && <Send className="w-5 h-5" />}
                    </motion.button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Global Headquarters & Regional Offices Display */}
      <section className="mt-32 section-container max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-16 h-1 bg-primary rounded-full"></div>
          <h3 className="text-3xl md:text-5xl font-display font-black text-secondary tracking-tight uppercase">
            Our <span className="text-primary italic">Locations</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kashipur HQ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-secondary rounded-[4rem] overflow-hidden relative border-8 border-white shadow-2xl group min-h-[400px] flex items-center p-12"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-1000"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-transparent"></div>

            <div className="relative z-10 w-full">
              <div className="w-16 h-16 bg-primary/20 flex items-center justify-center rounded-2xl mb-8 text-primary border border-primary/30">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-display font-black text-white mb-2 tracking-tight uppercase">Corporate HQ</h3>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6">Manufacturing & R&D Hub</p>
              <p className="text-white/50 font-medium leading-relaxed mb-10 text-sm">
                Shriji Complex, Xorbit Ev, Ramnagar Rd, <br />
                near Royal Enfield Showroom, Kashipur, <br />
                Uttarakhand 244713
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=xorbit+ev,+shriji+complex,+Xorbit+Ev,+Ramnagar+Rd,+near+Royal+Enfield+Showroom,+Kashipur,+Uttarakhand+244713"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-secondary px-10 py-4 rounded-full font-black text-xs tracking-widest uppercase hover:bg-primary hover:text-white transition-all shadow-xl"
              >
                Open Map
              </a>
            </div>
          </motion.div>

          {/* Lucknow Office */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-[4rem] overflow-hidden relative border-8 border-white shadow-2xl group min-h-[400px] flex items-center p-12"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-10 group-hover:opacity-20 group-hover:scale-105 transition-all duration-1000"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>

            <div className="relative z-10 w-full">
              <div className="w-16 h-16 bg-accent/20 flex items-center justify-center rounded-2xl mb-8 text-accent border border-accent/30">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-display font-black text-white mb-2 tracking-tight uppercase">Regional Office</h3>
              <p className="text-[10px] font-black text-accent uppercase tracking-[0.3em] mb-6">Sales & Operations Hub</p>
              <p className="text-white/50 font-medium leading-relaxed mb-10 text-sm">
                5/761, Sector 5,<br />
                Gomti Nagar Extension, Lucknow, <br />
                Uttar Pradesh 226010
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=RSM+Medicals,+Sector+5,+Sector+6,+Gomti+Nagar,+Lucknow,+Uttar+Pradesh+226010"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-secondary px-10 py-4 rounded-full font-black text-xs tracking-widest uppercase hover:bg-accent hover:text-white transition-all shadow-xl"
              >
                Open Map
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
