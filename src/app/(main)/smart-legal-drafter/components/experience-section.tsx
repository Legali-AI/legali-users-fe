import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { EXPERIENCE_CONTENT } from "../../../../data/smart-legal-drafter.data";

// Server Component
export default function ExperienceSection() {
  return (
    <section className="flex flex-col items-center justify-center px-4 py-16 sm:px-8 sm:py-20 md:px-16 lg:px-32 lg:py-24">
      <div
        className="mx-auto flex w-full max-w-6xl flex-col gap-10 rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-[0_20px_40px_-30px_rgba(15,36,71,0.35)] sm:p-12 lg:gap-12 lg:p-16"
        data-aos="fade-up"
        data-aos-duration="600">
        {/* Heading */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold text-brand-navy sm:text-4xl md:text-5xl">{EXPERIENCE_CONTENT.heading}</h2>
          <p className="max-w-3xl text-lg text-brand-navy/70 sm:text-xl">{EXPERIENCE_CONTENT.subheading}</p>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center" data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
          <Button asChild variant="gradient-teal" size="xl" weight="semibold">
            <Link href={EXPERIENCE_CONTENT.ctaHref}>{EXPERIENCE_CONTENT.ctaText}</Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div
          className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay="200">
          {EXPERIENCE_CONTENT.stats.map((stat, index) => (
            <StatCard key={index} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Stat Card Component
interface StatCardProps {
  value: string;
  label: string;
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span className="text-5xl font-bold text-[#2F7D99] sm:text-6xl">{value}</span>
      <span className="text-base text-brand-navy/70 sm:text-lg">{label}</span>
    </div>
  );
}
