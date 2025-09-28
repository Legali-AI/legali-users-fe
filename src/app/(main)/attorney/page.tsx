import type { Metadata } from "next";
import Image from "next/image";
import { H1, H2 } from "../../../components/elements/typography";
import { CardAttorney } from "../../../components/module/home/card-attorney";
import { ATTORNEYS } from "../../../data/home.data";

export const metadata: Metadata = {
  title: "Connect with Attorneys",
  description:
    "Get instantly matched with trusted lawyers who understand your needs and can help with your legal case.",
  keywords: ["attorney matching", "lawyer connection", "legal professionals", "case consultation"],
  openGraph: {
    title: "Connect with Attorneys",
    description:
      "Get instantly matched with trusted lawyers who understand your needs and can help with your legal case.",
  },
};

export default function AttorneyPage() {
  return (
    <main
      className="relative flex w-full flex-col items-center justify-center overflow-hidden px-32 py-40"
      aria-label="Attorney connection page">
      {/* Background decorations */}
      <Image
        src="/attorney-decor.svg"
        width={250}
        height={250}
        alt=""
        className="absolute top-1/2 left-0"
        aria-hidden="true"
        sizes="250px"
      />
      <Image
        src="/attorney-decor.svg"
        width={250}
        height={250}
        alt=""
        className="absolute top-1/4 right-0 rotate-180"
        aria-hidden="true"
        sizes="250px"
      />

      {/* Page header */}
      <H1 weight={"semibold"}>Connect with Attorneys</H1>
      <H2 level={"title"} className="text-brand-slate">
        Get instantly matched with trusted lawyers who understand your needs.
      </H2>

      {/* Attorney cards grid */}
      <div className="mt-10 grid max-w-7xl grid-cols-3 gap-10">
        {ATTORNEYS.map((attorney, index) => (
          <CardAttorney key={attorney.name} attorney={attorney} index={index} />
        ))}
      </div>
    </main>
  );
}
