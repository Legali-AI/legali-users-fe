import { ArrowRight, CheckCircle2, Info, XCircle } from "lucide-react";
import Link from "next/link";

import { H3, P, Small, Span } from "../../../components/elements/typography";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion";
import { FAQ_CATEGORIES, FAQ_PAGE_TITLE, FAQ_PREVIEW_IDS, type FAQAnswerBlock } from "../../../data/faq.data";

type FeaturedFaq = {
  categoryTitle: string;
  item: (typeof FAQ_CATEGORIES)[number]["items"][number];
};

const FAQ_INDEX = FAQ_CATEGORIES.reduce<Record<string, FeaturedFaq>>((acc, category) => {
  category.items.forEach(item => {
    acc[item.id] = {
      categoryTitle: category.title,
      item,
    };
  });
  return acc;
}, {});

const FEATURED_FAQS = FAQ_PREVIEW_IDS.map(id => FAQ_INDEX[id]).filter(Boolean);

const FEATURED_CATEGORY_TITLES = FAQ_CATEGORIES.slice(0, 4).map(category => category.title);

export function FAQAnswerContent({ blocks }: { blocks: FAQAnswerBlock[] }) {
  return (
    <div className="flex flex-col gap-3 text-brand-navy">
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <P key={`paragraph-${index}`} className="text-sm leading-relaxed md:text-base">
              {block.content}
            </P>
          );
        }

        if (block.type === "list") {
          if (block.variant && block.variant !== "default") {
            const Icon = block.variant === "check" ? CheckCircle2 : XCircle;
            return (
              <div key={`list-${index}`} className="space-y-2">
                {block.title ? (
                  <Span level={"title"} weight={"medium"} className="text-brand-navy">
                    {block.title}
                  </Span>
                ) : null}
                <ul className="flex flex-col gap-2">
                  {block.items.map((item, itemIndex) => (
                    <li key={`list-${index}-item-${itemIndex}`}>
                      <span className="flex items-start gap-2">
                        <Icon className="mt-0.5 size-4 shrink-0 text-brand-navy" aria-hidden />
                        <Span level={"body"} className="text-brand-navy">
                          {item}
                        </Span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          }

          return (
            <div key={`list-${index}`} className="space-y-2">
              {block.title ? (
                <Span level={"title"} weight={"medium"} className="text-brand-navy">
                  {block.title}
                </Span>
              ) : null}
              <ul className="list-disc space-y-2 pl-6 marker:text-brand-navy">
                {block.items.map((item, itemIndex) => (
                  <li key={`list-${index}-item-${itemIndex}`}>
                    <Span level={"body"} className="text-brand-navy">
                      {item}
                    </Span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        if (block.type === "note") {
          return (
            <div
              key={`note-${index}`}
              className="flex items-start gap-2 rounded-xl border border-sky-blue-200/80 bg-white/80 p-3">
              <Info className="mt-0.5 size-4 shrink-0 text-sky-blue-500" aria-hidden />
              <Small className="text-sm text-brand-navy/90">{block.content}</Small>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

export default function FAQSection() {
  return (
    <section
      className="relative z-10 overflow-hidden bg-sky-blue-100 py-16"
      aria-label={FAQ_PAGE_TITLE}
      data-aos="fade-up"
      data-aos-duration="600">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-sky-blue-200/70 blur-3xl" />
        <div className="absolute -bottom-40 left-12 h-80 w-80 rounded-full bg-sky-blue-200/60 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-brand-gray-50/50 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col items-center gap-3 text-center">
          <Small className="rounded-full border border-white/40 bg-white/60 px-4 py-1 text-xs uppercase tracking-[0.2em] text-brand-navy/80">
            FAQ
          </Small>
          <H3 level={"h2"} weight={"semibold"} align={"center"}>
            {FAQ_PAGE_TITLE}
          </H3>
          <P level={"title"} align={"center"} className="max-w-3xl text-brand-navy/90">
            Quick answers to the questions we hear most often. Explore a preview here, then dive into the full library
            to learn how Legali supports every step of your legal journey.
          </P>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Accordion
            type="single"
            collapsible
            defaultValue={FEATURED_FAQS[0]?.item.id}
            className="rounded-3xl border border-white/60 bg-white/70 p-2 shadow-lg backdrop-blur"
            aria-label="Featured frequently asked questions">
            {FEATURED_FAQS.map(({ categoryTitle, item }, index) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="rounded-2xl border-none bg-transparent px-2"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={150 + index * 100}>
                <AccordionTrigger aria-controls={`faq-answer-${item.id}`}>{item.question}</AccordionTrigger>
                <AccordionContent
                  id={`faq-answer-${item.id}`}
                  className="flex flex-col gap-4 border-t border-sky-blue-100/70 pt-4">
                  <Small className="text-xs uppercase tracking-[0.15em] text-brand-navy/70">{categoryTitle}</Small>
                  <FAQAnswerContent blocks={item.answer} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <aside className="flex flex-col gap-6 rounded-3xl border border-white/60 bg-white/60 p-6 shadow-lg backdrop-blur lg:sticky lg:top-32">
            <div className="space-y-2">
              <Span level={"title"} weight={"semibold"} className="text-brand-navy">
                More topics waiting for you
              </Span>
              <P className="text-brand-navy/90">
                Browse deep dives on compliance, pricing, privacy, and when to bring an attorney into the loop.
              </P>
            </div>
            <ul className="flex flex-col gap-2">
              {FEATURED_CATEGORY_TITLES.map(title => (
                <li key={title} className="flex items-center gap-2 text-left">
                  <span className="mt-0.5 inline-flex size-2 rounded-full bg-brand-navy" aria-hidden />
                  <Span className="text-brand-navy/80">{title}</Span>
                </li>
              ))}
            </ul>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-navy/90"
              aria-label="Go to the full Legali FAQ page">
              Explore the full FAQ
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
