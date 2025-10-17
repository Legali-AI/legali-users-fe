"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-sky-blue-100 px-4 py-16">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 text-center">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="text-[120px] font-bold leading-none text-brand-navy/10 sm:text-[160px] lg:text-[200px]">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-semibold text-brand-navy sm:text-5xl">
              Page Not Found
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-4">
          <p className="text-lg text-brand-navy/80 sm:text-xl">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-base text-brand-navy/70">
            Let's get you back on track to access justice.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2F7D99] to-[#5BA3BF] px-8 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:shadow-lg hover:from-[#2A6F8A] hover:to-[#5199B0]"
          >
            <Home className="size-5" />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand-navy/20 bg-white/80 px-8 py-3.5 text-base font-semibold text-brand-navy backdrop-blur-sm transition-all hover:border-brand-navy/40 hover:bg-white"
          >
            <ArrowLeft className="size-5" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 flex flex-col gap-3">
          <p className="text-sm font-medium text-brand-navy/70">
            You might be looking for:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/faq"
              className="rounded-full bg-white/80 px-5 py-2 text-sm font-medium text-brand-navy backdrop-blur-sm transition-all hover:bg-white hover:shadow-md"
            >
              FAQ
            </Link>
            <Link
              href="/about"
              className="rounded-full bg-white/80 px-5 py-2 text-sm font-medium text-brand-navy backdrop-blur-sm transition-all hover:bg-white hover:shadow-md"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="rounded-full bg-white/80 px-5 py-2 text-sm font-medium text-brand-navy backdrop-blur-sm transition-all hover:bg-white hover:shadow-md"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-sky-blue-200/40 blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-brand-gray-50/30 blur-3xl" />
      </div>
    </div>
  );
}
