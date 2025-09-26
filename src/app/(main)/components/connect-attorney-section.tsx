import { Pencil } from "lucide-react";
import { H4, P } from "../../../components/elements/typography";
import { CardAttorney } from "../../../components/module/home/card-attorney";
import { Button } from "../../../components/ui/button";
import { ATTORNEYS } from "../../../data/home.data";

export default function ConnectAttorneySection() {
  return (
    <section
      className="flex flex-col items-center justify-center gap-6 rounded-md bg-white p-4 shadow-sm sm:flex-row sm:gap-10 sm:p-10"
      aria-labelledby="connect-heading"
    >
      {/* Content */}
      <div className="flex max-w-3xl flex-col gap-4">
        <H4 weight={"semibold"}>Connect with Attorneys</H4>
        <P level={"title"} className="text-brand-slate">
          Finding the right lawyer shouldn't be complicated. Our platform
          connects you with trusted legal professionals tailored to your needs.
          Get matched instantly and start your journey with the lawyer who truly
          understands your case.
        </P>
        <Button
          className="w-fit"
          variant={"gradient-blue"}
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
  );
}
