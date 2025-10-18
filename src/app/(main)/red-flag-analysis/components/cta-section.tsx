"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "../../../../components/ui/button";

export default function CTASection() {
  const scrollToChatbox = () => {
    const chatboxSection = document.getElementById("chatbox-section");
    if (chatboxSection) {
      chatboxSection.scrollIntoView({ behavior: "smooth", block: "center" });
      // Focus on input after scroll completes
      setTimeout(() => {
        const input = chatboxSection.querySelector("textarea");
        if (input) {
          input.focus();
        }
      }, 800);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center gap-8 px-4 py-16 sm:px-8 sm:py-20 md:px-16 lg:px-32 lg:py-24">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 text-center">
        <h2
          className="text-3xl font-bold text-brand-navy sm:text-4xl md:text-5xl lg:text-6xl"
          data-aos="fade-up"
          data-aos-duration="600">
          Ready to get <span className="text-[#2F7D99]">started?</span>
        </h2>

        <p
          className="max-w-2xl text-lg text-brand-navy/80 sm:text-xl"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay="100">
          Start your Red Flag analysis now. We protect your interests in seconds.
        </p>

        <Button
          onClick={scrollToChatbox}
          variant="gradient-teal"
          size="xl"
          weight="semibold"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay="200">
          Upload your file or enter case details
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </section>
  );
}
