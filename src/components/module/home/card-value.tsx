import type { ValueProposition } from "../../../data/home.data";
import { cn } from "../../../lib/utils";
import { H4, P } from "../../elements/typography";

interface CardValueProps {
  valueProposition: ValueProposition;
  index: number;
}

export function CardValue({ valueProposition, index }: CardValueProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-md bg-white p-4 sm:flex-row sm:gap-10",
        index % 2 === 1 && "sm:flex-row-reverse"
      )}>
      {/* Image */}
      <div className="h-[200px] w-full max-w-[546px] rounded-xl bg-slate-400 sm:h-[243px]" />
      {/* Text */}
      <div className={cn("flex-1 space-y-2", index % 2 === 1 && "sm:ml-4")}>
        {/* Headline */}
        <H4 level={"h4"} weight={"semibold"} align={"left"}>
          {valueProposition.headline}
        </H4>
        <P level={"title"} className="text-brand-slate" align={"left"}>
          {valueProposition.description}
        </P>
      </div>
    </div>
  );
}
