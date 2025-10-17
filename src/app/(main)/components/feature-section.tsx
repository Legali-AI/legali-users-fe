import { H3 } from "../../../components/elements/typography";
import { PROCESS_STEPS } from "../../../data/home.data";
import { CardProcessStep } from "./card/card-process-step";

export default function FeatureSection() {
  return (
    <section className="flex flex-col gap-10 sm:gap-12 lg:gap-16" aria-labelledby="features-heading">
      {/* Heading */}
      <div data-aos="fade-up" data-aos-duration="600">
        <H3
          id="features-heading"
          level="h2"
          align="center"
          weight="semibold"
          className="mx-auto max-w-4xl text-3xl text-brand-navy sm:text-[38px] md:text-[44px] lg:text-[50px]">
          How we empower
        </H3>
      </div>

      {/* Process Steps - Grid Layout (3-2) */}
      <div className="flex flex-col gap-6 lg:gap-8">
        {/* First Row - 3 Cards */}
        <div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay="100">
          {PROCESS_STEPS.slice(0, 3).map((processStep, index) => (
            <div key={processStep.title} data-aos="zoom-in" data-aos-duration="600" data-aos-delay={150 + index * 100}>
              <CardProcessStep processStep={processStep} index={index} />
            </div>
          ))}
        </div>

        {/* Second Row - 2 Cards */}
        <div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay="400">
          {PROCESS_STEPS.slice(3, 5).map((processStep, index) => (
            <div key={processStep.title} data-aos="zoom-in" data-aos-duration="600" data-aos-delay={450 + index * 100}>
              <CardProcessStep processStep={processStep} index={index + 3} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
