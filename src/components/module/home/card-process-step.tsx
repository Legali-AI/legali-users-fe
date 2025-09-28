import type { ProcessStep } from "../../../data/home.data";
import { H4, H5, Span } from "../../elements/typography";

interface CardProcessStepProps {
  processStep: ProcessStep;
  index: number;
}

export function CardProcessStep({ processStep, index }: CardProcessStepProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-white-400 bg-white p-5">
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
      <H5 level={"body"} className="ml-10 text-brand-slate" align={"left"}>
        {processStep.description}
      </H5>
      <div className="mt-2 min-h-[233px] w-full flex-1 rounded-md bg-slate-400" />
    </div>
  );
}
