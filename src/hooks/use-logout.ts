"use client";

import { useRouter } from "next/navigation";
import { useClearProfile } from "@/hooks/use-profile";
import { clearAuth } from "@/lib/auth";

export function useLogout() {
  const router = useRouter();
  const clearProfile = useClearProfile();

  const logout = () => {
    // Clear authentication data
    clearAuth();

    // Clear profile cache
    clearProfile();

    // Redirect to login page
    router.push("/login");
  };

  return { logout };
}
