import { H3, H4 } from "../../../components/elements/typography";
import { PROCESS_STEPS } from "../../../data/home.data";
import { CardProcessStep } from "./card/card-process-step";

export default function FeatureSection() {
  return (
    <section className="flex flex-col gap-3" aria-labelledby="features-heading">
      {/* Main text */}
      <div data-aos="zoom-in" data-aos-duration="600">
        <H3
          level={"h2"}
          className="mx-auto max-w-5xl"
          weight={"semibold"}
          align={"center"}
        >
          How Legali Empowers
        </H3>
      </div>

      {/* Subtitle */}
      <div data-aos="slide-up" data-aos-duration="600" data-aos-delay="100">
        <H4
          level={"body"}
          className="mx-auto max-w-6xl text-brand-slate"
          align={"center"}
        >
          Step-by-step tools and guidance to help you build, protect, and
          advance your case.
        </H4>
      </div>

      {/* Process steps */}
      <div className="mt-6 space-y-5 md:mt-8 xl:mt-10">
        {/* Full rows */}
        {Array.from(
          { length: Math.floor(PROCESS_STEPS.length / 3) },
          (_, rowIndex) => (
            <div
              key={`process-row-${rowIndex * 3}-${(rowIndex + 1) * 3}`}
              className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5"
              data-aos="slide-right"
              data-aos-duration="600"
              data-aos-delay={200 + rowIndex * 100}
            >
              {PROCESS_STEPS.slice(rowIndex * 3, (rowIndex + 1) * 3).map(
                (processStep, index) => (
                  <div
                    key={processStep.title}
                    data-aos="flip-up"
                    data-aos-duration="600"
                    data-aos-delay={300 + rowIndex * 100 + index * 50}
                  >
                    <CardProcessStep
                      processStep={processStep}
                      index={rowIndex * 3 + index}
                    />
                  </div>
                )
              )}
            </div>
          )
        )}

        {/* Remaining items */}
        {PROCESS_STEPS.length % 3 !== 0 && (
          <div
            className="mx-auto grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5"
            data-aos="slide-left"
            data-aos-duration="600"
            data-aos-delay={200 + Math.floor(PROCESS_STEPS.length / 3) * 100}
          >
            {PROCESS_STEPS.slice(Math.floor(PROCESS_STEPS.length / 3) * 3).map(
              (processStep, index) => (
                <div
                  key={processStep.title}
                  data-aos="zoom-in-up"
                  data-aos-duration="600"
                  data-aos-delay={
                    300 +
                    Math.floor(PROCESS_STEPS.length / 3) * 100 +
                    index * 50
                  }
                >
                  <CardProcessStep
                    processStep={processStep}
                    index={Math.floor(PROCESS_STEPS.length / 3) * 3 + index}
                  />
                </div>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}
