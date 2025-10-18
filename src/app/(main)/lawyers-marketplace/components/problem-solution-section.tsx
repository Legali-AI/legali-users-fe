import type { LucideIcon } from "lucide-react";
import { PROBLEM_BADGE, PROBLEMS, SOLUTION_BADGE, SOLUTIONS } from "../../../../data/lawyers-marketplace.data";

// Server Component
export default function ProblemSolutionSection() {
  return (
    <section className="flex flex-col items-center gap-16 px-4 py-16 sm:gap-20 sm:px-8 sm:py-20 md:px-16 lg:gap-24 lg:px-32 lg:py-24">
      {/* The Problem Section */}
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10">
        {/* Badge */}
        <div
          className="rounded-full border border-brand-navy/20 bg-white px-6 py-2 shadow-sm"
          data-aos="fade-up"
          data-aos-duration="600">
          <span className="text-sm font-semibold text-brand-navy sm:text-base">{PROBLEM_BADGE}</span>
        </div>

        {/* Problem Cards Grid - 2x2 */}
        <div className="grid w-full grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:gap-10">
          {PROBLEMS.map((problem, index) => (
            <ProblemCard
              key={index}
              icon={problem.icon}
              title={problem.title}
              description={problem.description}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* The Solution Section */}
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10">
        {/* Badge */}
        <div
          className="rounded-full border border-brand-navy/20 bg-white px-6 py-2 shadow-sm"
          data-aos="fade-up"
          data-aos-duration="600">
          <span className="text-sm font-semibold text-brand-navy sm:text-base">{SOLUTION_BADGE}</span>
        </div>

        {/* Solution Cards Grid - 2x2 */}
        <div className="grid w-full grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:gap-10">
          {SOLUTIONS.map((solution, index) => (
            <ProblemCard
              key={index}
              icon={solution.icon}
              title={solution.title}
              description={solution.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Problem/Solution Card Component (same styling for both)
interface ProblemCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

function ProblemCard({ icon: Icon, title, description, index }: ProblemCardProps) {
  return (
    <div
      className="flex flex-col gap-4 rounded-[24px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_40px_-30px_rgba(15,36,71,0.35)] sm:p-8"
      data-aos="fade-up"
      data-aos-duration="600"
      data-aos-delay={index * 50}>
      {/* Icon */}
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-[#2F7D99]" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-brand-navy sm:text-xl">{title}</h3>
      </div>

      {/* Description */}
      <p className="text-sm leading-relaxed text-brand-navy/70 sm:text-base">{description}</p>
    </div>
  );
}
