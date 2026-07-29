import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "From a research project to an industrial leader. Discover the story, mission, and vision of XORBIT EV in the clean energy revolution.",
  keywords: ["XORBIT EV history", "lithium battery startup India", "sustainable energy mission", "clean mobility vision"],
  alternates: {
    canonical: "https://xorbitev.com/about",
  },
  openGraph: {
    title: "About XORBIT EV | Mission & Story",
    description: "From a research project to an industrial leader. Discover the story, mission, and vision of XORBIT EV.",
    url: "https://xorbitev.com/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
