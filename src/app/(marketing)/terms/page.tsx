"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, ShieldCheck, Zap, ShoppingCart, Truck, Clock, Info, ShieldAlert, Mail, Phone, MapPin } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";

export default function TermsPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] }
  };

  const sections = [
    {
      icon: Info,
      title: "1. Introduction",
      content: "These Terms and Conditions apply to all users of Xorbit EV, including visitors, customers, and anyone who accesses our website or makes a purchase. By using our website, you agree to be bound by these terms."
    },
    {
      icon: Zap,
      title: "2. Use of Our Website",
      content: "You may use our website solely for lawful purposes. You are not allowed to use it in a way that may damage, impair, or disable any features or interfere with another party's use of our website. We reserve the right to terminate your access to our site if you violate these terms."
    },
    {
      icon: FileText,
      title: "3. Product Information",
      content: "We strive to ensure that all descriptions, images, and pricing of our electric bikes are accurate and up-to-date. However, slight variations in color, appearance, or other aspects of our products may occur due to differences in computer displays or other technical factors. Xorbit EV reserves the right to change product descriptions, specifications, and prices at any time without notice."
    },
    {
      icon: ShoppingCart,
      title: "4. Orders and Payment",
      content: "When you place an order with Xorbit EV, you agree that all details you provide are accurate, complete, and valid. All orders are subject to availability and approval. Payments can be made via credit card, debit card, or other payment methods as indicated on our site. Xorbit EV does not store your payment details."
    },
    {
      icon: Truck,
      title: "5. Shipping and Delivery",
      content: "We offer shipping across specific regions, as outlined on our website. Shipping times may vary depending on your location and product availability. We are not responsible for delays caused by factors beyond our control (e.g., natural disasters, shipping carrier delays, etc.)."
    },
    {
      icon: ShieldCheck,
      title: "6. Warranty",
      content: "Xorbit EV electric bikes come with a 1-year warranty on Battery and Motor. Defected parts will be checked by a technician and replaced if found faulty. The warranty does not cover normal wear and tear, damage caused by improper use, accidents, unauthorized repairs, or modifications not made by Xorbit EV."
    },
    {
      icon: LockIcon,
      title: "7. Intellectual Property",
      content: "All content, design, images, and materials on our website are the intellectual property of Xorbit EV and are protected by copyright, trademark, and other laws. You may not reproduce, distribute, or otherwise use any of our content without explicit written permission."
    },
    {
      icon: ShieldAlert,
      title: "8. Limitation of Liability",
      content: "Xorbit EV cannot be held liable for any direct, indirect, incidental, or consequential damages arising from the use of our website or products. Our total liability is limited to the amount paid by you for any product or service purchased through our website."
    },
    {
        icon: Clock,
        title: "9. Changes to Terms",
        content: "We reserve the right to update or modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on our website. It is your responsibility to review these terms periodically for any updates."
    }
  ];

  function LockIcon(props: any) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    )
  }

  return (
    <div className="bg-white min-h-screen pb-24 overflow-x-hidden">
      {/* 1. Cinematic Hero */}
      <PageHero 
        title="Terms &"
        subtitle="Conditions"
        badge="Corporate Compliance"
        icon={ShieldCheck}
        description="Welcome to Xorbit EV. Please review our operational framework and legal guidelines designed to protect our community and engineering standards."
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
                    <h3 className="text-4xl font-display font-black uppercase tracking-tighter">10. Contact Hub</h3>
                    <p className="text-white/40 text-sm font-bold uppercase tracking-[0.2em]">Last Updated: May 2024</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-primary uppercase text-[10px] font-black tracking-widest">
                            <Mail className="w-4 h-4" /> Email Hub
                        </div>
                        <p className="text-xl font-bold">Xorbitev@gmail.com</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-primary uppercase text-[10px] font-black tracking-widest">
                            <Phone className="w-4 h-4" /> Direct Line
                        </div>
                        <p className="text-xl font-bold">+91 8533012312</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-primary uppercase text-[10px] font-black tracking-widest">
                            <MapPin className="w-4 h-4" /> Location
                        </div>
                        <p className="text-xl font-bold">Xorbit EV Pvt</p>
                    </div>
                </div>

                <div className="pt-6">
                    <p className="text-white/60 italic font-medium leading-relaxed">
                        "We appreciate your business and are committed to providing you with the best electric bike experience possible."
                    </p>
                </div>
            </motion.div>
        </div>
      </section>
    </div>
  );
}
