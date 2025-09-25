import { Pencil } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { homePageMetadata } from "@/lib/seo/metadata";
import RichInput from "../../components/elements/rich-input";
import {
  H1,
  H2,
  H3,
  H4,
  H5,
  P,
  Span,
} from "../../components/elements/typography";
import { CardAttorney } from "../../components/module/home/card-attorney";
import { CardBenefit } from "../../components/module/home/card-benefit";
import { CardProblem } from "../../components/module/home/card-problem";
import { CardProcessStep } from "../../components/module/home/card-process-step";
import { CardValue } from "../../components/module/home/card-value";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  ATTORNEYS,
  BENEFITS,
  CORE_PROBLEMS,
  FAQ_ITEMS,
  NAVIGATION_FEATURES,
  PROCESS_STEPS,
  VALUE_PROPOSITIONS,
} from "../../data/home.data";

export const metadata: Metadata = homePageMetadata;

function App() {
  return (
    <main className="relative z-10 w-full overflow-x-hidden bg-sky-blue-100">
      {/* Hero section */}
      <section
        className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 md:px-16 lg:px-32"
        aria-labelledby="hero-heading"
      >
        {/* Background decorations */}
        <div aria-hidden="true">
          <div
            className="absolute top-0 left-1/2 -z-10 aspect-square h-auto w-[400px] -translate-x-1/2 blur-2xl"
            style={{ backgroundColor: "rgba(200, 241, 255, 0.75)" }}
          />
          <div
            className="absolute top-[400px] -left-20 -z-10 aspect-square h-auto w-[400px] blur-2xl"
            style={{ backgroundColor: "rgba(200, 241, 255, 0.75)" }}
          />
          <div
            className="absolute top-[600px] -right-20 -z-10 aspect-square h-auto w-[400px] blur-2xl"
            style={{ backgroundColor: "rgba(200, 241, 255, 0.75)" }}
          />
        </div>

        {/* Hero content */}
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-5">
          {/* Main headline */}
          <H1 weight={"semibold"}>Meet your first AI-law firm</H1>

          {/* Subtitle */}
          <H2 level={"title"} className="text-brand-slate" align="center">
            Legali helps you build cases, organize evidence, draft documents,
            spot legal risks, connect with affordable attorneys, and even
            crowdfund litigation—all on a secure, AI-driven platform.
          </H2>

          {/* Search input */}
          <div className="mt-4 w-full">
            <RichInput />
          </div>

          {/* Feature badges */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            {NAVIGATION_FEATURES.map((feature) => (
              <Badge key={feature.label} variant={feature.color} size={"lg"}>
                <feature.icon size={30} aria-hidden="true" />
                <span className="sr-only">Feature: </span>
                {feature.label}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="flex flex-col gap-20 bg-brand-gray-50 px-4 py-10 sm:gap-32 sm:px-8 sm:py-16 md:px-16 md:py-20 lg:gap-40 lg:px-32">
        {/* About Us */}
        <section
          className="flex flex-col gap-3"
          aria-labelledby="about-heading"
        >
          {/* Section title */}
          <H3
            className="m-auto w-fit rounded-full bg-white px-6 py-2 text-brand-slate shadow-md"
            level={"title"}
            weight={"medium"}
          >
            About Us
          </H3>

          {/* Title */}
          <div className="mt-7 mr-auto flex max-w-6xl flex-col items-center justify-center gap-4 sm:flex-row sm:gap-10">
            {/* Dot */}
            <Image
              src={"/dot.svg"}
              width={40}
              height={40}
              className="h-10 w-10"
              alt=""
              aria-hidden="true"
              sizes="40px"
            />
            {/* Main text */}
            <H4 level={"h3"} weight={"semibold"} align={"left"}>
              We build Legali so everyone can navigate the legal system better,
              easier, faster, and smarter.
            </H4>
          </div>

          {/* Subtitle */}
          <H5
            level={"body"}
            className="ml-0 text-brand-slate sm:ml-16"
            align={"left"}
          >
            Legali empowers everyday people to fight unfair legal battles
            without massive legal fees.
          </H5>

          {/* Content */}
          <div className="space-y-4">
            {/* Problems grid */}
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {CORE_PROBLEMS.map((problem) => (
                <CardProblem key={problem.title} problem={problem} />
              ))}
            </div>

            {/* Value props */}
            <div>
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

        {/* Built For */}
        <section
          className="flex flex-col gap-3"
          aria-labelledby="built-for-heading"
        >
          {/* Section title */}
          <H3
            className="m-auto w-fit rounded-full bg-white px-6 py-2 text-brand-slate shadow-md"
            level={"title"}
            weight={"medium"}
          >
            Built For
          </H3>

          {/* Title */}
          <div className="mt-7 mr-auto flex max-w-6xl flex-col items-center justify-center gap-4 sm:flex-row sm:gap-10">
            {/* Dot */}
            <Image
              src={"/dot.svg"}
              width={40}
              height={40}
              className="h-10 w-10"
              alt=""
              aria-hidden="true"
              sizes="40px"
            />
            {/* Main text */}
            <H4 level={"h3"} weight={"semibold"} align={"left"}>
              Built For You.
            </H4>
          </div>

          {/* Subtitle */}
          <H5
            level={"body"}
            className="ml-0 text-brand-slate sm:ml-16"
            align={"left"}
          >
            Helping the 'stuck in the middle' crowd and the lawyers who serve
            them.
          </H5>

          {/* Benefits content */}
          <div className="relative z-10 bg-sky-blue-100 p-4 sm:p-6 lg:p-10">
            {/* Background */}
            <div aria-hidden="true">
              <div
                className="absolute top-0 left-1/2 -z-10 aspect-square h-auto w-[400px] -translate-x-1/2 blur-2xl"
                style={{ backgroundColor: "rgba(200, 241, 255, 0.75)" }}
              />
              <div
                className="absolute bottom-0 -left-20 -z-10 aspect-square h-auto w-[400px] blur-2xl"
                style={{ backgroundColor: "rgba(200, 241, 255, 0.75)" }}
              />
              <div
                className="absolute -right-20 bottom-0 -z-10 aspect-square h-auto w-[400px] blur-2xl"
                style={{ backgroundColor: "rgba(200, 241, 255, 0.75)" }}
              />
            </div>

            {/* Benefits */}
            {BENEFITS.map((b) => (
              <div key={b.title} className="my-10 flex flex-col gap-7">
                <H4
                  id={`benefit-${b.title.toLowerCase().replace(/\s+/g, "-")}`}
                  level={"h5"}
                  weight={"semibold"}
                  className="m-auto w-fit rounded-full border border-white-400 bg-white px-6 py-4"
                >
                  {b.title}
                </H4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                  {b.items.map((benefit) => (
                    <CardBenefit key={benefit.title} benefit={benefit} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section
          className="flex flex-col gap-3"
          aria-labelledby="features-heading"
        >
          {/* Section title */}
          <H3
            className="m-auto w-fit rounded-full bg-white px-6 py-2 text-brand-slate shadow-md"
            level={"title"}
            weight={"medium"}
          >
            Features
          </H3>

          {/* Title */}
          <div className="mt-7 mr-auto flex max-w-6xl flex-col items-center justify-center gap-4 sm:flex-row sm:gap-10">
            {/* Dot */}
            <Image
              src={"/dot.svg"}
              width={40}
              height={40}
              className="h-10 w-10"
              alt=""
              aria-hidden="true"
              sizes="40px"
            />
            {/* Main text */}
            <H4 level={"h3"} weight={"semibold"} align={"left"}>
              How Legali Empowers
            </H4>
          </div>

          {/* Subtitle */}
          <H5
            level={"body"}
            className="ml-0 text-brand-slate sm:ml-16"
            align={"left"}
          >
            Step-by-step tools and guidance to help you build, protect, and
            advance your case.
          </H5>

          {/* Process steps */}
          <div className="space-y-5">
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
                {PROCESS_STEPS.slice(
                  Math.floor(PROCESS_STEPS.length / 3) * 3
                ).map((processStep, index) => (
                  <CardProcessStep
                    key={processStep.title}
                    processStep={processStep}
                    index={Math.floor(PROCESS_STEPS.length / 3) * 3 + index}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section className="flex flex-col gap-3" aria-labelledby="faq-heading">
          {/* Section title */}
          <H3
            className="m-auto w-fit rounded-full bg-white px-6 py-2 text-brand-slate shadow-md"
            level={"title"}
            weight={"medium"}
          >
            FAQ
          </H3>

          {/* Title */}
          <div className="mt-7 mr-auto flex max-w-6xl flex-col items-center justify-center gap-4 sm:flex-row sm:gap-10">
            {/* Dot */}
            <Image
              src={"/dot.svg"}
              width={40}
              height={40}
              className="h-10 w-10"
              alt=""
              aria-hidden="true"
              sizes="40px"
            />
            {/* Main text */}
            <H4 level={"h3"} weight={"semibold"} align={"left"}>
              Frequently Asked Questions
            </H4>
          </div>

          {/* FAQ accordion */}
          <Accordion
            type="single"
            collapsible
            className="flex w-full flex-col gap-3"
            defaultValue={FAQ_ITEMS[0].question}
            aria-label="Frequently asked questions"
          >
            {FAQ_ITEMS.map((faq, index) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger aria-describedby={`faq-answer-${index}`}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent
                  id={`faq-answer-${index}`}
                  className="flex flex-col gap-4 text-balance"
                >
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Connect */}
        <section
          className="flex flex-col items-center justify-center gap-6 rounded-md bg-white p-4 shadow-sm sm:flex-row sm:gap-10 sm:p-10"
          aria-labelledby="connect-heading"
        >
          {/* Content */}
          <div className="flex max-w-3xl flex-col gap-4">
            <H4 weight={"semibold"}>Connect with Attorneys</H4>
            <P level={"title"} className="text-brand-slate">
              Finding the right lawyer shouldn't be complicated. Our platform
              connects you with trusted legal professionals tailored to your
              needs. Get matched instantly and start your journey with the
              lawyer who truly understands your case.
            </P>
            <Button
              className="w-fit"
              variant={"orange"}
              aria-label="Find more attorneys"
            >
              <Pencil aria-hidden="true" />
              Find More
            </Button>
          </div>

          {/* Attorney cards */}
          <div className="flex flex-col gap-4 sm:flex-row">
            {ATTORNEYS.slice(0, 3).map((attorney, index) => (
              <CardAttorney
                collapse
                key={attorney.name}
                attorney={attorney}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="m-auto flex max-w-5xl flex-col items-center justify-center gap-2 py-10 sm:py-16 lg:py-20"
          aria-labelledby="cta-heading"
        >
          {/* Main headline */}
          <H3 level={"huge"} align={"center"} weight={"semibold"}>
            Legali puts the law on your side.
          </H3>

          {/* Subtitle */}
          <P level={"title"} align={"center"} className="text-brand-slate">
            Your better chance at justice.
          </P>

          {/* Final CTA */}
          <P
            level={"h2"}
            align={"center"}
            weight={"bold"}
            className="text-sky-blue-800"
          >
            Let's do it,{" "}
            <Span
              level={"h2"}
              align={"center"}
              weight={"bold"}
              className="text-sky-blue-800 italic"
            >
              legali.
            </Span>
          </P>
        </section>
      </div>
    </main>
  );
}

export default App;
