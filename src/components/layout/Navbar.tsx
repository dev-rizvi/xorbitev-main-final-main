"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { Menu, X, Battery, Zap } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

const NavLinks = [
  { name: "Home", href: "/" },
  { name: "Batteries", href: "/batteries" },
  { name: "EV Cycles", href: "/ev-cycles" },
  { name: "Warranty", href: "/warranty" },
  { name: "Technology", href: "/technology" },
  { name: "About", href: "/about" },
];

export function Navbar({ logo }: { logo?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 ease-in-out",
        scrolled
          ? "glass py-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] translate-y-0"
          : "bg-transparent py-6"
      )}
    >
      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary z-50"
        style={{ scaleX }}
      />
      <div className="section-container flex items-center justify-between">
        {/* Corporate Logo Implementation */}
        <Link href="/">
          <Logo scrolled={scrolled} src={logo} />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          {NavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-[13px] font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:tracking-[0.25em] relative py-1",
                  scrolled
                    ? (isActive ? "text-primary" : "text-secondary/70 hover:text-primary")
                    : (isActive ? "text-white" : "text-white/70 hover:text-white")
                )}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className={cn(
                      "absolute -bottom-1 left-0 right-0 h-0.5 rounded-full",
                      scrolled ? "bg-primary" : "bg-white"
                    )}
                  />
                )}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className={cn(
              "px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl",
              scrolled
                ? "shimmer-btn text-white"
                : "bg-white text-secondary hover:bg-white/90"
            )}
          >
            Get Quote
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className={cn(
            "md:hidden p-2 rounded-lg transition-colors",
            scrolled ? "text-secondary hover:bg-secondary/5" : "text-white hover:bg-white/10"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-2xl border-t border-slate-100 animate-fade-in divide-y divide-black/5 h-screen overflow-y-auto pb-32">
          <div className="flex flex-col p-8 gap-6">
            {NavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-2xl font-display font-black tracking-tight transition-colors flex items-center justify-between",
                    isActive ? "text-primary" : "text-secondary hover:text-primary"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                  {isActive && <Zap className="w-5 h-5 text-primary" />}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="shimmer-btn text-white text-center py-5 rounded-2xl font-black uppercase tracking-widest mt-4 shadow-xl"
              onClick={() => setIsOpen(false)}
            >
              Get Quote
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
