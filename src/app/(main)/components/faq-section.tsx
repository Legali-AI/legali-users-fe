import { H3, Span } from "../../../components/elements/typography";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion";
import { FAQ_ITEMS } from "../../../data/home.data";

export default function FAQSection() {
  return (
    <section className="relative z-10 flex flex-col gap-3 bg-sky-blue-100" aria-labelledby="faq-heading">
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

      {/* Main text */}
      <div data-aos="zoom-in-down" data-aos-duration="600">
        <H3 level={"h2"} className="mx-auto mb-10 max-w-5xl" weight={"semibold"} align={"center"}>
          Frequently Asked Questions
        </H3>
      </div>

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

      {/* FAQ accordion */}
      <Accordion
        type="single"
        collapsible
        className="flex w-full flex-col gap-3 "
        defaultValue={FAQ_ITEMS[0].question}
        aria-label="Frequently asked questions"
        data-aos="slide-up"
        data-aos-duration="600"
        data-aos-delay="100">
        {FAQ_ITEMS.map((faq, index) => (
          <AccordionItem
            key={faq.question}
            value={faq.question}
            data-aos="flip-left"
            data-aos-duration="600"
            data-aos-delay={200 + index * 50}>
            <AccordionTrigger aria-describedby={`faq-answer-${index}`}>
              <Span level={"h4"} weight={"semibold"} className="text-black">
                {faq.question}
              </Span>
            </AccordionTrigger>
            <AccordionContent id={`faq-answer-${index}`} className="flex flex-col gap-4 text-balance">
              <Span level={"title"} className="text-black">
                {faq.answer}
              </Span>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
