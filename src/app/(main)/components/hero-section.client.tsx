"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import RichInput, {
  type RichInputPayload,
} from "../../../components/elements/rich-input";
import { H1 } from "../../../components/elements/typography";

const animatedPhrases = ["AI legal ally", "AI-law firm", "AI legal confidant"];

export function HeroAnimatedHeadline() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % animatedPhrases.length);
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const currentPhrase = useMemo(
    () => animatedPhrases[currentIndex],
    [currentIndex]
  );

  return (
    <H1
      id="hero-heading"
      weight="semibold"
      align="center"
      data-aos="zoom-in-down"
      data-aos-duration="600"
    >
      <span>Meet your own </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={currentPhrase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="inline-block text-brand-navy"
        >
          {currentPhrase}
        </motion.span>
      </AnimatePresence>
    </H1>
  );
}

export function HeroPrompt() {
  const router = useRouter();

  const handleSubmit = (payload: RichInputPayload) => {
    const sanitized = payload.text.trim();
    if (sanitized) {
      router.push(`/agent?message=${encodeURIComponent(sanitized)}`);
      return;
    }
    router.push("/agent");
  };

  return (
    <div
      className="w-full max-w-4xl sm:max-w-4xl"
      data-aos="zoom-in"
      data-aos-duration="600"
      data-aos-delay="200"
    >
      <RichInput
        placeholder="Upload your words, voice, or photos — we can make it work."
        onSubmit={handleSubmit}
      />
    </div>
  );
}
