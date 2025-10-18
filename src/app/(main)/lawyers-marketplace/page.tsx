import type { Metadata } from "next";
import { lawyersMarketplaceMetadata } from "@/lib/seo/metadata";
import ActionCardsSection from "./components/action-cards-section";
import FinalCTASection from "./components/final-cta-section";
import HeroSection from "./components/hero-section";
import HowItWorksSection from "./components/how-it-works-section";
import ProblemSolutionSection from "./components/problem-solution-section";

export const metadata: Metadata = lawyersMarketplaceMetadata;

export default function LawyersMarketplacePage() {
  return (
    <main className="relative z-10 flex w-full flex-col overflow-x-hidden bg-sky-blue-100">
      {/* Hero Section with Explore Now button */}
      <HeroSection />

      {/* Problem-Solution Section - 8 cards (4 problems + 4 solutions) */}
      <ProblemSolutionSection />

      {/* How It Works Section - 5 steps with images */}
      <HowItWorksSection />

      {/* Action Cards Section - 3 CTA cards */}
      <ActionCardsSection />

      {/* Final CTA Section - 1 button */}
      <FinalCTASection />
    </main>
  );
}
