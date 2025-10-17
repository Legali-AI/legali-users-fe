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
    <div className="flex flex-col gap-4 text-brand-navy">
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <P
              key={`paragraph-${index}`}
              level={"body"}
              className="text-sm leading-relaxed text-brand-navy/80 sm:text-base">
              {block.content}
            </P>
          );
        }

        if (block.type === "list") {
          if (block.variant && block.variant !== "default") {
            const Icon = block.variant === "check" ? CheckCircle2 : XCircle;
            return (
              <div key={`list-${index}`} className="space-y-3">
                {block.title ? (
                  <Span level={"title"} weight={"semibold"} className="text-brand-navy">
                    {block.title}
                  </Span>
                ) : null}
                <ul className="flex flex-col gap-2.5">
                  {block.items.map((item, itemIndex) => (
                    <li key={`list-${index}-item-${itemIndex}`}>
                      <span className="flex items-start gap-2.5">
                        <Icon className="mt-0.5 size-4 shrink-0 text-brand-navy" aria-hidden />
                        <Span level={"body"} className="text-sm text-brand-navy/80 sm:text-base">
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
            <div key={`list-${index}`} className="space-y-3">
              {block.title ? (
                <Span level={"title"} weight={"semibold"} className="text-brand-navy">
                  {block.title}
                </Span>
              ) : null}
              <ul className="list-disc space-y-2 pl-6 marker:text-brand-navy/60">
                {block.items.map((item, itemIndex) => (
                  <li key={`list-${index}-item-${itemIndex}`}>
                    <Span level={"body"} className="text-sm text-brand-navy/80 sm:text-base">
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
              className="flex items-start gap-3 rounded-xl border border-sky-blue-200/60 bg-sky-blue-50/40 p-4">
              <Info className="mt-0.5 size-5 shrink-0 text-[#2F7D99]" aria-hidden />
              <Small className="text-sm leading-relaxed text-brand-navy/80">{block.content}</Small>
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
      className="flex flex-col gap-10 py-10 sm:gap-12 sm:py-12 lg:gap-16 lg:py-16"
      aria-label={FAQ_PAGE_TITLE}
      data-aos="fade-up"
      data-aos-duration="600">
      <div className="flex flex-col gap-12 sm:gap-16">
        <header className="flex flex-col items-center gap-4 text-center" data-aos="fade-up" data-aos-duration="600">
          <H3
            level={"h3"}
            weight={"semibold"}
            align={"center"}
            className="text-2xl text-brand-navy sm:text-3xl md:text-4xl">
            Frequently Asked Questions
          </H3>
          <P level={"title"} align={"center"} className="max-w-3xl text-brand-navy/80">
            Quick answers to the questions we hear most often. Explore a preview here, then dive into the full library
            to learn how Legali supports every step of your legal journey.
          </P>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-8">
          <Accordion
            type="single"
            collapsible
            defaultValue={FEATURED_FAQS[0]?.item.id}
            className="flex flex-col gap-3 rounded-[24px] border border-white/70 bg-white/90 p-4 shadow-[0_20px_40px_-30px_rgba(15,36,71,0.35)] backdrop-blur-sm sm:p-5"
            aria-label="Featured frequently asked questions">
            {FEATURED_FAQS.map(({ categoryTitle, item }, index) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="rounded-xl border-none bg-transparent"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay={100 + index * 50}>
                <AccordionTrigger aria-controls={`faq-answer-${item.id}`} className="text-left hover:no-underline">
                  <Span level={"title"} weight={"semibold"} className="text-brand-navy">
                    {item.question}
                  </Span>
                </AccordionTrigger>
                <AccordionContent
                  id={`faq-answer-${item.id}`}
                  className="flex flex-col gap-4 border-t border-sky-blue-100/50 pt-4 mt-3">
                  <Small className="text-xs font-medium uppercase tracking-[0.15em] text-brand-navy/60">
                    {categoryTitle}
                  </Small>
                  <FAQAnswerContent blocks={item.answer} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <aside className="flex flex-col gap-6 rounded-[24px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_40px_-30px_rgba(15,36,71,0.35)] backdrop-blur-sm lg:sticky lg:top-32 lg:self-start">
            <div className="space-y-3">
              <Span level={"title"} weight={"semibold"} className="text-brand-navy">
                More topics waiting for you
              </Span>
              <P level={"body"} className="text-brand-navy/70">
                Browse deep dives on compliance, pricing, privacy, and when to bring an attorney into the loop.
              </P>
            </div>
            <ul className="flex flex-col gap-3">
              {FEATURED_CATEGORY_TITLES.map(title => (
                <li key={title} className="flex items-start gap-2 text-left">
                  <span className="mt-2 inline-flex size-1.5 shrink-0 rounded-full bg-brand-navy" aria-hidden />
                  <Span level={"body"} className="text-brand-navy/80">
                    {title}
                  </Span>
                </li>
              ))}
            </ul>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2F7D99] to-[#5BA3BF] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:from-[#2A6F8A] hover:to-[#5199B0]"
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
