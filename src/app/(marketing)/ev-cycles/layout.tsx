import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Electric Cycles & Smart Mobility",
  description: "Discover XORBIT EV electric cycle solutions powered by smart battery management system (BMS) for urban commuting and eco-friendly mobility.",
  keywords: ["electric cycles India", "smart EV cycle", "XORBIT electric cycles", "eco friendly mobility"],
  alternates: {
    canonical: "https://xorbitev.com/ev-cycles",
  },
  openGraph: {
    title: "Electric Cycles & Smart Mobility | XORBIT EV",
    description: "Discover XORBIT EV electric cycle solutions powered by smart battery management.",
    url: "https://xorbitev.com/ev-cycles",
  },
};

export default function EvCyclesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
