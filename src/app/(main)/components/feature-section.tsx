import { H3, H4 } from "../../../components/elements/typography";
import { PROCESS_STEPS } from "../../../data/home.data";
import { CardProcessStep } from "./card/card-process-step";

export default function FeatureSection() {
  return (
    <section className="flex flex-col gap-3" aria-labelledby="features-heading">
      {/* Main text */}
      <H3
        level={"h2"}
        className="mx-auto max-w-5xl"
        weight={"semibold"}
        align={"center"}
      >
        How Legali Empowers
      </H3>

      {/* Subtitle */}
      <H4
        level={"body"}
        className="mx-auto max-w-6xl text-brand-slate"
        align={"center"}
      >
        Step-by-step tools and guidance to help you build, protect, and advance
        your case.
      </H4>

      {/* Process steps */}
      <div className="mt-10 space-y-5">
        {/* Full rows */}
        {Array.from(
          { length: Math.floor(PROCESS_STEPS.length / 3) },
          (_, rowIndex) => (
            <div
              key={`process-row-${rowIndex * 3}-${(rowIndex + 1) * 3}`}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
            >
              {PROCESS_STEPS.slice(rowIndex * 3, (rowIndex + 1) * 3).map(
                (processStep, index) => (
                  <CardProcessStep
                    key={processStep.title}
                    processStep={processStep}
                    index={rowIndex * 3 + index}
                  />
                )
              )}
            </div>
          )
        )}

        {/* Remaining items */}
        {PROCESS_STEPS.length % 3 !== 0 && (
          <div
            className="mx-auto grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5"
            style={{
              gridTemplateColumns: `repeat(${PROCESS_STEPS.length % 3}, 1fr)`,
            }}
          >
            {PROCESS_STEPS.slice(Math.floor(PROCESS_STEPS.length / 3) * 3).map(
              (processStep, index) => (
                <CardProcessStep
                  key={processStep.title}
                  processStep={processStep}
                  index={Math.floor(PROCESS_STEPS.length / 3) * 3 + index}
                />
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}
