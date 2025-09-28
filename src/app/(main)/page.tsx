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
    <main className="relative z-10 flex w-full flex-col overflow-x-hidden bg-sky-blue-100 px-4 py-40 sm:px-8 md:px-16 lg:px-32">
      {/* Hero section */}
      <div data-aos="zoom-in" data-aos-duration="600">
        <HeroSection />
      </div>

      {/* Blur Splitter */}
      <div className="h-[90px] w-full bg-brand-gray-50 blur-2xl" />

      <div className="flex flex-col gap-20 py-10 sm:gap-32 lg:gap-36">
        {/* About Us */}
        <div data-aos="slide-up" data-aos-duration="600" data-aos-delay="100">
          <AboutUsSection />
        </div>
        {/* Built For */}
        <div data-aos="flip-left" data-aos-duration="600" data-aos-delay="150">
          <BuiltForSection />
        </div>
        {/* Features */}
        <div
          data-aos="slide-right"
          data-aos-duration="600"
          data-aos-delay="200"
        >
          <FeatureSection />
        </div>
        {/* FAQ */}
        <div data-aos="zoom-in-up" data-aos-duration="600" data-aos-delay="250">
          <FAQSection />
        </div>
        {/* Connect */}
        <div data-aos="slide-left" data-aos-duration="600" data-aos-delay="300">
          <ConnectAttorneySection />
        </div>
        {/* CTA */}
        <section
          className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-2 py-10 sm:py-16 md:gap-3 lg:gap-5 lg:py-20"
          aria-labelledby="cta-heading"
          data-aos="zoom-in"
          data-aos-duration="600"
          data-aos-delay="350"
        >
          {/* Main headline */}
          <div
            data-aos="zoom-in-down"
            data-aos-duration="600"
            data-aos-delay="100"
          >
            <H3 level={"huge"} align={"center"} weight={"semibold"}>
              Legali puts the law on your side.
            </H3>
          </div>

          {/* Subtitle */}
          <div data-aos="slide-up" data-aos-duration="600" data-aos-delay="200">
            <P
              level={"h2"}
              align={"center"}
              weight={"bold"}
              className="text-brand-navy"
            >
              Your better chance at justice.
            </P>
          </div>

          {/* Final CTA */}
          <div data-aos="zoom-in" data-aos-duration="600" data-aos-delay="300">
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
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
