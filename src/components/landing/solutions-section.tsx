"use client";

import { Briefcase, CheckCircle2, FileText, Handshake, type LucideIcon, TrendingUp } from "lucide-react";
import Link from "next/link";

type Solution = {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
  accent: "emerald" | "sky" | "navy";
};

const solutions: Solution[] = [
  {
    icon: TrendingUp,
    title: "Litigation Funding",
    description:
      "Launch campaigns, manage investor relations, and monitor performance with complete transparency across matters.",
    bullets: [
      "Investor-grade diligence rooms and document control.",
      "Live funding momentum dashboards for stakeholders.",
      "Compliance workflows tailored to your jurisdictions.",
    ],
    accent: "emerald",
  },
  {
    icon: FileText,
    title: "Document & Knowledge Ops",
    description:
      "Automate intake, reviews, and drafting with copilots trained on your precedent library and guardrails.",
    bullets: [
      "Clause intelligence, risk flags, and redline summaries.",
      "Version control with AI-generated executive briefs.",
      "Secure collaboration across counsel, clients, and partners.",
    ],
    accent: "sky",
  },
  {
    icon: Handshake,
    title: "Client & Partner Experience",
    description: "Branded portals keep clients informed, aligned, and ready to act—minus the endless email threads.",
    bullets: [
      "Personalized workspaces with milestone tracking.",
      "Self-serve updates, intake forms, and deliverable previews.",
      "Feedback loops and satisfaction insights in real time.",
    ],
    accent: "navy",
  },
  {
    icon: Briefcase,
    title: "Legal Business Intelligence",
    description: "Measure profitability, utilization, and outcomes with dashboards tuned for legal leadership.",
    bullets: [
      "Matter economics, pipeline forecasts, and risk scoring.",
      "Benchmarking against industry peers and historicals.",
      "Exportable insights for board, investor, and client decks.",
    ],
    accent: "emerald",
  },
];

const SOLUTIONS_SECTION_ID = "solutions";

export function SolutionsSection() {
  return (
    <section id={SOLUTIONS_SECTION_ID} className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(16,78,139,0.12),_transparent_65%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,340px)_1fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-deep-navy-100 bg-deep-navy-100/20 px-4 py-2 text-sm text-deep-navy">
              <span className="h-2 w-2 rounded-full bg-emerald-green-400" />
              Solutions
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-deep-navy sm:text-4xl">
              Tailored for every chapter of your legal journey.
            </h2>
            <p className="text-lg leading-relaxed text-slate-gray-600">
              Mix and match modules to support fundraising, service delivery, and client experience. Legali adapts to
              firm maturity, matter types, and partner ecosystems without forcing rigid processes.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-gray-500">
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-blue-50 px-3 py-1 text-sky-blue-700">
                <span className="h-2 w-2 rounded-full bg-sky-blue-500" />
                Configurable playbooks
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-green-50 px-3 py-1 text-emerald-green-700">
                <span className="h-2 w-2 rounded-full bg-emerald-green-500" />
                Secure client portals
              </span>
            </div>
            <Link
              href="#contact"
              className="inline-flex items-center text-sm font-medium text-deep-navy hover:text-sky-blue-600">
              Let’s design your rollout →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {solutions.map(solution => (
              <SolutionCard key={solution.title} solution={solution} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SolutionCard({ solution }: { solution: Solution }) {
  const Icon = solution.icon;
  const accentMap: Record<Solution["accent"], string> = {
    emerald: "from-emerald-green-400/80 to-emerald-green-500/60",
    sky: "from-sky-blue-400/80 to-sky-blue-500/60",
    navy: "from-deep-navy-500/80 to-deep-navy-600/60",
  };

  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-gray-200/70 bg-white/90 p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.2)] transition hover:-translate-y-1 hover:border-emerald-green-200/80 hover:shadow-[0_35px_80px_-45px_rgba(16,185,129,0.4)]">
      <span
        className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accentMap[solution.accent]} text-white shadow-inner`}>
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-6 text-xl font-semibold text-deep-navy">{solution.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-gray-600">{solution.description}</p>
      <ul className="mt-4 space-y-3 text-sm text-slate-gray-600">
        {solution.bullets.map(bullet => (
          <li key={bullet} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-green-500" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
