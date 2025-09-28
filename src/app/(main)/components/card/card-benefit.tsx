import { H5 } from "../../../../components/elements/typography";
import type { Problem } from "../../../../data/home.data";

interface CardBenefitProps {
  benefit: Problem;
}

export function CardBenefit({ benefit }: CardBenefitProps) {
  return (
    <div className="relative flex h-32 w-full flex-col items-center gap-2 space-y-4 rounded-md bg-white p-2 shadow-xl lg:h-42">
      <div className="flex h-full w-full flex-col justify-center gap-2 bg-sky-blue-100 p-7">
        <div className="flex items-center gap-2">
          <benefit.icon className="h-5 w-5 text-sky-blue-900" />
          <H5 level={"title"} weight={"semibold"} className="text-sky-blue-900">
            {benefit.title}
          </H5>
        </div>
        <H5 level={"label"} className="text-sky-blue-900">
          {benefit.description}
        </H5>
      </div>
    </div>
  );
}
