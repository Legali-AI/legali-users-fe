"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RichInput from "../../../components/elements/rich-input";
import { H1, H2 } from "../../../components/elements/typography";
import { Badge } from "../../../components/ui/badge";
import { NAVIGATION_FEATURES } from "../../../data/home.data";

export default function HeroSection() {
  const router = useRouter();

  // Animated text rotation state
  const animatedTexts = ["AI-law firm", "AI-legal confidant", "AI-legal resources"];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Cycle through texts every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex(prevIndex => (prevIndex + 1) % animatedTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (payload: { text?: string; files?: File[] }) => {
    if (payload.text?.trim()) {
      // Encode the message for URL
      const encodedMessage = encodeURIComponent(payload.text.trim());
      router.push(`/agent?message=${encodedMessage}`);
    } else {
      router.push("/agent");
    }
  };

  return (
    <section className="flex min-h-[90vh] items-center justify-center" aria-labelledby="hero-heading">
      {/* Background decorations */}
      <div aria-hidden="true">
        <div
          className="absolute top-0 left-1/2 -z-10 aspect-square h-auto w-[400px] -translate-x-1/2 blur-2xl"
          style={{ backgroundColor: "rgba(200, 241, 255, 0.75)" }}
        />
        <div
          className="absolute top-[400px] -left-20 -z-10 aspect-square h-auto w-[400px] blur-2xl"
          style={{ backgroundColor: "rgba(200, 241, 255, 0.75)" }}
        />
        <div
          className="absolute top-[600px] -right-20 -z-10 aspect-square h-auto w-[400px] blur-2xl"
          style={{ backgroundColor: "rgba(200, 241, 255, 0.75)" }}
        />
        <div
          style={{
            borderRadius: "997px",
            background: "rgba(200, 241, 255, 0.5)",
            width: "997px",
            height: "206px",
            flexShrink: 0,
            filter: "blur(54.349998474121094px)",
          }}
          className="absolute top-[800px] left-1/2 -z-10 -translate-x-1/2"
        />
      </div>

      {/* Hero content */}
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-5">
        {/* Main headline with animated text */}
        <div data-aos="zoom-in-down" data-aos-duration="600">
          <H1 weight={"semibold"} align={"center"}>
            <span>Meet your first </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={currentTextIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="inline-block">
                {animatedTexts[currentTextIndex]}
              </motion.span>
            </AnimatePresence>
          </H1>
        </div>

        {/* Subtitle */}
        <div data-aos="zoom-in" data-aos-duration="600" data-aos-delay="100">
          <H2 level={"title"} className="text-brand-slate" align={"center"}>
            Legali lets you build cases, manage evidence, and fund litigation—all on one secure AI platform.
          </H2>
        </div>

        {/* Search input */}
        <div className="mt-4 w-full" data-aos="zoom-in" data-aos-duration="600" data-aos-delay="200">
          <RichInput onSubmit={handleSubmit} />
        </div>

        {/* Feature badges */}
        <div
          className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay="300">
          {NAVIGATION_FEATURES.map((feature, index) => (
            <div key={feature.label} data-aos="flip-up" data-aos-duration="600" data-aos-delay={400 + index * 50}>
              <Badge level={"body"} variant={"gradient-blue"} size={"lg"}>
                <feature.icon size={30} aria-hidden="true" />
                <span className="sr-only hidden">Feature: </span>
                {feature.label}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
