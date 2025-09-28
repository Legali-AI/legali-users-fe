import { H4 } from "../../../components/elements/typography";
import { CORE_PROBLEMS, VALUE_PROPOSITIONS } from "../../../data/home.data";
import { CardProblem } from "./card/card-problem";
import { CardValue } from "./card/card-value";

export default function AboutUsSection() {
  return (
    <section className="flex flex-col gap-3" aria-labelledby="about-heading">
      {/* Main text */}
      <div data-aos="slide-down" data-aos-duration="600">
        <H4
          level={"h2"}
          className="mx-auto max-w-5xl"
          weight={"semibold"}
          align={"center"}
        >
          We build Legali so everyone can navigate the legal system better,
          easier, faster, and smarter.
        </H4>
      </div>

      {/* Content */}
      <div className="space-y-5">
        {/* Problems grid */}
        <div
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-8 lg:grid-cols-3 lg:gap-6 xl:mt-10"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay="100"
        >
          {CORE_PROBLEMS.map((problem, index) => (
            <div
              key={problem.title}
              data-aos="flip-right"
              data-aos-duration="600"
              data-aos-delay={200 + index * 100}
            >
              <CardProblem problem={problem} />
            </div>
          ))}
        </div>

        {/* Value props */}
        <div className="space-y-5">
          {VALUE_PROPOSITIONS.map((valueProposition, index) => (
            <div
              key={valueProposition.headline}
              data-aos="slide-left"
              data-aos-duration="600"
              data-aos-delay={500 + index * 150}
            >
              <CardValue valueProposition={valueProposition} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
