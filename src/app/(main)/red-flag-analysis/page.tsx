import type { Metadata } from "next";
import { redFlagAnalysisMetadata } from "@/lib/seo/metadata";
import ChatboxSection from "./components/chatbox-section";
import CTASection from "./components/cta-section";
import FeaturesSection from "./components/features-section";
import HeroSection from "./components/hero-section";

export const metadata: Metadata = redFlagAnalysisMetadata;

export default function RedFlagAnalysisPage() {
  return (
    <main className="relative z-10 flex w-full flex-col overflow-x-hidden bg-sky-blue-100">
      {/* Hero Section */}
      <HeroSection />

      {/* CTA Section - with scroll to chatbox button */}
      <CTASection />

      {/* Features Section - with alternating layout */}
      <FeaturesSection />

      {/* Chatbox Section - interactive input */}
      <ChatboxSection />
    </main>
  );
}
