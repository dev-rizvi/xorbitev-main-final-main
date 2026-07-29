import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Protocol",
  description: "Learn how XORBIT EV protects, collects, and processes personal and enterprise operational data across our products and services.",
  keywords: ["XORBIT EV privacy policy", "data protection protocol", "privacy statement", "lithium battery enterprise privacy"],
  alternates: {
    canonical: "https://xorbitev.com/privacy",
  },
  openGraph: {
    title: "Privacy Protocol | XORBIT EV",
    description: "Learn how XORBIT EV protects, collects, and processes personal and enterprise operational data.",
    url: "https://xorbitev.com/privacy",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
