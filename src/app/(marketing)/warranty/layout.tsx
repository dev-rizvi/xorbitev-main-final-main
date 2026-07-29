import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warranty Policy & Claim Portal",
  description: "Check XORBIT EV battery pack warranty terms, coverage details, and register or track your battery warranty online.",
  keywords: ["XORBIT EV warranty", "lithium battery warranty claim", "EV battery warranty policy", "battery registration"],
  alternates: {
    canonical: "https://xorbitev.com/warranty",
  },
  openGraph: {
    title: "Warranty Policy & Claim Portal | XORBIT EV",
    description: "Check XORBIT EV battery pack warranty terms, coverage details, and register or track your battery warranty.",
    url: "https://xorbitev.com/warranty",
  },
};

export default function WarrantyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
