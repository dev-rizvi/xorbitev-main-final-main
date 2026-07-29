import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.systemSettings.findUnique({
    where: { id: 'global' }
  }).catch(() => null);

  const logoUrl = settings?.logo || "/favicon.png";
  const companyName = settings?.companyName || "XORBIT EV";

  return {
    metadataBase: new URL("https://xorbitev.com"),
    title: {
      default: `${companyName} | Advanced Lithium Battery Manufacturer`,
      template: `%s | ${companyName}`
    },
    description: "XORBIT EV is a leading manufacturer of high-performance lithium-ion batteries for electric vehicles, solar energy storage, and industrial applications. Engineered for durability and efficiency.",
    keywords: ["lithium battery", "EV battery manufacturer", "solar energy storage", "industrial lithium batteries", "XORBIT EV", "lithium-ion technology", "clean energy"],
    authors: [{ name: companyName }],
    creator: companyName,
    publisher: companyName,
    alternates: {
      canonical: "https://xorbitev.com",
    },
    icons: {
      icon: [
        { url: logoUrl },
        { url: logoUrl, sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: logoUrl, sizes: "180x180", type: "image/png" },
      ],
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://xorbitev.com",
      title: `${companyName} | Advanced Lithium Battery Manufacturer`,
      description: "High-performance lithium-ion batteries engineered for the future of mobility and energy storage.",
      siteName: companyName,
      images: [
        {
          url: "/favicon.png",
          width: 1200,
          height: 630,
          alt: "XORBIT EV - Advanced Lithium Battery Manufacturer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${companyName} | Advanced Lithium Battery Manufacturer`,
      description: "High-performance lithium-ion batteries engineered for the future of mobility and energy storage.",
      images: ["/favicon.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "Qt6mywh4NrQSVCuQx8-y97Tmyf6JJ_JOS2V88Tde5mI",
    },
    other: {
      "google-site-verification": "Qt6mywh4NrQSVCuQx8-y97Tmyf6JJ_JOS2V88Tde5mI",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://xorbitev.com/#organization",
        "name": "XORBIT EV",
        "url": "https://xorbitev.com",
        "logo": "https://xorbitev.com/favicon.png",
        "description": "Leading manufacturer of high-performance lithium-ion batteries for electric vehicles, solar energy storage, and industrial applications.",
        "telephone": "+91 8533012312",
        "email": "sales@xorbitev.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Kashipur",
          "addressRegion": "Uttarakhand",
          "postalCode": "244713",
          "addressCountry": "IN"
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://xorbitev.com/#localbusiness",
        "name": "XORBIT EV",
        "url": "https://xorbitev.com",
        "telephone": "+91 8533012312",
        "email": "sales@xorbitev.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Kashipur",
          "addressRegion": "Uttarakhand",
          "postalCode": "244713",
          "addressCountry": "IN"
        },
        "priceRange": "$$"
      },
      {
        "@type": "WebSite",
        "@id": "https://xorbitev.com/#website",
        "url": "https://xorbitev.com",
        "name": "XORBIT EV",
        "publisher": {
          "@id": "https://xorbitev.com/#organization"
        }
      }
    ]
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <meta name="google-site-verification" content="Qt6mywh4NrQSVCuQx8-y97Tmyf6JJ_JOS2V88Tde5mI" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
