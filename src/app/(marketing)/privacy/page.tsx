"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Eye, Lock, Database, Globe, UserCheck, ShieldAlert, Mail, Phone, MapPin, Share2 } from "lucide-react";

import { PageHero } from "@/components/ui/PageHero";

export default function PrivacyPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] }
  };

  const sections = [
    {
      icon: Database,
      title: "1. Information We Collect",
      content: "We collect both personal and non-personal information. This includes contact details (Name, Xorbitev@gmail.com, +918533012312, Address), securely processed payment data, and device/usage data collected through cookies. We also collect location data for enhanced features such as navigation and real-time riding data."
    },
    {
      icon: ShieldCheck,
      title: "2. How We Use Your Information",
      content: "Information is used for order fulfillment, customer support, product enhancement, and marketing (if you opt-in). We also use data to ensure legal and safety compliance for our customers."
    },
    {
      icon: Share2,
      title: "3. Sharing of Your Information",
      content: "We do not sell or rent your personal information. We may share data with trusted service providers for shipping, payments, and website management, or if required by law during legal proceedings or business transfers."
    },
    {
      icon: Globe,
      title: "4. Cookies & Tracking",
      content: "Our website uses cookies to personalize your experience and for analytics. You can manage cookie preferences through your browser settings, though some functionality may be limited."
    },
    {
      icon: Lock,
      title: "5. Security Standards",
      content: "We take robust measures, including encryption and secure servers, to protect your data. While we strive for complete security, no internet transmission or storage can be guaranteed as 100% secure."
    },
    {
      icon: ShieldAlert,
      title: "6. Third-Party Links",
      content: "Our site may contain links to external websites. We are not responsible for their privacy practices and recommend reviewing their policies before providing any personal information."
    },
    {
      icon: UserCheck,
      title: "7. Children's Privacy",
      content: "Our services are not intended for individuals under 13. We do not knowingly collect data from children and will take immediate steps to delete any inadvertently collected information."
    },
    {
      icon: Eye,
      title: "8. Your Rights",
      content: "You have the right to access, correct, or delete your personal data. You may also opt-out of marketing communications at any time by contacting our support team directly."
    },
    {
      icon: ShieldCheck,
      title: "9. Policy Updates",
      content: "We may update this policy periodically to reflect changes in practices or laws. Updates will be posted on this page, and we encourage regular review."
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-24 overflow-x-hidden">
      {/* 1. Cinematic Hero */}
      <PageHero 
        title="Privacy"
        subtitle="Protocol"
        badge="Data Integrity Hub"
        icon={Lock}
        description="At Xorbit EV, your privacy is paramount. We are committed to transparency and the highest standards of data security in our lithium technology ecosystems."
      />

      {/* 2. Structured Content */}
      <section className="section-container py-24">
        <div className="max-w-4xl mx-auto grid grid-cols-1 gap-12">
            {sections.map((section, idx) => (
                <motion.div 
                    key={idx}
                    variants={fadeInUp}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row gap-8 p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500 group"
                >
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:bg-primary group-hover:text-white transition-all">
                        <section.icon className="w-8 h-8" />
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-display font-black text-secondary uppercase tracking-tight">{section.title}</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            {section.content}
                        </p>
                    </div>
                </motion.div>
            ))}

            {/* 10. Contact Us Footer */}
            <motion.div 
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="bg-secondary p-12 rounded-[4rem] text-white space-y-10"
            >
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/10 pb-10">
                    <h3 className="text-4xl font-display font-black uppercase tracking-tighter">10. Data Support</h3>
                    <p className="text-white/40 text-sm font-bold uppercase tracking-[0.2em]">Revision: May 2024</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-primary uppercase text-[10px] font-black tracking-widest">
                            <Mail className="w-4 h-4" /> Privacy Email
                        </div>
                        <p className="text-xl font-bold">Xorbitev@gmail.com</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-primary uppercase text-[10px] font-black tracking-widest">
                            <Phone className="w-4 h-4" /> Data Hotline
                        </div>
                        <p className="text-xl font-bold">+91 8533012312</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-primary uppercase text-[10px] font-black tracking-widest">
                            <MapPin className="w-4 h-4" /> Data Center
                        </div>
                        <p className="text-xl font-bold">Xorbit EV Pvt</p>
                    </div>
                </div>

                <div className="pt-6">
                    <p className="text-white/60 italic font-medium leading-relaxed">
                        "Your trust is the foundation of our engineering excellence. We protect your data with the same precision we build our batteries."
                    </p>
                </div>
            </motion.div>
        </div>
      </section>
    </div>
  );
}
