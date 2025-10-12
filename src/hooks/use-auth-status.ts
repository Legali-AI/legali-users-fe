"use client";

import { useEffect, useState } from "react";
import { isAuthenticated } from "@/lib/auth";

/**
 * Lightweight hook for checking authentication status only
 * Use this for components that only need to know if user is logged in
 * Does not fetch any profile data or make API calls
 */
export function useAuthStatus() {
  const [mounted, setMounted] = useState(false);
  const authenticated = mounted ? isAuthenticated() : false;

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    isAuthenticated: authenticated,
    isLoading: !mounted, // Only loading during mount
  };
}
