import { Metadata } from "next";

export const metadata: Metadata = {
  title: "High-Performance EV Batteries",
  description: "Explore our range of industrial-grade lithium-ion batteries. Engineered for high density, safety, and long cycle life for EVs and energy storage.",
  keywords: ["EV batteries", "lithium-ion battery packs", "LFP battery manufacturer", "industrial energy storage"],
  alternates: {
    canonical: "https://xorbitev.com/batteries",
  },
  openGraph: {
    title: "High-Performance EV Batteries | XORBIT EV",
    description: "Explore our range of industrial-grade lithium-ion batteries engineered for high density and safety.",
    url: "https://xorbitev.com/batteries",
  },
};

export default function BatteriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
