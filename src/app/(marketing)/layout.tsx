import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { prisma } from "@/lib/prisma";

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch dynamic settings for logo with fallback for build time
  let settings = null;
  try {
    settings = await prisma.systemSettings.findUnique({
      where: { id: "global" }
    });
  } catch (error) {
    console.warn("Failed to fetch system settings during build, using defaults:", error);
  }

  return (
    <>
      <Navbar logo={settings?.logo || undefined} />
      <main className="flex-1">
        {children}
      </main>
      <Footer 
        logo={settings?.logo || undefined} 
        email={settings?.email || undefined}
        phone={settings?.phone || undefined}
        address={settings?.address || undefined}
        companyName={settings?.companyName || undefined}
      />
      <WhatsAppButton phone={settings?.phone || undefined} />
    </>
  );
}
