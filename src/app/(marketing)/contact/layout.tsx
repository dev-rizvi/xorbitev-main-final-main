import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & Inquiry Hub",
  description: "Get in touch with XORBIT EV experts for battery pack inquiries, custom enterprise solutions, technical support, and partnership opportunities.",
  keywords: ["contact XORBIT EV", "EV battery manufacturer inquiry", "lithium battery support", "Kashipur Uttarakhand XORBIT"],
  alternates: {
    canonical: "https://xorbitev.com/contact",
  },
  openGraph: {
    title: "Contact Us & Inquiry Hub | XORBIT EV",
    description: "Get in touch with XORBIT EV experts for battery pack inquiries and enterprise solutions.",
    url: "https://xorbitev.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
