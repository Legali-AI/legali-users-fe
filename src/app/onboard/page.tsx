import type { Metadata } from "next";
import { GlobalLayout } from "../../components/layout/global-layout";
import { PurposeSelectionForm } from "../../components/module/auth/purpose-selection-form";

export const metadata: Metadata = {
  title: "Get Started - Select Your Purpose",
  description: "Choose how you'd like to use Legali's AI-powered legal platform to get started.",
  keywords: ["platform selection", "legal services", "AI assistance", "legal consultation", "litigation funding"],
  openGraph: {
    title: "Get Started - Select Your Purpose",
    description: "Choose how you'd like to use Legali's AI-powered legal platform to get started.",
  },
};

export default function OnboardPage() {
  return (
    <GlobalLayout variant="no-padding" className="bg-gradient-sky-blue relative min-h-screen overflow-hidden">
      {/* Decorative Elements */}
      <div className="pointer-events-none absolute inset-0">
        {/* Top-right decoration */}
        <div className="absolute top-0 right-0 h-96 w-96 translate-x-48 -translate-y-48 transform rounded-full bg-white/5 blur-3xl" />

        {/* Bottom-left decoration */}
        <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-32 translate-y-32 transform rounded-full bg-purple-500/10 blur-3xl" />

        {/* Grid pattern */}
        <div className="bg-grid-pattern absolute inset-0" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-5xl">
          <PurposeSelectionForm />
        </div>
      </div>
    </GlobalLayout>
  );
}
