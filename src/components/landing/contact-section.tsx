"use client";

import { CalendarClock, Mail, MessageSquare, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const channels = [
  {
    icon: Mail,
    title: "Email our team",
    description: "Get a tailored response within one business day.",
    value: "hello@legali.com",
    href: "mailto:hello@legali.com",
  },
  {
    icon: Phone,
    title: "Talk with an expert",
    description: "Book time with a specialist who understands your vertical.",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: MessageSquare,
    title: "Live chat",
    description: "Connect instantly with our concierge during business hours.",
    value: "Chat in-app",
    href: "/support",
  },
];

const CONTACT_SECTION_ID = "contact";

export function ContactSection() {
  return (
    <section
      id={CONTACT_SECTION_ID}
      className="relative overflow-hidden bg-gradient-to-b from-white to-sky-blue-50/60 py-24 sm:py-32">
      <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.25),_transparent_70%)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,360px)_1fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-blue-200 bg-white px-4 py-2 text-sm text-sky-blue-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-green-400" />
              Contact
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-deep-navy sm:text-4xl">
              Ready to deliver branded, intelligent legal experiences?
            </h2>
            <p className="text-lg leading-relaxed text-slate-gray-600">
              Share your goals and we’ll craft a rollout plan—from migrating matters to activating AI copilots and
              investor portals. Every engagement includes structured onboarding and success sprints.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/welcome">
                <Button className="rounded-full bg-emerald-green-400 px-7 py-3 text-white shadow-lg shadow-emerald-green-500/30 hover:bg-emerald-green-500">
                  Start Free Trial
                </Button>
              </Link>
              <Link
                href="https://cal.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-sky-blue-700 hover:text-sky-blue-900">
                <CalendarClock className="h-4 w-4" />
                Book onboarding call
              </Link>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {channels.map(channel => {
              const Icon = channel.icon;
              const isInternal = channel.href.startsWith("/");

              const content = (
                <>
                  <div>
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-blue-500 to-emerald-green-500 text-white shadow-inner">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-6 text-lg font-semibold text-deep-navy">{channel.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-gray-600">{channel.description}</p>
                  </div>
                  <p className="mt-6 text-sm font-medium text-emerald-green-600">{channel.value}</p>
                </>
              );

              return isInternal ? (
                <Link
                  key={channel.title}
                  href={channel.href}
                  className="group flex h-full flex-col justify-between rounded-3xl border border-slate-gray-200/70 bg-white/90 p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.15)] transition hover:-translate-y-1 hover:border-emerald-green-200/80 hover:shadow-[0_30px_80px_-45px_rgba(16,185,129,0.35)]">
                  {content}
                </Link>
              ) : (
                <a
                  key={channel.title}
                  href={channel.href}
                  className="group flex h-full flex-col justify-between rounded-3xl border border-slate-gray-200/70 bg-white/90 p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.15)] transition hover:-translate-y-1 hover:border-emerald-green-200/80 hover:shadow-[0_30px_80px_-45px_rgba(16,185,129,0.35)]">
                  {content}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
