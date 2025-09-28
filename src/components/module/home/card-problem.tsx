import type { Problem } from "../../../data/home.data";
import { P } from "../../elements/typography";

interface CardProblemProps {
  problem: Problem;
}

export function CardProblem({ problem }: CardProblemProps) {
  return (
    <div
      style={{
        background: "radial-gradient(129.59% 55.61% at 40.76% 84.27%, #FFF 0%, #EDFAFF 100%)",
      }}
      className="w-full space-y-2 rounded-xl border border-white-400 p-4 sm:p-6">
      <div className="mb-3 h-8 w-8 rounded-sm bg-sky-blue-800" />
      <P level={"h5"} weight={"semibold"} className="text-sky-blue-900" align={"left"}>
        {problem.title}
      </P>
      <P level={"title"} className="text-brand-slate" align={"left"}>
        {problem.description}
      </P>
    </div>
  );
}
