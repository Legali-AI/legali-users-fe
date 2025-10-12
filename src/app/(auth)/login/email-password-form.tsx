"use client";

import TermsConditionsPopup from "@/components/auth/terms-condition-popup";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthErrorHandler, useSignIn } from "@/hooks/use-signin";
import { type LoginFormData, loginSchema } from "@/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function EmailPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<LoginFormData | null>(
    null
  );

  const formatError = useAuthErrorHandler();
  const signInMutation = useSignIn({
    onError: authError => {
      setError(formatError(authError));
    },
  });

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    if (!termsAccepted) {
      // Store form data and show terms modal
      setPendingFormData(data);
      setShowTermsPopup(true);
      return;
    }

    // Continue with actual submission
    await performLogin(data);
  };

  const performLogin = async (data: LoginFormData) => {
    setError(null);
    signInMutation.mutate(data);
  };

  const handleTermsAccept = () => {
    setTermsAccepted(true);
    setShowTermsPopup(false);
    // Continue with pending form submission
    if (pendingFormData) {
      performLogin(pendingFormData);
      setPendingFormData(null);
    }
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked - placeholder functionality");
    alert("Forgot password functionality coming soon!");
  };

  const isLoading = signInMutation.isPending;

  return (
    <div className="w-full max-w-sm space-y-6">
      {error && (
        <Alert variant="destructive">
          <p className="text-sm">{error}</p>
        </Alert>
      )}

      <TermsConditionsPopup
        open={showTermsPopup}
        onAccept={handleTermsAccept}
        onOpenChange={open => {
          setShowTermsPopup(open);
          if (!open) {
            setPendingFormData(null);
          }
        }}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email"
                    {...field}
                    disabled={isLoading}
                    className="h-12 rounded-xl border-white/30 bg-white/70 placeholder:text-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Password"
                    {...field}
                    disabled={isLoading}
                    className="h-12 rounded-xl border-white/30 bg-white/70 placeholder:text-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="cursor-pointer text-sm text-sky-900 hover:text-sky-800"
              disabled={isLoading}
            >
              Forgot your password?
            </button>
          </div>

          <Button
            variant="black"
            type="submit"
            className="h-12 w-full rounded-xl font-semibold text-white"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <span className="text-sm text-gray-600">Or continue with</span>
      </div>
    </div>
  );
}
