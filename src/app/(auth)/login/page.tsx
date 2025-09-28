import type { Metadata } from "next";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
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
    <main className={cn("bg-gradient-sky-blue grid min-h-screen lg:grid-cols-2")} aria-label="Login page">
      <section className="flex flex-col justify-center gap-8 px-12 py-40 lg:gap-10 lg:px-40">
        <div>
          <div className="space-y-2">
            <p className="m-0 text-sm font-bold tracking-tight text-sky-blue-800">Welcome to,</p>
          </div>

          <Image src={"/logo.png"} width={150} height={64} alt="Legali Logo" priority sizes="80px" />
        </div>

        <div className="mx-auto w-full max-w-md space-y-6 lg:mx-0 lg:max-w-none">
          {/* <div className="rounded-2xl border border-sky-blue-300/40 bg-white/90 p-8 shadow-lg backdrop-blur-sm"> */}
          {/* Email/Password Login Form */}
          <EmailPasswordForm />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <ButtonClient />
          </div>
          {/* </div> */}
        </div>
      </section>
      <div className="relative hidden lg:block">
        <Image
          src="/login.png"
          fill
          alt="Legal professionals working with AI technology"
          priority
          className="object-cover"
          sizes="50vw"
        />
      </div>
    </main>
  );
}
