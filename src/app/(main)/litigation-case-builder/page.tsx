import type { Metadata } from "next";
import { litigationCaseBuilderMetadata } from "@/lib/seo/metadata";
import DifferentiatorsSection from "./components/differentiators-section";
import FeaturesGridSection from "./components/features-grid-section";
import FinalCTASection from "./components/final-cta-section";
import HeroSection from "./components/hero-section";

export const metadata: Metadata = litigationCaseBuilderMetadata;

export default function LitigationCaseBuilderPage() {
  return (
    <main className="relative z-10 flex w-full flex-col overflow-x-hidden bg-sky-blue-100">
      {/* Hero Section with 1 CTA button */}
      <HeroSection />

      {/* Features Grid Section - 6 cards (2x3) */}
      <FeaturesGridSection />

      {/* Differentiators Section - 4 cards (2x2) */}
      <DifferentiatorsSection />

      {/* Final CTA Section - 2 buttons */}
      <FinalCTASection />
    </main>
  );
}
