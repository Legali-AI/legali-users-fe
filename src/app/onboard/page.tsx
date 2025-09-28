import type { Metadata } from "next";
import { PurposeSelectionForm } from "../../components/module/auth/purpose-selection-form";

export const metadata: Metadata = {
  title: "Get Started - Select Your Purpose",
  description:
    "Choose how you'd like to use Legali's AI-powered legal platform to get started.",
  keywords: [
    "platform selection",
    "legal services",
    "AI assistance",
    "legal consultation",
    "litigation funding",
  ],
  openGraph: {
    title: "Get Started - Select Your Purpose",
    description:
      "Choose how you'd like to use Legali's AI-powered legal platform to get started.",
  },
};

export default function OnboardPage() {
  return (
    <main
      className="bg-gradient-sky-blue relative flex h-screen items-center justify-center overflow-hidden px-4 py-16"
      aria-label="Onboarding page"
    >
      {/* Decorative blur elements */}
      <div aria-hidden="true">
        <div
          className="absolute top-[-100px] left-[-100px] -z-10 aspect-square h-auto w-[400px] opacity-40 blur-3xl"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
        />
        <div
          className="absolute top-[-100px] right-[-100px] -z-10 aspect-square h-auto w-[400px] opacity-40 blur-3xl"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
        />
        <div
          className="absolute bottom-[-100px] left-[-100px] -z-10 aspect-square h-auto w-[400px] opacity-40 blur-3xl"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
        />
        <div
          className="absolute right-[-100px] bottom-[-100px] -z-10 aspect-square h-auto w-[400px] opacity-40 blur-3xl"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
        />
      </div>

      {/* Main content with glass effect */}
      <div className="mx-4 w-full max-w-4xl rounded-3xl border border-white/30 bg-white/90 p-8 shadow-xl backdrop-blur-sm">
        <PurposeSelectionForm />
      </div>
    </main>
  );
}
