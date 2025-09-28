import type { Metadata } from "next";
import { H1 } from "../../../components/elements/typography";
import { PRICING_DATA } from "../../../data/pricing.data";
import PricingCard from "./pricing-card";

export const metadata: Metadata = {
  title: "Pricing Plans",
  description:
    "Choose the perfect pricing plan for your legal needs. Flexible credit-based plans designed to fit your budget and requirements.",
  keywords: [
    "pricing plans",
    "legal services pricing",
    "attorney consultation costs",
    "legal credits",
    "subscription plans",
  ],
  openGraph: {
    title: "Pricing Plans",
    description:
      "Choose the perfect pricing plan for your legal needs. Flexible credit-based plans designed to fit your budget and requirements.",
  },
};

export default function PricingPage() {
  return (
    <main
      className="relative z-10 flex w-full flex-col items-center justify-center overflow-hidden bg-sky-blue-200 px-8 py-40 sm:px-10 md:px-16 lg:px-32"
      aria-label="Attorney connection page">
      {/* Background decorations */}
      {/* Bottom Left */}
      <div
        className="absolute -bottom-[100px] -left-[200px] -z-10 aspect-[3/2] w-[700px] rotate-45"
        style={{
          borderRadius: "686.309px",
          background: "linear-gradient(90deg, #E5F8FF 0%, #9BDBF3 100%)",
          filter: "blur(43.400001525878906px)",
        }}
      />
      {/* Bottom Right */}
      <div
        className="absolute -right-[200px] -bottom-[100px] -z-10 aspect-[3/2] w-[700px] rotate-45"
        style={{
          borderRadius: "686.309px",
          background: "linear-gradient(90deg, #E5F8FF 0%, #9BDBF3 100%)",
          filter: "blur(43.400001525878906px)",
        }}
      />

      {/* Page header */}
      <div data-aos="zoom-in" data-aos-duration="600">
        <H1 weight={"semibold"}>Pricing</H1>
      </div>

      {/* Pricing cards grid */}
      <div
        className="mt-6 grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:mt-8 md:gap-8 xl:mt-10 xl:gap-10"
        data-aos="slide-up"
        data-aos-duration="600"
        data-aos-delay="100">
        {PRICING_DATA.map((pricing, index) => (
          <div key={pricing.name} data-aos="zoom-in-up" data-aos-duration="600" data-aos-delay={200 + index * 100}>
            <PricingCard {...pricing} />
          </div>
        ))}
      </div>
    </main>
  );
}
