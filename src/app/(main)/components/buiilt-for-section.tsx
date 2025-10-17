import Image from "next/image";
import { H3, H4, P } from "../../../components/elements/typography";
import { CORE_PROBLEMS, VALUE_PROPOSITIONS } from "../../../data/home.data";
import { CardProblem } from "./card/card-problem";

export default function BuiltForSection() {
  return (
    <section className="flex flex-col gap-12 sm:gap-16 lg:gap-20" aria-labelledby="built-for-heading">
      {/* Main Heading */}
      <div data-aos="fade-up" data-aos-duration="600">
        <H3
          id="built-for-heading"
          level="h2"
          align="center"
          weight="semibold"
          className="mx-auto max-w-4xl text-3xl text-brand-navy sm:text-[38px] md:text-[44px] lg:text-[50px]">
          We build Legali so everyone can navigate the legal system better.
        </H3>
      </div>

      {/* Core Problems Grid */}
      <div
        className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-delay="200">
        {CORE_PROBLEMS.map((problem, index) => (
          <div
            key={problem.title}
            className="flex justify-center"
            data-aos="flip-right"
            data-aos-duration="600"
            data-aos-delay={300 + index * 120}>
            <CardProblem problem={problem} />
          </div>
        ))}
      </div>

      {/* Legali Revolutionizes Section */}
      <div
        className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 rounded-[32px] bg-white/90 p-6 shadow-[0_40px_80px_-60px_rgba(15,36,71,0.45)] backdrop-blur-sm sm:flex-row sm:gap-12 lg:p-8"
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-delay="400">
        {/* SVG Image */}
        <div className="w-full max-w-[546px] shrink-0">
          <Image
            src="/legali-revolutionize.svg"
            alt="Legali revolutionizes access to justice"
            width={546}
            height={254}
            className="h-auto w-full"
            priority
          />
        </div>

        {/* Text Content */}
        <div className="flex-1 space-y-3 text-center sm:space-y-4 sm:text-left">
          <H4 level="h3" weight="semibold" className="text-brand-navy">
            {VALUE_PROPOSITIONS[0].headline}
          </H4>
          <P level="title" className="text-base text-brand-slate sm:text-lg">
            {VALUE_PROPOSITIONS[0].description}
          </P>
        </div>
      </div>

      {/* We Built Legali from Experience Section */}
      <div
        className="mx-auto w-full max-w-5xl space-y-4 rounded-[32px] bg-white/90 p-6 shadow-[0_40px_80px_-60px_rgba(15,36,71,0.45)] backdrop-blur-sm lg:p-8"
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-delay="500">
        <H4 level="h3" weight="semibold" className="text-brand-navy">
          {VALUE_PROPOSITIONS[1].headline}
        </H4>
        <div className="space-y-3">
          <P level="title" className="text-base text-brand-slate sm:text-lg">
            Even the smartest people get trapped in a legal system that's too complex to navigate.
          </P>
          <P level="title" className="text-base text-brand-slate sm:text-lg">
            Education doesn't protect you—access does.
          </P>
        </div>
      </div>
    </section>
  );
}
