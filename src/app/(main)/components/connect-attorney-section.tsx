import { Pencil } from "lucide-react";
import { H4, P } from "../../../components/elements/typography";
import { Button } from "../../../components/ui/button";
import { ATTORNEYS } from "../../../data/home.data";
import { CardAttorney } from "./card/card-attorney";

export default function ConnectAttorneySection() {
  return (
    <section
      className="flex flex-col-reverse items-center justify-center gap-6 overflow-hidden rounded-md bg-white p-4 shadow-sm md:p-6 lg:p-10 xl:flex-row xl:gap-10"
      aria-labelledby="connect-heading"
      data-aos="zoom-in"
      data-aos-duration="600">
      {/* Content */}
      <div
        className="flex max-w-3xl flex-col gap-4"
        data-aos="slide-right"
        data-aos-duration="600"
        data-aos-delay="100">
        <H4 weight={"semibold"}>Connect with Attorneys</H4>
        <P level={"title"} className="text-brand-slate">
          Finding the right lawyer shouldn't be complicated. Our platform connects you with trusted legal professionals
          tailored to your needs. Get matched instantly and start your journey with the lawyer who truly understands
          your case.
        </P>
        <Button className="w-fit max-md:ml-auto" variant={"gradient-blue"} aria-label="Find more attorneys">
          <Pencil aria-hidden="true" />
          Find More
        </Button>
      </div>

      {/* Attorney cards */}
      <div className="flex gap-4" data-aos="slide-left" data-aos-duration="600" data-aos-delay="200">
        {ATTORNEYS.slice(0, 3).map((attorney, index) => (
          <div key={attorney.name} data-aos="fade-up" data-aos-duration="600" data-aos-delay={300 + index * 100}>
            <CardAttorney collapse attorney={attorney} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}
