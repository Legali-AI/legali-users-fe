import type { Metadata } from "next";
import { homePageMetadata } from "@/lib/seo/metadata";
import AboutUsSection from "./components/about-us-section";
import FAQSection from "./components/faq-section";
import FeatureSection from "./components/feature-section";
import HeroSection from "./components/hero-section";
import JusticeGapSection from "./components/justice-gap-section";
import LegalEquitySection from "./components/legal-equity-section";
import ToolkitSection from "./components/toolkit-section";

export const metadata: Metadata = homePageMetadata;

function App() {
  return (
    <main className="relative z-10 flex w-full flex-col overflow-x-hidden bg-sky-blue-100 px-4 py-20 sm:px-8 md:px-16 md:py-20 lg:px-32">
      {/* Hero section */}
      <HeroSection />
      {/* Justice Gap */}
      <JusticeGapSection />

      {/* Blur Splitter */}
      <div className="h-[90px] w-full bg-brand-gray-50 blur-2xl" />

      <div className="flex flex-col gap-16 py-10 sm:gap-20 sm:py-12 lg:gap-24 lg:py-16">
        <AboutUsSection />
        <ToolkitSection />
        <FeatureSection />
        <LegalEquitySection />
        <FAQSection />
        {/* <ConnectAttorneySection /> */}
        <section
          className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-6 py-12 sm:gap-8 sm:py-16 lg:gap-10 lg:py-20"
          aria-labelledby="cta-heading"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="100">
          {/* Main headline */}
          <h1
            className="text-center text-4xl leading-tight font-semibold text-brand-navy sm:text-5xl md:text-6xl lg:text-7xl"
            data-aos="zoom-in"
            data-aos-duration="600"
            data-aos-delay="200">
            Legali puts the law on your side.
          </h1>

          {/* Subtitle */}
          <p
            className="text-center text-2xl font-bold text-brand-navy sm:text-3xl md:text-4xl"
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-delay="300">
            Your better chance at justice
          </p>

          {/* Final CTA */}
          <p
            className="text-center text-2xl font-bold text-brand-navy sm:text-3xl md:text-4xl"
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-delay="400">
            Let's do it,{" "}
            <span className="text-brand-navy italic" data-aos="pulse" data-aos-duration="1000" data-aos-delay="500">
              legali.
            </span>
          </p>
        </section>
      </div>
    </main>
  );
}

export default App;
