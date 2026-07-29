import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lithium Battery Technology & Innovation",
  description: "Explore XORBIT EV's proprietary BMS architecture, thermal management systems, cell chemistry, and safety engineering for next-gen energy storage.",
  keywords: ["battery management system", "BMS technology", "lithium thermal management", "XORBIT technology"],
  alternates: {
    canonical: "https://xorbitev.com/technology",
  },
  openGraph: {
    title: "Lithium Battery Technology & Innovation | XORBIT EV",
    description: "Explore XORBIT EV's proprietary BMS architecture, thermal management, and safety engineering.",
    url: "https://xorbitev.com/technology",
  },
};

export default function TechnologyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
