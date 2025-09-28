import type { Metadata } from "next";
import Image from "next/image";
import { H1, H2 } from "../../../components/elements/typography";
import { ATTORNEYS } from "../../../data/home.data";
import { CardAttorney } from "../components/card/card-attorney";

export const metadata: Metadata = {
  title: "Connect with Attorneys",
  description:
    "Get instantly matched with trusted lawyers who understand your needs and can help with your legal case.",
  keywords: [
    "attorney matching",
    "lawyer connection",
    "legal professionals",
    "case consultation",
  ],
  openGraph: {
    title: "Connect with Attorneys",
    description:
      "Get instantly matched with trusted lawyers who understand your needs and can help with your legal case.",
  },
};

export default function AttorneyPage() {
  return (
    <main
      className="relative z-10 flex w-full flex-col items-center justify-center gap-4 overflow-hidden bg-sky-blue-200 px-8 py-40 sm:px-10 md:px-16 lg:px-32"
      aria-label="Attorney connection page"
    >
      {/* Background decorations */}
      <Image
        src="/attorney-decor.svg"
        width={250}
        height={250}
        alt=""
        className="absolute top-1/2 left-0 -z-10"
        aria-hidden="true"
        sizes="250px"
      />
      <Image
        src="/attorney-decor.svg"
        width={250}
        height={250}
        alt=""
        className="absolute top-1/4 right-0 -z-10 rotate-180"
        aria-hidden="true"
        sizes="250px"
      />

      {/* Page header */}
      <div data-aos="zoom-in-down" data-aos-duration="600">
        <H1 weight={"semibold"} align={"center"}>
          Connect with Attorneys
        </H1>
        <H2 level={"title"} className="text-brand-slate" align={"center"}>
          Get instantly matched with trusted lawyers who understand your needs.
        </H2>
      </div>

      {/* Attorney cards grid */}
      <div
        className="mt-6 grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 md:mt-8 md:gap-8 lg:grid-cols-3 xl:mt-10 xl:gap-10"
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-delay="100"
      >
        {ATTORNEYS.map((attorney, index) => (
          <div
            key={attorney.name}
            data-aos="flip-left"
            data-aos-duration="600"
            data-aos-delay={200 + index * 100}
          >
            <CardAttorney attorney={attorney} index={index} />
          </div>
        ))}
      </div>
    </main>
  );
}
