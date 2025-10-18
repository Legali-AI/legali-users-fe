import type { LucideIcon } from "lucide-react";
import { FEATURES, FEATURES_GRID_HEADING, FEATURES_GRID_SUBHEADING } from "../../../../data/smart-legal-drafter.data";

// Server Component
export default function FeaturesGridSection() {
  return (
    <section className="flex flex-col items-center gap-12 px-4 py-16 sm:gap-16 sm:px-8 sm:py-20 md:px-16 lg:gap-20 lg:px-32 lg:py-24">
      {/* Heading */}
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
        <h2
          className="text-3xl font-bold text-brand-navy sm:text-4xl md:text-5xl lg:text-6xl"
          data-aos="fade-up"
          data-aos-duration="600">
          {FEATURES_GRID_HEADING}
        </h2>
        <p
          className="text-lg text-brand-navy/70 sm:text-xl md:text-2xl"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay="100">
          {FEATURES_GRID_SUBHEADING}
        </p>
      </div>

      {/* Features Grid */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        {FEATURES.map((feature, index) => (
          <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} index={index} />
        ))}
      </div>
    </section>
  );
}

// Feature Card Component
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
  return (
    <div
      className="flex flex-col gap-4 rounded-[24px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_40px_-30px_rgba(15,36,71,0.35)] transition-all hover:shadow-[0_24px_48px_-32px_rgba(15,36,71,0.45)] sm:p-8"
      data-aos="fade-up"
      data-aos-duration="600"
      data-aos-delay={index * 50}>
      {/* Icon */}
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-blue-200 to-sky-blue-100">
        <Icon className="h-6 w-6 text-[#2F7D99]" aria-hidden="true" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-brand-navy sm:text-2xl">{title}</h3>

      {/* Description */}
      <p className="text-sm leading-relaxed text-brand-navy/70 sm:text-base">{description}</p>
    </div>
  );
}
