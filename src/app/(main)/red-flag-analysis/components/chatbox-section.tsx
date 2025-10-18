"use client";

import { useRouter } from "next/navigation";
import RichInput, { type RichInputPayload } from "../../../../components/elements/rich-input";

export default function ChatboxSection() {
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
    <section
      id="chatbox-section"
      className="flex flex-col items-center justify-center gap-8 px-4 py-16 sm:px-8 sm:py-20 md:px-16 lg:px-32 lg:py-24">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6">
        {/* Section Title */}
        <div className="text-center" data-aos="fade-up" data-aos-duration="600">
          <h2 className="mb-4 text-3xl font-bold text-brand-navy sm:text-4xl md:text-5xl">
            Try it now
          </h2>
          <p className="text-lg text-brand-navy/80 sm:text-xl">
            Upload your words, voice, or photos — we can make it work
          </p>
        </div>

        {/* Rich Input Chatbox */}
        <div className="w-full" data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
          <RichInput
            placeholder="Upload your file or enter case details..."
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </section>
  );
}
