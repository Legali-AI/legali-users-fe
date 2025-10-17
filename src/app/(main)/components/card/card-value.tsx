import { H4, P } from "../../../../components/elements/typography";
import type { ValueProposition } from "../../../../data/home.data";
import { cn } from "../../../../lib/utils";

interface CardValueProps {
  valueProposition: ValueProposition;
  index: number;
}

export function CardValue({ valueProposition, index }: CardValueProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-6 rounded-[32px] bg-white/90 p-6 text-center shadow-[0_40px_80px_-60px_rgba(15,36,71,0.45)] backdrop-blur-sm sm:flex-row sm:gap-12 sm:text-left lg:p-8",
        index % 2 === 1 && "sm:flex-row-reverse"
      )}
    >
      {/* Image */}
      <div
        className="h-[180px] w-full max-w-[546px] rounded-3xl sm:h-[220px] lg:h-[240px]"
        style={{
          background: "radial-gradient(166.66% 50.29% at 50% 38.41%, #F7F7F7 0%, #EDFAFF 100%)",
        }}
      />
      {/* Text */}
      <div className={cn("flex-1 space-y-3 sm:space-y-4", index % 2 === 1 && "sm:ml-6")}>
        {/* Headline */}
        <H4 level="h3" weight="semibold" align="left" className="text-brand-navy">
          {valueProposition.headline}
        </H4>
        <P level="title" className="text-brand-slate text-base sm:text-lg" align="left">
          {valueProposition.description}
        </P>
      </div>
    </div>
  );
}
