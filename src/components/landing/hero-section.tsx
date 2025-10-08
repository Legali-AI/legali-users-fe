"use client";

import { ArrowRight, LineChart, type LucideIcon, ShieldCheck, Sparkles, TimerReset } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const rotatingTerms = ["cases", "campaigns", "clients", "outcomes"];
const ANIMATION_INTERVAL = 3200;
const FADE_DURATION = 260;

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let fadeTimeout: NodeJS.Timeout | null = null;

    const interval = setInterval(() => {
      setIsFadingOut(true);
      fadeTimeout = setTimeout(() => {
        setActiveIndex(previous => (previous + 1) % rotatingTerms.length);
        setIsFadingOut(false);
      }, FADE_DURATION);
    }, ANIMATION_INTERVAL);

    return () => {
      if (fadeTimeout) {
        clearTimeout(fadeTimeout);
      }
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-sky-blue-50 to-white py-24 text-deep-navy sm:py-32">
      <div className="absolute inset-0">
        <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-sky-blue-200/40 blur-3xl sm:-left-16 sm:h-[26rem] sm:w-[26rem]" />
        <div className="pointer-events-none absolute -right-24 top-24 h-64 w-64 rounded-full bg-emerald-green-200/40 blur-3xl sm:-right-12 sm:h-[22rem] sm:w-[22rem]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_65%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-blue-200 bg-white px-4 py-2 text-sm text-sky-blue-700 shadow-sm">
              <Sparkles className="h-4 w-4 text-sky-blue-500" />
              <span>AI-first operating system for legal teams</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-deep-navy sm:text-5xl lg:text-6xl">
                The smarter way to launch legal{" "}
                <span aria-live="polite" aria-atomic="true" className="relative inline-flex items-center">
                  <span
                    className={`rounded-full bg-sky-blue-100 px-3 py-1 text-sky-blue-700 transition-all duration-200 ${isFadingOut ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"}`}>
                    {rotatingTerms[activeIndex]}
                  </span>
                </span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-slate-gray-600 sm:text-xl">
                Legali fuses AI copilots with trusted expertise so lawyers, firms, and investors can collaborate, fund,
                and resolve matters faster—all within a secure workspace that feels unmistakably on-brand.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/welcome">
                <Button
                  size="lg"
                  className="rounded-full bg-sky-blue-500 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-sky-blue-300/50 transition hover:-translate-y-0.5 hover:bg-sky-blue-600">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center text-sm font-medium text-sky-blue-600 transition hover:text-sky-blue-700">
                Book a demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatBadge icon={ShieldCheck} label="SOC 2-ready security" highlight="Data residency controls" />
              <StatBadge icon={LineChart} label="$250M funded cases" highlight="+38% faster decisions" />
              <StatBadge icon={TimerReset} label="4x faster reviews" highlight="AI copilots on every workflow" />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div
              className="absolute -inset-4 rounded-[32px] bg-gradient-to-tr from-sky-blue-200/50 via-white to-transparent blur-3xl"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-[32px] border border-sky-blue-100 bg-white p-6 shadow-[0px_40px_120px_-60px_rgba(14,116,144,0.45)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-gray-500">Case intelligence</p>
                  <p className="mt-1 text-lg font-semibold">Crowdfunding HQ</p>
                </div>
                <span className="rounded-full border border-sky-blue-100 bg-sky-blue-50 px-3 py-1 text-xs text-sky-blue-600">
                  Live sync
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InsightCard title="Active matters" value="128" delta="+12 this week" />
                <InsightCard title="Investor pipeline" value="$4.2M" delta="+18% MoM" accent="emerald" />
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-deep-navy">AI Review queue</span>
                  <span className="text-xs text-emerald-green-500">98% accuracy</span>
                </div>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-sky-blue-100">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-sky-blue-500 to-emerald-green-400" />
                </div>
                <ul className="mt-4 space-y-3 text-sm text-slate-gray-600">
                  <li className="flex items-center justify-between">
                    <span>IPO compliance update</span>
                    <span className="text-xs text-sky-blue-600">Complete</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Funding diligence pack</span>
                    <span className="text-xs text-slate-gray-500">In progress</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Risk signals summary</span>
                    <span className="text-xs text-emerald-green-500">Cleared</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type StatBadgeProps = {
  icon: LucideIcon;
  label: string;
  highlight: string;
};

function StatBadge({ icon: Icon, label, highlight }: StatBadgeProps) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-sky-blue-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-blue-100 text-sky-blue-600">
          <Icon className="h-5 w-5" />
        </span>
        <p className="text-sm font-medium text-deep-navy">{label}</p>
      </div>
      <p className="text-xs text-slate-gray-500">{highlight}</p>
    </div>
  );
}

type InsightCardProps = {
  title: string;
  value: string;
  delta: string;
  accent?: "emerald" | "sky";
};

function InsightCard({ title, value, delta, accent = "sky" }: InsightCardProps) {
  const accentClasses = accent === "emerald" ? "text-emerald-green-600" : "text-sky-blue-600";

  return (
    <div className="rounded-2xl border border-sky-blue-100 bg-sky-blue-50/60 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-deep-navy">{value}</p>
      <p className={`mt-1 text-xs font-medium ${accentClasses}`}>{delta}</p>
    </div>
  );
}
