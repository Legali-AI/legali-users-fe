import { H3, P, Span } from "@/components/elements/typography";
import { JUSTICE_GAP_STATS } from "@/data/home.data";

export default function JusticeGapSection() {
  return (
    <section
      className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 py-14 text-center sm:gap-12 sm:py-20 lg:gap-14 lg:py-24"
      aria-labelledby="justice-gap-heading"
    >
      <header
        className="space-y-4 sm:space-y-5 md:space-y-6"
        data-aos="fade-up"
        data-aos-duration="600"
      >
        <H3
          id="justice-gap-heading"
          align="center"
          level="h2"
          weight="semibold"
          className="text-3xl text-brand-navy sm:text-4xl md:text-[42px] lg:text-[48px]"
        >
          The Justice Gap
        </H3>
        <P
          level="body"
          className="mx-auto max-w-3xl text-center text-sm text-brand-slate sm:text-base md:max-w-4xl md:text-lg lg:max-w-5xl lg:text-xl xl:text-xl"
        >
          In America&apos;s legal system, one thing determines your outcome more
          than the facts of your case.
        </P>
      </header>

      <div
        className="w-full rounded-[36px] bg-gradient-to-r from-[#33809B] to-[#255F73] px-6 py-12 text-white shadow-[0_40px_80px_-60px_rgba(15,36,71,0.6)] sm:px-12 sm:py-16 md:px-16 md:py-[72px] lg:px-20 lg:py-20"
        data-aos="zoom-in"
        data-aos-duration="600"
        data-aos-delay="100"
      >
        <dl className="grid gap-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-white/15">
          {JUSTICE_GAP_STATS.map(stat => (
            <div
              key={stat.value}
              className="flex flex-col items-center gap-4 text-center sm:px-6 md:px-10 lg:gap-5"
            >
              <dt>
                <Span className="block text-3xl font-semibold text-white sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px]">
                  {stat.value}
                </Span>
              </dt>
              <dd>
                <P
                  level="body"
                  className="text-center text-sm text-white/80 sm:text-base md:text-lg lg:text-xl"
                >
                  {stat.description}
                </P>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
