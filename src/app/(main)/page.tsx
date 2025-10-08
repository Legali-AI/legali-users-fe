import type { Metadata } from "next";
import { ContactSection } from "@/components/landing/contact-section";
import { CTASection } from "@/components/landing/cta-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { SolutionsSection } from "@/components/landing/solutions-section";
import { StatsSection } from "@/components/landing/stats-section";
import { homePageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = homePageMetadata;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <SolutionsSection />
      <FeaturesSection />
      <StatsSection />
      <ContactSection />
      <CTASection />
    </main>
  );
}
