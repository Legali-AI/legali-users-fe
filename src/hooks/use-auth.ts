"use client";

import {
  clearAuth,
  getAccessToken,
  getRefreshToken,
  isAuthenticated,
  setAccessToken,
  setRefreshToken,
  type User,
} from "@/lib/auth";
import { refreshToken as refreshTokenService } from "@/services/auth.service";
import { useCallback, useEffect, useState } from "react";
import {
  useClearProfile,
  useProfile,
  useUpdateProfileCache,
} from "./use-profile";

export function useAuth() {
  const [mounted, setMounted] = useState(false);
  const authenticated = mounted ? isAuthenticated() : false;
  const clearProfile = useClearProfile();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Debug logging
  useEffect(() => {
    if (mounted) {
      console.log("Auth Debug:", {
        authenticated,
        hasToken: !!getAccessToken(),
        tokenValue: getAccessToken()?.substring(0, 20) + "...",
      });
    }
  }, [mounted, authenticated]);

  // Basic auth doesn't need loading state from profile
  const isLoading = false;

  const refreshToken = useCallback(async () => {
    const refreshTokenValue = getRefreshToken();
    if (!refreshTokenValue) return false;

    try {
      const tokens = await refreshTokenService(refreshTokenValue);
      setAccessToken(tokens.access_token);
      if (tokens.refresh_token) {
        setRefreshToken(tokens.refresh_token);
      }
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      clearAuth();
      clearProfile();
    }
    return false;
  }, [clearProfile]);

  const login = useCallback(
    (authData: {
      access_token: string;
      refresh_token?: string;
      user: User;
    }) => {
      setAccessToken(authData.access_token);
      if (authData.refresh_token) {
        setRefreshToken(authData.refresh_token);
      }
      updateProfileCache(authData.user);
    },
    [updateProfileCache]
  );

  const logout = useCallback(async () => {
    try {
      // Note: Logout API not implemented yet
      // const { signOut } = require("@/services/auth.service");
      // await signOut();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      clearAuth();
      clearProfile();
    }
  }, [clearProfile]);

  return {
    isAuthenticated: authenticated,
    user: authenticated ? user : null,
    isLoading,
    login,
    logout,
    refreshToken,
  };
}
