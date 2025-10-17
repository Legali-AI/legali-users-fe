"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RichInput, { type RichInputPayload } from "../../../components/elements/rich-input";

// Content data
const HERO_CONTENT = {
  headline: "Spot legal risks before they become problems",
  subheadline: "Get your documents reviewed and spot red flags. Act early and be better prepared.",
  placeholder: "Upload your words, voice, or photos -- we can make it work",
};

const FEATURES = [
  {
    id: 1,
    image: "/home/features/rfa-1.png",
    title: "Upload case",
    description:
      "Upload your file or enter case details. Legali automatically highlights clauses, conflicts, and trends that may require attention.",
    badge: "1 conflict detected",
    badgeVariant: "warning" as const,
  },
  {
    id: 2,
    image: "/home/features/rfa-2.png",
    title: "View instant flagged sections",
    description: "View instant flagged sections with plain-English explanations",
    highlight: "Legali AI",
    highlightDescription:
      "Organize evidence, draft documents, connect with affordable attorneys, and fund your case — all on one secure platform.",
  },
  {
    id: 3,
    image: "/home/features/rfa-3.png",
    title: "Get personalized recommendations",
    description: "Get personalized recommendations for next steps: edit, seek review, or escalate for legal support.",
    recommendations: [
      {
        title: "Clarify Payment Terms",
        description: "Clause 4 contains vague wording about due dates, rewrite for clarity.",
      },
      {
        title: "Compliance Check Needed",
        description: "Ask a compliance officer to review the privacy policy in section 8.",
      },
    ],
  },
];

const CTA_CONTENT = {
  heading: "Ready to get ",
  headlineHighlight: "started?",
  subheading: "Start your Red Flag analysis now. We protect your interests in seconds.",
  buttonText: "Upload your file or enter case details",
  buttonHref: "/agent?conversation_type=red-flag-analysis",
};

export default function RedFlagAnalysisPage() {
  const router = useRouter();

  const handleSubmit = (payload: RichInputPayload) => {
    const sanitized = payload.text.trim();
    if (sanitized) {
      router.push(`/agent?conversation_type=red-flag-analysis&message=${encodeURIComponent(sanitized)}`);
      return;
    }
    router.push("/agent?conversation_type=red-flag-analysis");
  };

  return (
    <main className="relative z-10 flex w-full flex-col overflow-x-hidden bg-sky-blue-100">
      {/* Hero Section */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 sm:px-8 sm:py-24 md:px-16 lg:px-32">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 text-center">
          {/* Headline */}
          <h1
            className="text-4xl font-semibold leading-tight text-brand-navy sm:text-5xl md:text-6xl lg:text-7xl"
            data-aos="fade-up"
            data-aos-duration="600">
            {HERO_CONTENT.headline}
          </h1>

          {/* Subheadline */}
          <p
            className="max-w-3xl text-lg text-brand-navy/80 sm:text-xl md:text-2xl"
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-delay="100">
            {HERO_CONTENT.subheadline}
          </p>

          {/* Input */}
          <div className="w-full max-w-4xl" data-aos="fade-up" data-aos-duration="600" data-aos-delay="200">
            <RichInput placeholder={HERO_CONTENT.placeholder} onSubmit={handleSubmit} />
          </div>
        </div>

        {/* Background decorations */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-sky-blue-200/40 blur-3xl" />
          <div className="absolute right-1/4 top-60 h-96 w-96 rounded-full bg-brand-gray-50/30 blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="flex flex-col gap-12 px-4 py-16 sm:gap-16 sm:px-8 sm:py-20 md:px-16 lg:gap-20 lg:px-32 lg:py-24">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 sm:gap-16 lg:gap-20">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.id}
              className="flex flex-col gap-8 lg:gap-12"
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay={index * 100}>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                {/* Image */}
                <div className="relative aspect-video w-full overflow-hidden rounded-[24px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_40px_-30px_rgba(15,36,71,0.35)]">
                  <Image src={feature.image} alt={feature.title} fill className="object-contain p-4" />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center gap-4">
                  <h3 className="text-2xl font-semibold text-brand-navy sm:text-3xl md:text-4xl">{feature.title}</h3>
                  <p className="text-base text-brand-navy/80 sm:text-lg md:text-xl">{feature.description}</p>

                  {/* Additional content based on feature type */}
                  {feature.badge && (
                    <div className="mt-2">
                      <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-700 border border-red-200">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <title>Warning icon</title>
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature.badge}
                      </span>
                    </div>
                  )}

                  {feature.highlight && (
                    <div className="mt-4 rounded-xl border border-amber-200/60 bg-amber-50/40 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          className="h-5 w-5 text-amber-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true">
                          <title>Star icon</title>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-semibold text-brand-navy">{feature.highlight}</span>
                      </div>
                      <p className="text-sm text-brand-navy/80">{feature.highlightDescription}</p>
                    </div>
                  )}

                  {feature.recommendations && (
                    <div className="mt-4 space-y-3">
                      {feature.recommendations.map((rec, idx) => (
                        <div key={idx} className="rounded-xl border border-sky-blue-200/60 bg-white/90 p-4">
                          <h4 className="font-semibold text-brand-navy mb-1">{rec.title}</h4>
                          <p className="text-sm text-brand-navy/70">{rec.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex flex-col items-center justify-center gap-8 px-4 py-16 sm:px-8 sm:py-20 md:px-16 lg:px-32 lg:py-24">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 text-center">
          <h2
            className="text-3xl font-bold text-brand-navy sm:text-4xl md:text-5xl lg:text-6xl"
            data-aos="fade-up"
            data-aos-duration="600">
            {CTA_CONTENT.heading}
            <span className="text-[#2F7D99]">{CTA_CONTENT.headlineHighlight}</span>
          </h2>

          <p
            className="max-w-2xl text-lg text-brand-navy/80 sm:text-xl"
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-delay="100">
            {CTA_CONTENT.subheading}
          </p>

          <Link
            href={CTA_CONTENT.buttonHref}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2F7D99] to-[#5BA3BF] px-8 py-4 text-lg font-semibold text-white shadow-md transition-all hover:shadow-lg hover:from-[#2A6F8A] hover:to-[#5199B0]"
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-delay="200">
            {CTA_CONTENT.buttonText}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
