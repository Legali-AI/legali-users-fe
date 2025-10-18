import { SELF_REPRESENTATION_CONTENT } from "../../../../data/smart-legal-drafter.data";

// Server Component
export default function SelfRepresentationSection() {
  return (
    <section className="flex flex-col items-center justify-center px-2 py-6 sm:px-8 sm:py-16 md:px-16 lg:px-32">
      <div
        className="mx-auto flex w-full max-w-4xl flex-col gap-4 rounded-[24px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_40px_-30px_rgba(15,36,71,0.35)] sm:gap-5 sm:p-10 lg:p-12"
        data-aos="fade-up"
        data-aos-duration="600"
      >
        {/* Headline */}
        <h2 className="text-center text-xl leading-snug font-bold text-brand-navy sm:text-base md:text-lg">
          {SELF_REPRESENTATION_CONTENT.headline}
        </h2>

        {/* Description */}
        <p className="text-center text-sm leading-relaxed text-brand-navy/70 sm:text-sm md:text-base">
          {SELF_REPRESENTATION_CONTENT.description}
        </p>
      </div>
    </section>
  );
}
