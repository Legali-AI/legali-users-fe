import type { LucideIcon } from "lucide-react";
import {
  DIFFERENTIATORS,
  DIFFERENTIATORS_HEADING,
  DIFFERENTIATORS_SUBHEADING,
} from "../../../../data/litigation-case-builder.data";

// Server Component
export default function DifferentiatorsSection() {
  return (
    <section className="flex flex-col items-center gap-12 px-4 py-16 sm:gap-16 sm:px-8 sm:py-20 md:px-16 lg:gap-20 lg:px-32 lg:py-24">
      {/* Heading */}
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
        <h2
          className="text-3xl font-bold text-brand-navy sm:text-4xl md:text-5xl lg:text-6xl"
          data-aos="fade-up"
          data-aos-duration="600">
          {DIFFERENTIATORS_HEADING}
        </h2>
        <p
          className="text-lg text-brand-navy/70 sm:text-xl md:text-2xl"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay="100">
          {DIFFERENTIATORS_SUBHEADING}
        </p>
      </div>

      {/* Differentiators Grid - 2 rows x 2 cols */}
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:gap-10">
        {DIFFERENTIATORS.map((differentiator, index) => (
          <DifferentiatorCard
            key={index}
            icon={differentiator.icon}
            title={differentiator.title}
            description={differentiator.description}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

// Differentiator Card Component
interface DifferentiatorCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

function DifferentiatorCard({ icon: Icon, title, description, index }: DifferentiatorCardProps) {
  return (
    <div
      className="flex flex-col gap-4 rounded-[24px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_40px_-30px_rgba(15,36,71,0.35)] transition-all hover:shadow-[0_24px_48px_-32px_rgba(15,36,71,0.45)] sm:p-8"
      data-aos="fade-up"
      data-aos-duration="600"
      data-aos-delay={index * 50}>
      {/* Icon with background */}
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-blue-100/50 to-sky-blue-50">
        <Icon className="h-7 w-7 text-[#2F7D99]" aria-hidden="true" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-brand-navy sm:text-2xl">{title}</h3>

      {/* Description */}
      <p className="text-sm leading-relaxed text-brand-navy/70 sm:text-base">{description}</p>
    </div>
  );
}
