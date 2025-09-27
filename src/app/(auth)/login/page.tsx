import type { Metadata } from "next";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { H1 } from "../../../components/elements/typography";
import ButtonClient from "./button-client";

export const metadata: Metadata = {
  title: "Sign in to Legali",
  description:
    "Access your Legali account to continue building your case and connecting with attorneys.",
  keywords: ["login", "sign in", "account access", "legal platform"],
  openGraph: {
    title: "Sign in to Legali",
    description:
      "Access your Legali account to continue building your case and connecting with attorneys.",
  },
};

export default function LoginPage() {
  return (
    <main
      className={cn(
        "relative z-10 grid min-h-screen w-full grid-cols-1 overflow-hidden max-md:pt-20 lg:grid-cols-2"
      )}
      aria-label="Login page"
      style={{
        background:
          "linear-gradient(112deg, #7CC9E6 9.96%, #FFF 70.66%, #7CC9E6 103.48%)",
      }}
    >
      {/* Left side - Login form */}
      <div className="flex flex-col justify-center gap-4 px-6 py-8 max-md:items-center sm:px-8 sm:py-12 md:px-12 md:py-16 lg:px-16 xl:px-20 2xl:px-40">
        <div className="space-y-2">
          <H1 level={"label"} className="text-sky-900 " weight={"semibold"}>
            Welcome to,
          </H1>
          <Image
            src={"/logo.png"}
            width={140}
            height={60}
            alt="Legali Logo"
            priority
            className="h-12 w-auto md:h-14"
            sizes="(max-width: 640px) 120px, (max-width: 768px) 140px, (max-width: 1024px) 160px, 180px"
          />
        </div>
        <div className="mt-4">
          <ButtonClient />
        </div>
      </div>

      {/* Right side - Hero image */}
      <div className="-pt-40 relative flex h-full w-full items-start justify-end">
        <Image
          src="/login.png"
          width={1920}
          height={1080}
          alt="Legal professionals working with AI technology"
          priority
          className="absolute right-0 bottom-0 -z-10 h-auto w-[90%] object-contain object-center lg:h-full"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </main>
  );
}
