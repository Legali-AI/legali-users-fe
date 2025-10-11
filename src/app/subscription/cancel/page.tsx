"use client";

import { ArrowLeft, Home, RefreshCw, XCircle } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
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
import { useSubscriptionMutation } from "../../../hooks/use-subscription";
import { QueryProvider } from "../../../lib/query-client";

interface SubscriptionCancelPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

function validateSessionId(sessionId: string | undefined): boolean {
  if (!sessionId) return false;
  // Basic validation for session ID format (Stripe session IDs start with cs_)
  return sessionId.startsWith("cs_");
}

function SubscriptionCancelContent({
  sessionId,
}: {
  sessionId: string | undefined;
}) {
  const router = useRouter();

  const { cancelWithToast, isCancelling } = useSubscriptionMutation({
    onSuccess: () => {
      router.push("/pricing");
    },
  });

  const handleCancelSubscription = async () => {
    if (!sessionId) return;
    await cancelWithToast(sessionId);
  };
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
              <div className="rounded-full bg-error-100 p-4">
                <XCircle className="h-8 w-8 text-error-400" />
              </div>
            </div>
            <CardTitle className="mb-2">
              <H1
                level={"h3"}
                weight="bold"
                className="text-deep-navy-400"
                align={"center"}
              >
                Subscription Cancelled
              </H1>
            </CardTitle>
            <CardDescription>
              <P level="title" className="text-slate-gray-400" align={"center"}>
                Your subscription process was cancelled
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
                No worries! You can always return to our pricing page to
                subscribe to a plan when you're ready. Your account remains
                active and you can continue using our free features.
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
                onClick={handleCancelSubscription}
                disabled={isCancelling}
                className="w-full bg-gradient-to-r from-sky-blue-400 to-sky-blue-200 py-3 font-medium text-deep-navy-400 hover:opacity-90 disabled:opacity-50"
                size="lg"
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${isCancelling ? "animate-spin" : ""}`}
                />
                <H3
                  level="body"
                  weight="semibold"
                  className="text-deep-navy-400"
                  align={"center"}
                >
                  {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
                </H3>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full border-sky-blue-200 py-3 font-medium text-sky-blue-400 hover:bg-sky-blue-100"
                size="lg"
              >
                <Link href="/pricing">
                  <H3
                    level="body"
                    weight="semibold"
                    className="text-sky-blue-400"
                    align={"center"}
                  >
                    Try Again
                  </H3>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full border-sky-blue-200 py-3 font-medium text-sky-blue-400 hover:bg-sky-blue-100"
                size="lg"
              >
                <Link href="/profile">
                  <H3
                    level="body"
                    weight="semibold"
                    className="text-sky-blue-400"
                    align={"center"}
                  >
                    Go to Dashboard
                  </H3>
                  <ArrowLeft className="ml-2 h-4 w-4" />
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

function SubscriptionCancelPageContent({
  searchParams,
}: SubscriptionCancelPageProps) {
  const resolvedParams = React.use(searchParams);
  const sessionId = resolvedParams.session_id;

  if (!validateSessionId(sessionId)) {
    notFound();
  }

  return <SubscriptionCancelContent sessionId={sessionId} />;
}

export default function SubscriptionCancelPage({
  searchParams,
}: SubscriptionCancelPageProps) {
  return (
    <QueryProvider ignoreDevtools>
      <Suspense fallback={<LoadingFallback />}>
        <SubscriptionCancelPageContent searchParams={searchParams} />
      </Suspense>
    </QueryProvider>
  );
}
