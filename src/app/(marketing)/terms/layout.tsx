import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Read the official terms, legal agreements, and operational conditions for using XORBIT EV products, battery packs, and web services.",
  keywords: ["XORBIT EV terms and conditions", "battery warranty terms", "EV battery terms", "legal agreement"],
  alternates: {
    canonical: "https://xorbitev.com/terms",
  },
  openGraph: {
    title: "Terms & Conditions | XORBIT EV",
    description: "Read the official terms, legal agreements, and operational conditions for XORBIT EV products.",
    url: "https://xorbitev.com/terms",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
