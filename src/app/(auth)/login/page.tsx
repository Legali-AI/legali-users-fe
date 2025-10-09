import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import { H1 } from "../../../components/elements/typography";

const ButtonClient = dynamic(() => import("./button-client"), {
  ssr: true,
});

const EmailPasswordForm = dynamic(() => import("./email-password-form"), {
  ssr: true,
});

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
        "relative z-10 grid min-h-screen w-full grid-cols-1 overflow-hidden lg:grid-cols-2"
      )}
      aria-label="Login page"
      style={{
        background:
          "linear-gradient(112deg, #7CC9E6 9.96%, #FFF 70.66%, #7CC9E6 103.48%)",
      }}
    >
      {/* Left side - Login form */}
      <div className="flex flex-col justify-center gap-4 px-6 py-8 max-md:items-center sm:px-8 sm:py-12 md:px-12 md:py-16 lg:px-22 xl:px-20 2xl:px-40">
        <div className="animate-in space-y-1 duration-600 fade-in">
          <H1 level={"label"} className="text-sky-900" weight={"semibold"}>
            Welcome to,
          </H1>
          <Image
            src={"/legali.png"}
            width={200}
            height={79}
            alt="Legali Logo"
            priority
            className="h-auto w-[200px] max-w-[200px]"
            sizes="200px"
          />
        </div>

        <div className="mt-4 flex animate-in flex-col gap-6 delay-150 duration-700 slide-in-from-bottom-4 md:mt-6 xl:mt-8">
          <EmailPasswordForm />
          <ButtonClient />
        </div>
      </div>

      {/* Right side - Hero image */}
      <div className="relative flex h-full w-full animate-in items-start justify-end delay-200 duration-800 fade-in">
        <Image
          src="/login.png"
          width={1920}
          height={1080}
          alt="Legal professionals working with AI technology"
          priority
          className="absolute right-0 bottom-0 -z-10 h-auto w-[90%] animate-in object-contain object-center delay-400 duration-1000 zoom-in-50 lg:h-full"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </main>
  );
}
