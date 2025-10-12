"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { setTokens } from "@/lib/auth";

import { type AuthError, signIn } from "@/services/auth.service";

interface UseSignInOptions {
  onSuccess?: () => void;
  onError?: (error: AuthError) => void;
}

export function useSignIn(options?: UseSignInOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signIn,
    onSuccess: data => {
      // Store tokens - tokens are directly in data object
      setTokens(data.access_token, data.refresh_token);

      // Note: API doesn't return user data in signin response
      // User profile will be fetched separately if needed
      // For now, we'll skip updating profile cache

      // Invalidate any cached queries that might need fresh data
      queryClient.invalidateQueries();

      // Call custom success handler if provided
      options?.onSuccess?.();

      // Redirect to onboard page
      router.push("/onboard");
    },
    onError: (error: AuthError) => {
      // Call custom error handler if provided
      options?.onError?.(error);
    },
  });
}

// Helper hook to get formatted error messages
export function useAuthErrorHandler() {
  return (error: AuthError) => {
    // Handle validation errors (400)
    if (error.statusCode === 400 && error.errors) {
      return error.errors.map(err => err.message).join(", ");
    }

    // Handle invalid credentials (401)
    if (error.statusCode === 401) {
      return "Invalid email or password";
    }

    // Default error message
    return error.message || "An error occurred during authentication";
  };
}
