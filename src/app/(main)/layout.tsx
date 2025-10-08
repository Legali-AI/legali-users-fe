import { AOSInit } from "@/aos";
import Navbar from "@/components/elements/navbar";
import { Footer } from "@/components/landing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legali - AI-Powered Legal Platform",
  description:
    "The smarter way to work with legal documents. AI-powered litigation analysis, crowdfunding, and comprehensive legal services.",
  keywords: [
    "legal platform",
    "AI legal assistant",
    "litigation crowdfunding",
    "legal documents",
    "lawyer services",
  ],
  openGraph: {
    title: "Legali - AI-Powered Legal Platform",
    description:
      "The smarter way to work with legal documents. AI-powered litigation analysis, crowdfunding, and comprehensive legal services.",
  },
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AOSInit />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
