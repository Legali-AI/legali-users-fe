import Image from "next/image";
import { H4, P } from "../../../../components/elements/typography";
import type { ValueProposition } from "../../../../data/home.data";
import { cn } from "../../../../lib/utils";

interface CardValueProps {
  valueProposition: ValueProposition;
  index: number;
}

export function CardValue({ valueProposition, index }: CardValueProps) {
  // Show SVG only for the first card (index 0)
  const shouldShowSVG = index === 0;

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-6 rounded-[32px] bg-white/90 p-6 shadow-[0_40px_80px_-60px_rgba(15,36,71,0.45)] backdrop-blur-sm sm:flex-row sm:gap-12 lg:p-8",
        index % 2 === 1 && "sm:flex-row-reverse"
      )}>
      {/* Image */}
      {shouldShowSVG ? (
        <div className="w-full max-w-[546px] shrink-0">
          <Image
            src="/legali-revolutionize.svg"
            alt="Legali revolutionizes access to justice"
            width={546}
            height={254}
            className="h-auto w-full"
            priority
          />
        </div>
      ) : (
        <div
          className="h-[180px] w-full max-w-[546px] shrink-0 rounded-3xl sm:h-[220px] lg:h-[240px]"
          style={{
            background: "radial-gradient(166.66% 50.29% at 50% 38.41%, #F7F7F7 0%, #EDFAFF 100%)",
          }}
        />
      )}

      {/* Text */}
      <div className="flex-1 space-y-3 text-center sm:space-y-4 sm:text-left">
        <H4 level="h3" weight="semibold" className="text-brand-navy">
          {valueProposition.headline}
        </H4>
        <P level="title" className="text-base text-brand-slate sm:text-lg">
          {valueProposition.description}
        </P>
      </div>
    </div>
  );
}
