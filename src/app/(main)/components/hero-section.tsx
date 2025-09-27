import RichInput from "../../../components/elements/rich-input";
import { H1, H2 } from "../../../components/elements/typography";
import { Badge } from "../../../components/ui/badge";
import { NAVIGATION_FEATURES } from "../../../data/home.data";

export default function HeroSection() {
  return (
    <section
      className="flex min-h-[90vh] items-center justify-center"
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
        <div
          style={{
            borderRadius: "997px",
            background: "rgba(200, 241, 255, 0.5)",
            width: "997px",
            height: "206px",
            flexShrink: 0,
            filter: "blur(54.349998474121094px)",
          }}
          className="absolute top-[800px] left-1/2 -z-10 -translate-x-1/2"
        />
      </div>

      {/* Hero content */}
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-5">
        {/* Main headline */}
        <H1 weight={"semibold"} align={"center"}>
          Meet your first AI-law firm
        </H1>

        {/* Subtitle */}
        <H2 level={"title"} className="text-brand-slate" align={"center"}>
          Legali lets you build cases, manage evidence, and fund litigation—all
          on one secure AI platform.
        </H2>

        {/* Search input */}
        <div className="mt-4 w-full">
          <RichInput />
        </div>

        {/* Feature badges */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {NAVIGATION_FEATURES.map((feature) => (
            <Badge
              key={feature.label}
              level={"body"}
              variant={"gradient-blue"}
              size={"lg"}
            >
              <feature.icon size={30} aria-hidden="true" />
              <span className="sr-only">Feature: </span>
              {feature.label}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
