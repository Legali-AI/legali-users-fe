import type { Metadata } from "next";
import { homePageMetadata } from "@/lib/seo/metadata";
import { H3, P, Span } from "../../components/elements/typography";
import AboutUsSection from "./components/about-us-section";
import BuiltForSection from "./components/buiilt-for-section";
import ConnectAttorneySection from "./components/connect-attorney-section";
import FAQSection from "./components/faq-section";
import FeatureSection from "./components/feature-section";
import HeroSection from "./components/hero-section";

export const metadata: Metadata = homePageMetadata;

function App() {
  return (
    <main className="relative z-10 flex w-full flex-col overflow-x-hidden bg-sky-blue-100 px-4 py-10 sm:px-8 sm:py-16 md:px-16 md:py-20 lg:px-32">
      {/* Hero section */}
      <HeroSection />

      {/* Blur Splitter */}
      <div className="h-[90px] w-full bg-brand-gray-50 blur-2xl" />

      <div className="flex flex-col gap-20 py-10 sm:gap-32 lg:gap-36">
        {/* About Us */}
        <AboutUsSection />
        {/* Built For */}
        <BuiltForSection />
        {/* Features */}
        <FeatureSection />
        {/* FAQ */}
        <FAQSection />
        {/* Connect */}
        <ConnectAttorneySection />
        {/* CTA */}
        <section
          className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-5 py-10 sm:py-16 lg:py-20"
          aria-labelledby="cta-heading"
        >
          {/* Main headline */}
          <H3 level={"huge"} align={"center"} weight={"semibold"}>
            Legali puts the law on your side.
          </H3>

          {/* Subtitle */}
          <P
            level={"h2"}
            align={"center"}
            weight={"bold"}
            className="text-brand-navy"
          >
            Your better chance at justice.
          </P>

          {/* Final CTA */}
          <P
            level={"h2"}
            align={"center"}
            weight={"bold"}
            className="text-brand-navy"
          >
            Let's do it,{" "}
            <Span
              level={"h2"}
              align={"center"}
              weight={"bold"}
              className="text-brand-navy italic"
            >
              legali.
            </Span>
          </P>
        </section>
      </div>
    </main>
  );
}

export default App;
