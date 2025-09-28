import type { Metadata } from "next";
import { WelcomeForm } from "../../components/module/auth/welcome-form";

export const metadata: Metadata = {
  title: "Welcome to Legali",
  description: "Complete your profile to get started with Legali's AI-powered legal platform.",
  keywords: ["profile setup", "user registration", "legal platform access"],
  openGraph: {
    title: "Welcome to Legali",
    description: "Complete your profile to get started with Legali's AI-powered legal platform.",
  },
};

export default function WelcomePage() {
  return (
    <main className="relative flex h-screen justify-center overflow-hidden px-4 py-72" aria-label="Welcome page">
      {/* Decoration */}
      <div aria-hidden="true">
        <div
          className="absolute top-[-100px] left-[-100px] -z-10 aspect-square h-auto w-[400px] blur-2xl"
          style={{ backgroundColor: "rgba(200, 241, 255, 0.75)" }}
        />
        <div
          className="absolute top-[-100px] right-[-100px] -z-10 aspect-square h-auto w-[400px] blur-2xl"
          style={{ backgroundColor: "rgba(200, 241, 255, 0.75)" }}
        />
        <div
          className="absolute bottom-[-100px] left-[-100px] -z-10 aspect-square h-auto w-[400px] blur-2xl"
          style={{ backgroundColor: "rgba(200, 241, 255, 0.75)" }}
        />
        <div
          className="absolute right-[-100px] bottom-[-100px] -z-10 aspect-square h-auto w-[400px] blur-2xl"
          style={{ backgroundColor: "rgba(200, 241, 255, 0.75)" }}
        />
      </div>
      <WelcomeForm />
    </main>
  );
}
