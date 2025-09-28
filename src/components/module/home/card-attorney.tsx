import { Linkedin } from "lucide-react";
import Link from "next/link";
import type { Attorney } from "../../../data/home.data";
import { cn } from "../../../lib/utils";
import { H4, P } from "../../elements/typography";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";

interface CardAttorneyProps {
  attorney: Attorney;
  index: number;
  collapse?: boolean;
}

export function CardAttorney({ attorney, index, collapse }: CardAttorneyProps) {
  return (
    <div
      className={cn(
        "flex h-fit w-full flex-col gap-2 overflow-hidden rounded-xl border border-white-500 bg-white",
        collapse && [
          "max-w-[290px]",
          index === 0 && "sm:-mr-10",
          index === 1 && "relative z-10 sm:mt-5",
          index !== 0 && index !== 1 && "sm:-ml-10",
        ]
      )}>
      <div className="aspect-square h-[230px] w-full bg-slate-500" />
      <div className="relative z-[2px] -mt-10 h-8 w-full bg-white blur-3xl" />

      <div className="flex flex-col gap-2 p-5">
        <H4 weight={"semibold"} className="text-sky-blue-900" level={collapse ? "title" : "h5"}>
          {attorney.name}
        </H4>
        <P level={collapse ? "label" : "body"} className="text-brand-slate">
          {attorney.address}
        </P>
        {attorney.linkedinUrl && (
          <div className="flex items-center gap-2">
            <Linkedin size={16} />
            <P level={collapse ? "label" : "body"} className="text-sky-blue-900">
              <Link href={attorney.linkedinUrl}>{attorney.linkedinUrl}</Link>
            </P>
          </div>
        )}
        <Badge variant={"sky-blue"} level={collapse ? "label" : "body"}>
          {attorney.specialization}
        </Badge>
        <Badge variant={"outline-warm-orange"} level={collapse ? "label" : "body"} weight={"semibold"}>
          {attorney.hourlyRate}
        </Badge>
        {!collapse && (
          <Button className="ml-auto w-fit rounded-full" variant={"orange"} size={"lg"}>
            Connect
          </Button>
        )}
      </div>
    </div>
  );
}
