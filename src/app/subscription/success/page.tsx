"use client";

import { ArrowRight, CheckCircle, Home, Settings } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { H1, H3, P, Small } from "../../../components/elements/typography";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { QueryProvider } from "../../../lib/query-client";

interface SubscriptionSuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

function validateSessionId(sessionId: string | undefined): boolean {
  if (!sessionId) return false;
  return sessionId.startsWith("cs_");
}

function SubscriptionSuccessContent({
  sessionId,
}: {
  sessionId: string | undefined;
}) {
  return (
    <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-sky-blue-200 px-8 py-20 sm:px-10 md:px-16 lg:px-32">
      {/* Background decorations */}
      <div
        className="absolute -top-[100px] -left-[200px] -z-10 aspect-[3/2] w-[700px] rotate-45"
        style={{
          borderRadius: "686.309px",
          background: "linear-gradient(90deg, #E5F8FF 0%, #9BDBF3 100%)",
          filter: "blur(43.400001525878906px)",
        }}
      />
      <div
        className="absolute -right-[200px] -bottom-[100px] -z-10 aspect-[3/2] w-[700px] rotate-45"
        style={{
          borderRadius: "686.309px",
          background: "linear-gradient(90deg, #E5F8FF 0%, #9BDBF3 100%)",
          filter: "blur(43.400001525878906px)",
        }}
      />

      <div className="w-full max-w-xl">
        <Card className="border-0 bg-white/80 shadow-2xl backdrop-blur-sm">
          <CardHeader className="items-center pb-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-emerald-green-100 p-4">
                <CheckCircle className="h-8 w-8 text-emerald-green-400" />
              </div>
            </div>
            <CardTitle className="mb-2">
              <H1
                level={"h3"}
                weight="bold"
                className="text-deep-navy-400"
                align={"center"}
              >
                Congratulations!
              </H1>
            </CardTitle>
            <CardDescription>
              <P level="title" className="text-slate-gray-400" align={"center"}>
                Your subscription has been successfully activated
              </P>
            </CardDescription>
          </CardHeader>

          <CardContent className="-mt-7 space-y-2 md:space-y-3 lg:space-y-4">
            <div className="text-center">
              <P
                level="body"
                className="mb-4 text-slate-gray-400"
                align={"center"}
              >
                Welcome to Legali! You now have access to our premium features
                and can start using our legal services platform.
              </P>

              {sessionId && (
                <div className="mb-6 rounded-lg bg-white-100 p-4">
                  <Small
                    level="label"
                    className="mb-2 text-slate-gray-400"
                    align={"center"}
                  >
                    Session ID:
                  </Small>
                  <P
                    level="label"
                    className="font-mono break-all text-deep-navy-400"
                    align={"center"}
                  >
                    {sessionId}
                  </P>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-sky-blue-400 to-sky-blue-200 py-3 font-medium text-deep-navy-400 hover:opacity-90"
                size="lg"
              >
                <Link href="/profile">
                  <H3
                    level="body"
                    weight="semibold"
                    className="text-deep-navy-400"
                    align={"center"}
                  >
                    Go to Dashboard
                  </H3>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full border-sky-blue-200 py-3 font-medium text-sky-blue-400 hover:bg-sky-blue-100"
                size="lg"
              >
                <Link href="/profile">
                  <Settings className="mr-2 h-4 w-4" />
                  <H3
                    level="body"
                    weight="semibold"
                    className="text-sky-blue-400"
                    align={"center"}
                  >
                    Manage Subscription
                  </H3>
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className="w-full py-3 font-medium text-slate-gray-400 hover:text-deep-navy-400"
                size="lg"
              >
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  <H3
                    level="body"
                    weight="semibold"
                    className="text-slate-gray-400"
                    align={"center"}
                  >
                    Back to Home
                  </H3>
                </Link>
              </Button>
            </div>

            <div className="border-t border-white-400 pt-4 text-center">
              <Small level="label" className="text-slate-gray-400">
                Need help? Contact our support team for assistance.
              </Small>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function LoadingFallback() {
  return (
    <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-sky-blue-200 px-8 py-20 sm:px-10 md:px-16 lg:px-32">
      <div className="w-full max-w-2xl">
        <Card className="border-0 bg-white/80 shadow-2xl backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-sky-blue-300 border-t-sky-blue-400"></div>
            <P level="body" className="text-slate-gray-400">
              Validating subscription...
            </P>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function SubscriptionSuccessPageContent({
  searchParams,
}: SubscriptionSuccessPageProps) {
  const resolvedParams = React.use(searchParams);
  const sessionId = resolvedParams.session_id;

  // Validate session ID and throw notFound if invalid
  if (!validateSessionId(sessionId)) {
    notFound();
  }

  return <SubscriptionSuccessContent sessionId={sessionId} />;
}

export default function SubscriptionSuccessPage({
  searchParams,
}: SubscriptionSuccessPageProps) {
  return (
    <QueryProvider ignoreDevtools>
      <Suspense fallback={<LoadingFallback />}>
        <SubscriptionSuccessPageContent searchParams={searchParams} />
      </Suspense>
    </QueryProvider>
  );
}
