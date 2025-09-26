import { H4 } from "../../../components/elements/typography";
import { CardProblem } from "../../../components/module/home/card-problem";
import { CardValue } from "../../../components/module/home/card-value";
import { CORE_PROBLEMS, VALUE_PROPOSITIONS } from "../../../data/home.data";

export default function AboutUsSection() {
  return (
    <section className="flex flex-col gap-3" aria-labelledby="about-heading">
      {/* Main text */}
      <H4
        level={"h2"}
        className="mx-auto max-w-5xl"
        weight={"semibold"}
        align={"center"}
      >
        We build Legali so everyone can navigate the legal system better,
        easier, faster, and smarter.
      </H4>

      {/* Content */}
      <div className="space-y-5">
        {/* Problems grid */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {CORE_PROBLEMS.map((problem) => (
            <CardProblem key={problem.title} problem={problem} />
          ))}
        </div>

        {/* Value props */}
        <div className="space-y-5">
          {VALUE_PROPOSITIONS.map((valueProposition, index) => (
            <CardValue
              key={valueProposition.headline}
              valueProposition={valueProposition}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
