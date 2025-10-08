"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-blue-50 via-white to-white py-24 sm:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-deep-navy sm:text-4xl lg:text-5xl">
            Ready to transform your{" "}
            <span className="bg-gradient-to-r from-sky-blue-500 to-emerald-green-500 bg-clip-text text-transparent">
              legal practice?
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-gray-600">
            Join thousands of legal professionals who trust Legali for their legal service needs. Start your journey
            today with our AI-powered platform.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/welcome">
              <Button
                size="lg"
                className="w-full rounded-full bg-sky-blue-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-sky-blue-300/40 hover:bg-sky-blue-600 sm:w-auto">
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-full border-sky-blue-300 px-8 py-4 text-lg font-semibold text-sky-blue-500 hover:bg-sky-blue-50 sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-x-2 text-sm text-slate-gray-500">
            <span>✓ No credit card required</span>
            <span>•</span>
            <span>✓ Free trial available</span>
          </div>
        </div>
      </div>
    </section>
  );
}
