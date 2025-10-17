import Link from "next/link";

import { H4, P, Span } from "../../../components/elements/typography";
import { Button } from "../../../components/ui/button";
import { CORE_PROBLEMS, VALUE_PROPOSITIONS } from "../../../data/home.data";
import { CardProblem } from "./card/card-problem";
import { CardValue } from "./card/card-value";

export default function AboutUsSection() {
  return (
    <section
      className="flex flex-col items-center gap-16 py-20 text-center sm:gap-20 sm:py-24 lg:gap-24 lg:py-28"
      aria-labelledby="about-heading"
    >
      {/* Intro */}
      <div
        className="w-full max-w-4xl space-y-6 sm:space-y-7"
        data-aos="fade-up"
      >
        <H4
          id="about-heading"
          level="h2"
          align="center"
          weight="semibold"
          className="text-3xl text-brand-navy sm:text-[40px] md:text-[46px] lg:text-[52px]"
        >
          The legal system works for people who can afford lawyers.{" "}
          <Span level="h2" weight="semibold" className="text-[#2F7D99]">
            Everyone else loses.
          </Span>
        </H4>
        <P
          align="center"
          className="mx-auto max-w-3xl text-base text-brand-slate sm:text-lg lg:text-xl"
        >
          That&apos;s exactly why{" "}
          <Span className="text-[#2F7D99] lg:text-xl" weight="semibold">
            Legali
          </Span>{" "}
          exists—to level the playing field with accessible legal tools and
          guidance.
        </P>
        <Button
          asChild
          size="lg"
          className="mx-auto inline-flex rounded-lg bg-gradient-to-r from-[#2F7D99] to-[#A4D1E8] px-10 py-3 text-lg text-white shadow-[0_20px_50px_-30px_rgba(31,125,153,0.85)] transition hover:brightness-95"
        >
          <Link href="/onboard">Get Started with Legali</Link>
        </Button>
      </div>

      {/* Supporting copy */}
      <div
        className="w-full max-w-5xl space-y-4 sm:space-y-5"
        data-aos="fade-up"
        data-aos-delay="150"
      >
        <H4
          level="h2"
          align="center"
          weight="semibold"
          className="text-3xl text-brand-navy sm:text-[38px] md:text-[44px] lg:text-[50px]"
        >
          We build Legali so everyone can navigate the legal system better.
        </H4>
        <P
          align="center"
          className="mx-auto max-w-3xl text-base text-brand-slate/80 sm:text-lg lg:text-lg"
        >
          Real people deserve real legal muscle—without six-figure retainers.
        </P>
      </div>

      <div className="w-full space-y-14">
        <div
          className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay="250"
        >
          {CORE_PROBLEMS.map((problem, index) => (
            <div
              key={problem.title}
              className="flex justify-center"
              data-aos="flip-right"
              data-aos-duration="600"
              data-aos-delay={300 + index * 120}
            >
              <CardProblem problem={problem} />
            </div>
          ))}
        </div>

        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          {VALUE_PROPOSITIONS.map((valueProposition, index) => (
            <div
              key={valueProposition.headline}
              data-aos="fade-up"
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
