import Image from "next/image";
import { H4, H5, Span } from "../../../../components/elements/typography";
import type { ProcessStep } from "../../../../data/home.data";
import { cn } from "../../../../lib/utils";

interface CardProcessStepProps {
  processStep: ProcessStep;
  index: number;
}

export function CardProcessStep({ processStep, index }: CardProcessStepProps) {
  return (
    <div
      className="flex flex-col gap-2 overflow-hidden rounded-xl border border-white-400 bg-white p-3 md:p-4 lg:p-5"
      style={{
        background: processStep.colorHex
          ? `linear-gradient(204deg, #FFF 15.34%, ${processStep.colorHex} 127.14%)`
          : "#FFF",
      }}>
      <div className="flex items-center gap-4">
        <Span
          className="flex aspect-square h-7 w-auto items-center justify-center rounded-md bg-slate-gray-300 text-brand-slate"
          weight={"semibold"}>
          {index + 1}
        </Span>
        <H4 level={"h5"} weight={"semibold"}>
          {processStep.title}
        </H4>
      </div>
      <H5 level={"body"} className="ml-12 text-brand-slate" align={"left"}>
        {processStep.description}
      </H5>
      {processStep.imageUrl && (
        <Image
          src={processStep.imageUrl}
          alt={processStep.title}
          width={546}
          height={233}
          className={cn(
            "mt-2 h-[180px] w-full rounded-md object-contain  md:h-[200px] lg:h-[233px]",
            index === 4 ? "-ml-5 object-left-bottom" : "object-center"
          )}
        />
      )}
    </div>
  );
}
