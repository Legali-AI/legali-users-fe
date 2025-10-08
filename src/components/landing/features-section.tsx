"use client";

import {
  ArrowRight,
  Bot,
  CheckCircle2,
  FileText,
  type LucideIcon,
  Scale,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  tag: string;
};

const features: Feature[] = [
  {
    icon: Bot,
    title: "AI Legal Copilots",
    description:
      "Automate matter intake, triage, and drafting with copilots that learn from your playbooks and stay compliant with guardrails.",
    tag: "Automation",
  },
  {
    icon: TrendingUp,
    title: "Litigation Crowdfunding",
    description:
      "Launch, manage, and scale investor campaigns with transparent funding funnels, compliance workflows, and performance analytics.",
    tag: "Growth",
  },
  {
    icon: FileText,
    title: "Document Intelligence",
    description:
      "AI-assisted review highlights risk, version history, and key clauses—no more manual table flipping or missed obligations.",
    tag: "Insights",
  },
  {
    icon: Scale,
    title: "Precedent Research",
    description:
      "Context-aware search surfaces the most relevant rulings, filings, and strategy notes across jurisdictions in seconds.",
    tag: "Research",
  },
  {
    icon: Users,
    title: "Client Collaboration",
    description:
      "Keep every stakeholder aligned with secure portals, shared checklists, and status updates that feel native to your firm.",
    tag: "Collaboration",
  },
  {
    icon: Search,
    title: "Case Intelligence",
    description:
      "Detect funding readiness, risk signals, and outcome probability with dashboards designed for legal ops and investment teams.",
    tag: "Analytics",
  },
];

const highlights = [
  "Enterprise SSO, granular permissions, and audit trails included.",
  "Localized data residency and encryption managed by design.",
  "Modular architecture to plug into your existing stack.",
];

const FEATURES_SECTION_ID = "features";

export function FeaturesSection() {
  return (
    <section
      id={FEATURES_SECTION_ID}
      className="relative overflow-hidden bg-gradient-to-b from-white via-sky-blue-50/70 to-white py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(ellipse_at_top,_rgba(14,165,233,0.15),_transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-16">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-blue-200/50 bg-white px-4 py-2 text-sm text-sky-blue-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-green-400" />
              Platform modules
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold tracking-tight text-deep-navy sm:text-4xl">
                Everything your legal organisation needs in one workspace.
              </h2>
              <p className="text-lg leading-relaxed text-slate-gray-600">
                Purpose-built tooling covers the entire lifecycle—intake, diligence, funding, delivery, and post-matter
                intelligence. Configure workflows without touching code, while AI keeps every team member two steps
                ahead.
              </p>
            </div>

            <ul className="space-y-4">
              {highlights.map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-gray-600">
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-green-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/welcome">
              <Button
                size="lg"
                className="rounded-full bg-deep-navy-500 px-8 text-white shadow-lg shadow-deep-navy-900/20 hover:bg-deep-navy-600">
                Explore Platform
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {features.map(feature => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;

  return (
    <div className="group relative h-full rounded-3xl border border-sky-blue-100/60 bg-white/80 p-6 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.25)] backdrop-blur transition hover:-translate-y-1 hover:border-emerald-green-200/80 hover:shadow-[0_35px_80px_-40px_rgba(15,118,110,0.4)]">
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center rounded-full bg-sky-blue-50 px-3 py-1 text-xs font-semibold text-sky-blue-600">
          {feature.tag}
        </span>
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-blue-500 to-emerald-green-500 text-white shadow-inner shadow-emerald-green-500/40">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <h3 className="mt-6 text-lg font-semibold text-deep-navy">{feature.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-gray-600">{feature.description}</p>
    </div>
  );
}
