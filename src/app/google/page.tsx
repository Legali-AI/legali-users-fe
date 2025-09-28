"use client";

import { AxiosError } from "axios";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Typography } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { googleLoginApiAuthGoogleCallbackPost } from "@/sdk/sdk.gen";

function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const hasProcessed = useRef(false);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      // Prevent duplicate calls in React Strict Mode
      if (hasProcessed.current) {
        return;
      }
      hasProcessed.current = true;

      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        if (!code) {
          throw new Error("Authorization code not found");
        }

        const response = await googleLoginApiAuthGoogleCallbackPost({
          body: { code, state: state || "" },
        });

        if (response.data?.data) {
          const { access_token, refresh_token, user, is_new } = response.data.data;

          login({
            access_token,
            refresh_token,
            user: {
              id: user.id,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              profile_picture_url: user.profile_picture_url || null,
              city_id: user.city_id || null,
            },
          });

          setStatus("success");
          setMessage("Successfully authenticated with Google!");

          setTimeout(() => {
            if (is_new) {
              router.push("/welcome");
            } else {
              router.push("/profile");
            }
          }, 1000);
        } else if (response.error) {
          throw new Error(response.error?.message || "Authentication failed");
        }
      } catch (error) {
        console.error("Google callback error:", error);
        setStatus("error");
        setMessage(
          error instanceof AxiosError
            ? error.response?.data?.message || "Authentication failed"
            : "Authentication failed"
        );
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
                Processing your Google authentication...
              </Typography>
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center justify-center gap-4">
              <Typography level="body" className="text-green-600">
                {message}
              </Typography>
              <Typography level="body" className="text-gray-600">
                Redirecting you to complete your profile...
              </Typography>
              <div className="flex justify-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center justify-center gap-4">
              <Typography level="body" className="text-red-600">
                {message}
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
      }>
      <GoogleCallbackContent />
    </Suspense>
  );
}
