import { H3, P, Small, Span } from "@/components/elements/typography";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FAQ_CATEGORIES,
  FAQ_PAGE_CLOSING_NOTE,
  FAQ_PAGE_INTRO,
  FAQ_PAGE_TITLE,
} from "@/data/faq.data";
import type { Metadata } from "next";
import { FAQAnswerContent } from "../components/faq-section";

export const metadata: Metadata = {
  title: "Legali FAQ",
  description:
    "Find answers to the most common questions about how Legali helps you navigate legal matters, when to involve attorneys, and how we keep your information secure.",
};

export default function FAQPage() {
  return (
    <main className="relative flex w-full flex-col bg-sky-blue-100">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-sky-blue-200/70 blur-3xl" />
        <div className="absolute -bottom-40 left-16 h-80 w-80 rounded-full bg-sky-blue-200/60 blur-3xl" />
        <div className="absolute right-0 -bottom-20 h-80 w-80 rounded-full bg-brand-gray-50/50 blur-3xl" />
      </div>

      <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-20 sm:px-6 md:px-10 lg:px-16">
        <header className="flex flex-col gap-4 text-center md:text-left">
          <Small className="self-center rounded-full border border-white/40 bg-white/60 px-4 py-1 text-xs tracking-[0.2em] text-brand-navy/80 uppercase md:self-start">
            FAQ Library
          </Small>
          <H3 level={"h2"} weight={"semibold"} align={"left"}>
            {FAQ_PAGE_TITLE}
          </H3>
          <div className="flex flex-col gap-3 text-brand-navy/90">
            {FAQ_PAGE_INTRO.map((paragraph, index) => (
              <P
                key={`faq-intro-${index}`}
                className="text-base leading-relaxed md:text-lg"
              >
                {paragraph}
              </P>
            ))}
          </div>
        </header>

        <div className="grid gap-12 lg:grid-cols-[280px_minmax(0,1fr)]">
          <nav
            aria-label="FAQ categories"
            className="flex h-max flex-col gap-4 self-start rounded-3xl border border-white/70 bg-white/60 p-6 shadow-lg backdrop-blur lg:sticky lg:top-32"
          >
            <Span
              level={"title"}
              weight={"semibold"}
              className="text-brand-navy"
            >
              Jump to a section
            </Span>
            <ul className="flex flex-col gap-2 text-sm text-brand-navy/80">
              {FAQ_CATEGORIES.map(category => (
                <li key={category.id}>
                  <a
                    href={`#${category.id}`}
                    className="inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-sky-blue-100/80 hover:text-brand-navy"
                  >
                    <span
                      className="inline-flex size-2 rounded-full bg-brand-navy"
                      aria-hidden
                    />
                    {category.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-16">
            {FAQ_CATEGORIES.map(category => (
              <section
                key={category.id}
                id={category.id}
                className="scroll-mt-32 space-y-6"
              >
                <div className="space-y-2">
                  <Small className="text-xs tracking-[0.2em] text-brand-navy/60 uppercase">
                    Section
                  </Small>
                  <H3
                    level={"h3"}
                    weight={"semibold"}
                    className="text-brand-navy"
                  >
                    {category.title}
                  </H3>
                  {category.description ? (
                    <P className="text-brand-navy/80">{category.description}</P>
                  ) : null}
                </div>
                <Accordion
                  type="multiple"
                  defaultValue={
                    category.items.length ? [category.items[0].id] : []
                  }
                  className="rounded-3xl border border-white/70 bg-white/70 p-2 shadow-lg backdrop-blur"
                  aria-label={`${category.title} questions`}
                >
                  {category.items.map((item, index) => (
                    <AccordionItem
                      key={item.id}
                      value={item.id}
                      className="rounded-2xl border-none bg-transparent px-2"
                      data-aos="fade-up"
                      data-aos-duration="600"
                      data-aos-delay={100 + index * 80}
                    >
                      <AccordionTrigger
                        aria-controls={`faq-page-answer-${item.id}`}
                      >
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent
                        id={`faq-page-answer-${item.id}`}
                        className="flex flex-col gap-4 border-t border-sky-blue-100/70 pt-4"
                      >
                        <FAQAnswerContent blocks={item.answer} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>
        </div>

        <footer className="rounded-3xl border border-white/60 bg-white/60 p-6 shadow-lg backdrop-blur">
          <P className="text-sm text-brand-navy/80 md:text-base">
            {FAQ_PAGE_CLOSING_NOTE}
          </P>
        </footer>
      </section>
    </main>
  );
}
