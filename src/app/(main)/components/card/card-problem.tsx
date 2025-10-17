import { P } from "../../../../components/elements/typography";
import type { ProblemAboutUs } from "../../../../data/home.data";

interface CardProblemProps {
  problem: ProblemAboutUs;
}

export function CardProblem({ problem }: CardProblemProps) {
  return (
    <div
      style={{
        background: "radial-gradient(152.91% 48.81% at 69.85% 56.49%, #FFFFFF 0%, #EDFAFF 100%)",
      }}
      className="flex h-full w-full flex-col gap-3 rounded-[28px] border border-white/70 p-5 shadow-[0_30px_60px_-45px_rgba(15,36,71,0.55)] backdrop-blur-sm sm:p-6"
    >
      <div className="flex items-center gap-3">
        <div
          className="rounded-lg bg-gradient-to-br from-[#2F7D99] to-[#A4D1E8] p-2 text-white"
          aria-hidden="true"
        >
          <problem.icon className="h-5 w-5" />
        </div>
        <P level="title" weight="semibold" className="text-deep-navy sm:text-lg">
          {problem.title}
        </P>
      </div>
      <P level="body" className="text-sm text-brand-slate sm:text-base">
        {problem.description}
      </P>
    </div>
  );
}
