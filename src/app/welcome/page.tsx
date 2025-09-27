import type { Metadata } from "next";
import { WelcomeForm } from "./welcome-form";

export const metadata: Metadata = {
  title: "Welcome to Legali",
  description:
    "Complete your profile to get started with Legali's AI-powered legal platform.",
  keywords: ["profile setup", "user registration", "legal platform access"],
  openGraph: {
    title: "Welcome to Legali",
    description:
      "Complete your profile to get started with Legali's AI-powered legal platform.",
  },
};

export default function WelcomePage() {
  return (
    <main
      className="relative z-10 flex h-screen justify-center overflow-hidden bg-sky-blue-100 px-4 py-72"
      aria-label="Welcome page"
    >
      {/* Decoration */}
      <div aria-hidden="true">
        {/* Bottom Left */}
        <div
          className="absolute bottom-[-100px] left-[-100px] -z-10 aspect-square h-auto w-[440px] bg-red "
          style={{
            borderRadius: "445.321px",
            background: "rgba(200, 241, 255, 0.50)",
            filter: "blur(54.349998474121094px)",
          }}
        />
        {/* Bottom */}
        <div
          className="absolute right-[400px] bottom-0 -z-10 aspect-[5/1] h-auto w-[1000px]"
          style={{
            borderRadius: "1032.524px",
            background: "rgba(200, 241, 255, 0.50)",
            filter: "blur(54.349998474121094px)",
          }}
        />
        {/* Bottom Right */}
        <div
          className="absolute right-[-100px] bottom-[-100px] -z-10 aspect-square h-auto w-[440px] bg-red "
          style={{
            borderRadius: "445.321px",
            background: "rgba(200, 241, 255, 0.50)",
            filter: "blur(54.349998474121094px)",
          }}
        />
        {/* Top  */}
        <div
          className="absolute top-[-100px] right-[400px] -z-10 aspect-square h-auto w-[440px] bg-red "
          style={{
            borderRadius: "445.321px",
            background: "rgba(200, 241, 255, 0.50)",
            filter: "blur(54.349998474121094px)",
          }}
        />
      </div>
      <WelcomeForm />
    </main>
  );
}
