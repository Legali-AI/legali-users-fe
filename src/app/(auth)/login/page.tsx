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
        "grid min-h-screen w-full grid-cols-1 overflow-hidden md:grid-cols-2"
      )}
      aria-label="Login page"
      style={{
        background:
          "linear-gradient(112deg, #7CC9E6 9.96%, #FFF 70.66%, #7CC9E6 103.48%)",
      }}
    >
      <div className="flex flex-col justify-center gap-3 px-40">
        <H1 level={"label"} className="text-sky-900" weight={"semibold"}>
          Welcome to,
        </H1>
        <Image
          src={"/logo.png"}
          width={140}
          height={60}
          alt="Legali Logo"
          priority
          sizes="80px"
        />
        <ButtonClient />
      </div>
      <div className="flex h-full w-full items-start justify-end">
        <Image
          src="/login.png"
          width={1920}
          height={1080}
          alt="Legal professionals working with AI technology"
          priority
          className="h-full w-full object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </main>
  );
}
