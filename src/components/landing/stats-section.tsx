"use client";

import { Award, Building2, Clock, FileCheck, type LucideIcon, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const audiences = [
  "Law firms & legal professionals",
  "Individual attorneys",
  "Legal investors & funders",
  "Legal operations teams",
  "Corporate & startup leaders",
  "Government entities",
];

type Metric = {
  icon: LucideIcon;
  value: string;
  label: string;
  description: string;
};

const metrics: Metric[] = [
  {
    icon: Building2,
    value: "10K+",
    label: "Active professionals",
    description: "Teams trust Legali to manage sensitive workflows with enterprise-grade security.",
  },
  {
    icon: FileCheck,
    value: "500+",
    label: "Curated playbooks",
    description: "Templates and automations authored by top-tier legal experts and continuously updated.",
  },
  {
    icon: Award,
    value: "4.9/5",
    label: "Satisfaction rating",
    description: "High adoption across attorneys, clients, and investors thanks to intuitive experiences.",
  },
  {
    icon: Clock,
    value: "3+ yrs",
    label: "Of continuous innovation",
    description: "We ship weekly improvements, backed by compliance programs and customer councils.",
  },
];

const ABOUT_SECTION_ID = "about";

export function StatsSection() {
  return (
    <section
      id={ABOUT_SECTION_ID}
      className="relative overflow-hidden bg-gradient-to-b from-sky-blue-50 via-white to-white py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-blue-200 bg-white px-4 py-2 text-sm text-sky-blue-700 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-green-500" />
            <span>Built for the entire legal ecosystem</span>
          </div>
          <h2 className="mt-8 text-3xl font-semibold tracking-tight text-deep-navy sm:text-4xl">
            Why modern legal teams choose Legali.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-gray-600">
            From boutique firms to global enterprises, Legali delivers a unified operating system that keeps every
            stakeholder aligned, compliant, and confident.
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
          <div className="rounded-3xl border border-sky-blue-100 bg-white p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.2)]">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-blue-400 to-emerald-green-400 text-white">
                <Users className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-xl font-semibold text-deep-navy">Who runs on Legali</h3>
                <p className="text-sm text-slate-gray-500">Tailored experiences for each stakeholder.</p>
              </div>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-slate-gray-600">
              {audiences.map(item => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-sky-blue-100 bg-sky-blue-50/80 px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-green-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {metrics.map(metric => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/welcome">
            <Button className="rounded-full bg-sky-blue-500 px-8 text-white shadow-md shadow-sky-blue-300/40 hover:bg-sky-blue-600">
              Get Started →
            </Button>
          </Link>
          <Link href="#contact" className="text-sm font-medium text-sky-blue-600 hover:text-sky-blue-700">
            Talk with our team
          </Link>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon;

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-sky-blue-100 bg-white p-6 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.2)] transition hover:-translate-y-1 hover:border-emerald-green-200/60">
      <div className="flex items-center justify-between gap-4">
        <span className="text-4xl font-semibold text-deep-navy">{metric.value}</span>
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-blue-50 text-sky-blue-600">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-6 space-y-2">
        <p className="text-sm font-semibold text-deep-navy/80">{metric.label}</p>
        <p className="text-sm leading-relaxed text-slate-gray-600">{metric.description}</p>
      </div>
    </div>
  );
}
