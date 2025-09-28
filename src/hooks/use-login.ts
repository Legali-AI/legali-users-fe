"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authenticateUser, generateMockToken } from "@/data/auth.data";
import { useUpdateProfileCache } from "@/hooks/use-profile";
import { setAccessToken } from "@/lib/auth";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const updateProfileCache = useUpdateProfileCache();

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError("");

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Authenticate user with hardcoded data
      const user = authenticateUser(email, password);

      if (!user) {
        setError("Invalid email or password");
        return { success: false };
      }

      // Generate mock token and store it
      const token = generateMockToken(user);
      setAccessToken(token);

      // Update profile cache with user data
      updateProfileCache({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_picture_url: user.profile_picture_url || null,
        city_id: user.city_id || null,
      });

      // Redirect to onboarding page
      router.push("/onboard");

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
    clearError: () => setError(""),
  };
}
