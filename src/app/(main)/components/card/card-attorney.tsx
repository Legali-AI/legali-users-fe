import { ExternalLink, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { H4, P } from "../../../../components/elements/typography";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import type { Attorney } from "../../../../data/home.data";
import { cn } from "../../../../lib/utils";

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
          "max-w-[240px] lg:max-w-[290px]",
          index === 0 && "-mr-20 lg:-mr-10",
          index === 1 && "relative z-10 mt-5",
          index !== 0 && index !== 1 && "-ml-20 lg:-ml-10",
        ]
      )}
    >
      {/* Image */}
      <div
        className="flex aspect-square h-[180px] w-full flex-col items-center overflow-hidden  lg:h-[230px]"
        style={{
          background: "linear-gradient(223deg, #EDFAFF 2.59%, #FFF 100%)",
        }}
      >
        {attorney.imageUrl && (
          <Image
            src={attorney.imageUrl}
            alt={attorney.name}
            width={230}
            height={230}
            className="object-contain object-center"
          />
        )}
      </div>

      {/* Divider */}
      <div className="relative z-[10px] -mt-8 h-8 w-full bg-white blur-lg" />

      {/* Text */}
      <div className="flex flex-col gap-2 p-4 lg:p-5">
        {/* Name */}
        <H4
          weight={"semibold"}
          className="text-sky-blue-900"
          level={collapse ? "title" : "h5"}
        >
          {attorney.name}
        </H4>
        {/* Address */}
        <P level={collapse ? "label" : "body"} className="text-brand-slate">
          {attorney.address}
        </P>
        {/* LinkedIn */}
        {attorney.linkedinUrl && (
          <div className="flex items-center gap-2">
            <Linkedin size={16} className="text-sky-blue-900" />
            <P
              level={collapse ? "label" : "body"}
              className="text-sky-blue-900"
            >
              <Link href={attorney.linkedinUrl}>{attorney.name}</Link>
            </P>
          </div>
        )}
        {/* Specialization */}
        <Badge variant={"outline"} level={collapse ? "label" : "body"}>
          {attorney.specialization}
        </Badge>
        {/* Hourly Rate */}
        <Badge
          variant={"ghost"}
          level={collapse ? "label" : "body"}
          weight={"semibold"}
        >
          {attorney.hourlyRate}
        </Badge>
        {/* Connect Button */}
        {!collapse && (
          <Button
            className="ml-auto w-fit rounded-full"
            variant={"gradient-blue"}
          >
            Connect
            <ExternalLink />
          </Button>
        )}
      </div>
    </div>
  );
}
