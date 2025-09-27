import { P } from "../../../../components/elements/typography";
import type { ProblemAboutUs } from "../../../../data/home.data";

interface CardProblemProps {
  problem: ProblemAboutUs;
}

export function CardProblem({ problem }: CardProblemProps) {
  return (
    <div
      style={{
        background:
          "radial-gradient(152.91% 48.81% at 69.85% 56.49%, #FFF 0%, #EDFAFF 100%)",
      }}
      className="w-full space-y-3 rounded-xl border border-white-400 p-4 sm:p-6"
    >
      <div className="flex items-center gap-2">
        <div className="h-fit w-fit rounded-sm bg-sky-blue-800 p-1.5">
          <problem.icon className="h-5 w-5 text-white" />
        </div>
        <P
          level={"h5"}
          weight={"semibold"}
          className="text-sky-blue-900"
          align={"left"}
        >
          {problem.title}
        </P>
      </div>
      <P level={"title"} className="text-brand-slate" align={"left"}>
        {problem.description}
      </P>
    </div>
  );
}
