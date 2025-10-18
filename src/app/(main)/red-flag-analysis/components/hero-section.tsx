// Hero Section - Server Component
export default function HeroSection() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 sm:px-8 sm:py-24 md:px-16 lg:px-32">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 text-center">
        {/* Headline */}
        <h1
          className="text-4xl font-semibold leading-tight text-brand-navy sm:text-5xl md:text-6xl lg:text-7xl"
          data-aos="fade-up"
          data-aos-duration="600">
          Spot legal risks before they become problems
        </h1>

        {/* Subheadline */}
        <p
          className="max-w-3xl text-lg text-brand-navy/80 sm:text-xl md:text-2xl"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay="100">
          Get your documents reviewed and spot red flags. Act early and be better prepared.
        </p>
      </div>

      {/* Background decorations */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-sky-blue-200/40 blur-3xl" />
        <div className="absolute right-1/4 top-60 h-96 w-96 rounded-full bg-brand-gray-50/30 blur-3xl" />
      </div>
    </section>
  );
}
