import { H3, H4 } from "../../../components/elements/typography";
import { BENEFITS } from "../../../data/home.data";
import { CardBenefit } from "./card/card-benefit";

export default function BuiltForSection() {
  return (
    <section
      className="flex flex-col gap-3"
      aria-labelledby="built-for-heading"
    >
      {/* Main text */}
      <div data-aos="zoom-in-down" data-aos-duration="600">
        <H3
          level={"h2"}
          className="mx-auto max-w-5xl"
          weight={"semibold"}
          align={"center"}
        >
          Built For You.
        </H3>
      </div>

      {/* Subtitle */}
      <div data-aos="slide-up" data-aos-duration="600" data-aos-delay="100">
        <H4
          level={"body"}
          className="mx-auto max-w-6xl text-brand-slate"
          align={"center"}
        >
          Helping the 'stuck in the middle' crowd and the lawyers who serve
          them.
        </H4>
      </div>

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
        {BENEFITS.map((b, benefitIndex) => (
          <div
            key={b.title}
            className="my-6 flex flex-col gap-7 md:my-8 xl:my-10"
            data-aos="flip-up"
            data-aos-duration="600"
            data-aos-delay={200 + benefitIndex * 100}
          >
            <H4
              id={`benefit-${b.title.toLowerCase().replace(/\s+/g, "-")}`}
              level={"h5"}
              weight={"semibold"}
              className="mx-auto w-fit rounded-full border border-white-400 bg-white px-6 py-2"
            >
              {b.title}
            </H4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {b.items.map((benefit, index) => (
                <div
                  key={benefit.title}
                  data-aos="zoom-in"
                  data-aos-duration="600"
                  data-aos-delay={300 + benefitIndex * 100 + index * 50}
                >
                  <CardBenefit benefit={benefit} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
