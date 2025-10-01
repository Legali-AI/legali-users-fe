import type { Metadata } from "next";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { H1 } from "../../../components/elements/typography";
import ButtonClient from "./button-client";
import EmailPasswordForm from "./email-password-form";

export const metadata: Metadata = {
  title: "Sign in to Legali",
  description: "Access your Legali account to continue building your case and connecting with attorneys.",
  keywords: ["login", "sign in", "account access", "legal platform"],
  openGraph: {
    title: "Sign in to Legali",
    description: "Access your Legali account to continue building your case and connecting with attorneys.",
  },
};

export default function LoginPage() {
  return (
    <main
      className={cn(
        "relative z-10 grid min-h-screen w-full grid-cols-1 overflow-hidden py-20 max-md:pt-20 lg:grid-cols-2"
      )}
      aria-label="Login page"
      style={{
        background: "linear-gradient(112deg, #7CC9E6 9.96%, #FFF 70.66%, #7CC9E6 103.48%)",
      }}>
      {/* Left side - Login form */}
      <div
        className="mt-5 flex flex-col justify-center gap-4 px-6 py-12 max-md:items-center sm:px-8 sm:py-12 md:px-12 md:py-20 lg:px-22 xl:px-20 2xl:px-40"
        data-aos="fade-right"
        data-aos-duration="800"
        data-aos-delay="100">
        <div className="space-y-1" data-aos="fade-up" data-aos-duration="600" data-aos-delay="200">
          <H1 level={"label"} className="text-sky-900 " weight={"semibold"}>
            Welcome to,
          </H1>
          <Image
            src={"/legali.png"}
            width={240}
            height={95}
            alt="Legali Logo"
            priority
            className="h-auto w-auto"
            sizes="(max-width: 640px) 180px, (max-width: 768px) 200px, (max-width: 1024px) 220px, 240px"
          />
        </div>

        <div
          className="mt-4 flex flex-col gap-6 md:mt-6 xl:mt-8"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay="300">
          <EmailPasswordForm />
          <ButtonClient />
        </div>
      </div>

      {/* Right side - Hero image */}
      <div
        className="-pt-40 relative flex h-full w-full items-start justify-end"
        data-aos="fade-left"
        data-aos-duration="800"
        data-aos-delay="200">
        <Image
          src="/login.png"
          width={1920}
          height={1080}
          alt="Legal professionals working with AI technology"
          priority
          className="absolute right-0 bottom-0 -z-10 h-auto w-[90%] object-contain object-center lg:h-full"
          sizes="(max-width: 1024px) 100vw, 50vw"
          data-aos="zoom-in"
          data-aos-duration="1000"
          data-aos-delay="400"
        />
      </div>
    </main>
  );
}
