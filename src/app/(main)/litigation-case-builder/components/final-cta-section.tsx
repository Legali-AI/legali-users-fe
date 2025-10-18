import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { FINAL_CTA_CONTENT } from "../../../../data/litigation-case-builder.data";

// Server Component
export default function FinalCTASection() {
  return (
    <section className="flex flex-col items-center justify-center gap-8 px-4 py-16 sm:px-8 sm:py-20 md:px-16 lg:px-32 lg:py-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 text-center">
        {/* Heading */}
        <h2
          className="text-3xl font-bold text-brand-navy sm:text-4xl md:text-5xl lg:text-6xl"
          data-aos="fade-up"
          data-aos-duration="600">
          {FINAL_CTA_CONTENT.heading}
        </h2>

        {/* Subheading */}
        <p
          className="max-w-3xl text-lg text-brand-navy/80 sm:text-xl md:text-2xl"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay="100">
          {FINAL_CTA_CONTENT.subheading}
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay="200">
          <Button asChild variant="gradient-teal" size="xl" weight="semibold">
            <Link href={FINAL_CTA_CONTENT.ctaPrimary.href}>
              {FINAL_CTA_CONTENT.ctaPrimary.text}
              <ChevronRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="xl" weight="semibold">
            <Link href={FINAL_CTA_CONTENT.ctaSecondary.href}>
              {FINAL_CTA_CONTENT.ctaSecondary.text}
              <ChevronRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
