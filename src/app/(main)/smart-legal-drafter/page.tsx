import type { Metadata } from "next";
import { smartLegalDrafterMetadata } from "@/lib/seo/metadata";
import ExperienceSection from "./components/experience-section";
import FeaturesGridSection from "./components/features-grid-section";
import FinalCTASection from "./components/final-cta-section";
import HeroSection from "./components/hero-section";
import SelfRepresentationSection from "./components/self-representation-section";

export const metadata: Metadata = smartLegalDrafterMetadata;

export default function SmartLegalDrafterPage() {
  return (
    <main className="relative z-10 flex w-full flex-col overflow-x-hidden bg-sky-blue-100">
      {/* Hero Section with 2 CTA buttons */}
      <HeroSection />

      {/* Self-Representation Section - "Nearly two-thirds..." */}
      <SelfRepresentationSection />

      {/* Features Grid Section - 6 feature cards */}
      <FeaturesGridSection />

      {/* Experience Section - stats with CTA */}
      <ExperienceSection />

      {/* Final CTA Section - 2 buttons */}
      <FinalCTASection />
    </main>
  );
}
