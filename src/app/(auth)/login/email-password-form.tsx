"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import TermsConditionsPopup from "@/components/auth/terms-condition-popup";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type LoginFormData, loginSchema } from "@/schema/auth";

// Mock user credentials
const MOCK_USERS = [{ email: "user@legali.io", password: "user321", redirectTo: "/onboard" }];

export default function EmailPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<LoginFormData | null>(null);
  const router = useRouter();

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
    setIsLoading(true);
    setError(null);

    // Mock authentication
    const mockUser = MOCK_USERS.find(user => user.email === data.email && user.password === data.password);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (mockUser) {
      // Success - redirect to specified page
      router.push(mockUser.redirectTo);
    } else {
      setError("Invalid email or password");
    }

    setIsLoading(false);
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
              disabled={isLoading}>
              Forgot your password?
            </button>
          </div>

          <Button
            variant="black"
            type="submit"
            className="h-12 w-full rounded-xl font-semibold text-white"
            disabled={isLoading}>
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
