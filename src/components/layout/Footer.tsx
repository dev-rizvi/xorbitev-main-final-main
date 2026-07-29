import Link from "next/link";
import { Zap, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function Footer({
  logo,
  email,
  phone,
  address,
  companyName
}: {
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  companyName?: string;
}) {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/people/Xorbit-EV/61555568136163/",
      icon: (props: any) => (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      )
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/xorbitev/",
      icon: (props: any) => (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    },
  ];

  return (
    <footer className="bg-secondary text-white pt-16 pb-12 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] -translate-x-1/4 translate-y-1/4"></div>

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">

          {/* 1. Brand Presence */}
          <div className="space-y-8">
            <Link href="/">
              <Logo src={logo} />
            </Link>
            <p className="text-white/50 text-sm leading-relaxed font-medium max-w-xs">
              Pioneering the next generation of high-performance lithium ecosystems for a sustainable industrial future.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, idx) => (
                <Link
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 group"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* 2. Solutions Area */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.4em] mb-10 text-white/90">Solutions</h4>
            <ul className="space-y-5">
              {[
                { name: "EV Battery Packs", href: "/batteries" },
                { name: "EV Cycles", href: "/ev-cycles" },
                { name: "Warranty", href: "/warranty" },
                { name: "Technology", href: "/technology" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/40 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Company & Policy */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.4em] mb-10 text-white/90">Company</h4>
            <ul className="space-y-5">
              {[
                { name: "About XORBIT", href: "/about" },
                { name: "Contact Hub", href: "/contact" },
                { name: "Privacy Protocol", href: "/privacy" },
                { name: "Terms & Conditions", href: "/terms" },

              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/40 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Contact & Headquarters */}
          <div className="space-y-12">
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.4em] mb-10 text-white/90">Operational Hub</h4>
              <ul className="space-y-6">
                <li className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-sm">
                    <p className="text-white/30 font-black uppercase tracking-tighter text-[9px] mb-1">Inquiry Hotline</p>
                    <p className="font-bold text-white/80">{phone || "+91 8533012312"}</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-sm">
                    <p className="text-white/30 font-black uppercase tracking-tighter text-[9px] mb-1">Corporate Email</p>
                    <p className="font-bold text-white/80">{email || "sales@xorbitev.com"}</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-sm">
                    <p className="text-white/30 font-black uppercase tracking-tighter text-[9px] mb-1">Headquarters</p>
                    <p className="font-bold text-white/80 leading-relaxed whitespace-pre-line">
                      {address || "Kashipur, Uttarakhand \nIndia - 244713"}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

        </div>{/* ← grid closes here */}

        {/* Bottom Bar — full width across all columns */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] text-center md:text-left">
            © {currentYear} {companyName || "Xorbit EV"}. Engineering the Future. All rights reserved.
          </p>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
            <Link
              href="https://www.webeedream.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/20 hover:text-primary text-[10px] font-black uppercase tracking-[0.4em] transition-colors duration-300"
            >
              Design by Webeedream Technologies Pvt Ltd
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}