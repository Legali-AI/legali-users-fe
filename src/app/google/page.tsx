"use client";

import { Typography } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const TOAST_MESSAGE = {
  loading: {
    title: "Processing your Google authentication...",
    description: "Please wait while we process your Google authentication...",
  },
  success: {
    title: "Successfully authenticated with Google!",
    description: "Redirecting you to complete your profile...",
  },
  error: {
    title: "Authentication failed.",
    description: "Please try again.",
  },
};

function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const hasProcessed = useRef(false);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      if (hasProcessed.current) {
        return;
      }
      hasProcessed.current = true;

      try {
        const state = searchParams.get("state");

        if (state === "error") {
          const errorMessage = searchParams.get("error");
          setStatus("error");
          toast.error(TOAST_MESSAGE.error.title, {
            description: errorMessage || TOAST_MESSAGE.error.description,
          });
          return;
        }

        if (state === "success") {
          const access_token = searchParams.get("access_token");
          const refresh_token = searchParams.get("refresh_token");
          const is_new = searchParams.get("is_new")?.toLowerCase() === "true";

          if (!access_token || !refresh_token) {
            throw new Error("Authentication tokens not found");
          }

          toast.success(TOAST_MESSAGE.success.title, {
            description: TOAST_MESSAGE.success.description,
          });

          login({
            access_token,
            refresh_token,
            user: {
              id: "",
              email: "",
              first_name: "",
              last_name: "",
              profile_picture_url: null,
              city_id: null,
            },
          });

          setStatus("success");

          setTimeout(() => {
            if (is_new) {
              router.push("/welcome");
            } else {
              router.push("/profile");
            }
          }, 1000);
        } else {
          toast.error(TOAST_MESSAGE.error.title, {
            description: "Invalid state parameter",
          });
          throw new Error("Invalid state parameter");
        }
      } catch (error) {
        toast.error(TOAST_MESSAGE.error.title, {
          description:
            error instanceof Error
              ? error.message
              : TOAST_MESSAGE.error.description,
        });
        setStatus("error");
      }
    };

    handleGoogleCallback();
  }, [searchParams, router, login]);

  const handleRetry = () => {
    router.push("/login");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Typography level="h4" weight="semibold">
              Google Authentication
            </Typography>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center gap-4">
              <Typography level="body" className="text-gray-600">
                {TOAST_MESSAGE.loading.description}
              </Typography>
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center justify-center gap-4">
              <Typography level="body" className="text-green-600">
                {TOAST_MESSAGE.success.title}
              </Typography>
              <Typography level="body" className="text-gray-600">
                {TOAST_MESSAGE.success.description}
              </Typography>
              <div className="flex justify-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center justify-center gap-4">
              <Typography level="body" className="text-red-600">
                {TOAST_MESSAGE.error.title}
              </Typography>
              <div className="flex justify-center">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={handleRetry}>
                  Try Again
                </Button>
                <Button onClick={handleGoHome}>Go Home</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Typography level="h4" weight="semibold">
                  Google Authentication
                </Typography>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center gap-4">
                <Typography level="body" className="text-gray-600">
                  Loading...
                </Typography>
                <div className="flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
