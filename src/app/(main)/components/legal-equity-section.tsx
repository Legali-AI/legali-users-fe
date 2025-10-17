import Image from "next/image";
import { H3 } from "../../../components/elements/typography";
import { LEGAL_EQUITY_CONTENT, LEGAL_EQUITY_PARTNERS } from "../../../data/home.data";

export default function LegalEquitySection() {
  // Duplicate partners array for seamless infinite loop
  const partnersLoop = [...LEGAL_EQUITY_PARTNERS, ...LEGAL_EQUITY_PARTNERS];

  return (
    <section
      className="flex flex-col gap-8 overflow-hidden py-10 sm:gap-10 sm:py-12 lg:gap-12 lg:py-16"
      aria-labelledby="legal-equity-heading">
      {/* Heading */}
      <div data-aos="fade-up" data-aos-duration="600">
        <H3
          id="legal-equity-heading"
          level="h3"
          align="center"
          weight="semibold"
          className="mx-auto max-w-4xl text-2xl text-brand-navy sm:text-3xl md:text-4xl">
          {LEGAL_EQUITY_CONTENT.heading}
        </H3>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full">
        {/* Gradient Overlays for fade effect */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-sky-blue-100 to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-sky-blue-100 to-transparent sm:w-32" />

        {/* Marquee Wrapper */}
        <div className="flex overflow-hidden">
          {/* Marquee Track - Animate */}
          <div className="flex animate-marquee items-center gap-8 sm:gap-12 lg:gap-16">
            {partnersLoop.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex h-16 w-48 shrink-0 items-center justify-center grayscale transition-all hover:grayscale-0 sm:h-20 sm:w-56 lg:h-24 lg:w-64">
                <Image
                  src={partner.imageUrl}
                  alt={partner.name}
                  width={256}
                  height={96}
                  className="h-auto w-full object-contain"
                  priority={index < 4}
                />
              </div>
            ))}
          </div>

          {/* Duplicate track for seamless loop */}
          <div className="flex animate-marquee items-center gap-8 sm:gap-12 lg:gap-16" aria-hidden="true">
            {partnersLoop.map((partner, index) => (
              <div
                key={`duplicate-${partner.name}-${index}`}
                className="flex h-16 w-48 shrink-0 items-center justify-center grayscale transition-all hover:grayscale-0 sm:h-20 sm:w-56 lg:h-24 lg:w-64">
                <Image
                  src={partner.imageUrl}
                  alt={partner.name}
                  width={256}
                  height={96}
                  className="h-auto w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
