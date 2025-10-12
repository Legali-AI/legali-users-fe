"use client";

/**
 * Authentication Hooks Guide:
 *
 * 1. useAuthStatus() - Lightweight auth status check only
 *    - Use in: Navbar, route guards, conditional rendering
 *    - Performance: No API calls, just token validation
 *    - Returns: { isAuthenticated, isLoading }
 *
 * 2. useAuth() - Basic auth operations without profile
 *    - Use in: Login/logout components, basic auth management
 *    - Performance: No profile API calls
 *    - Returns: { isAuthenticated, login, logout, refreshToken }
 *
 * 3. useAuthWithProfile() - Full auth + profile data
 *    - Use in: Profile pages, user settings, when you need user data
 *    - Performance: Makes profile API calls when authenticated
 *    - Returns: { isAuthenticated, user, login, logout, refreshToken }
 *
 * 4. useProfile() - Direct profile data access
 *    - Use in: Components that only need profile data
 *    - Performance: Can be disabled with { enabled: false }
 *    - Returns: React Query result with user profile
 */

import { useCallback, useEffect, useState } from "react";
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
import { useClearProfile, useProfile, useUpdateProfileCache } from "./use-profile";

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
      user?: User; // Make user optional since we're not using it
    }) => {
      setAccessToken(authData.access_token);
      if (authData.refresh_token) {
        setRefreshToken(authData.refresh_token);
      }
      // Note: Profile cache update removed from basic auth hook
      // Use useAuthWithProfile hook if you need profile management
    },
    []
  );

  const logout = useCallback(
    async (onSuccess?: () => void) => {
      try {
        // Note: Logout API not implemented yet
        // const { signOut } = require("@/services/auth.service");
        // await signOut();
      } catch (error) {
        console.error("Logout API call failed:", error);
      } finally {
        // Clear all authentication data
        clearAuth();
        clearProfile();

        // Execute success callback (e.g., navigation)
        if (onSuccess) {
          onSuccess();
        }
      }
    },
    [clearProfile]
  );

  return {
    isAuthenticated: authenticated,
    user: null, // Basic auth hook doesn't provide user data
    isLoading,
    login,
    logout,
    refreshToken,
  };
}

/**
 * Enhanced auth hook that includes profile data fetching
 * Use this when you actually need user profile information
 */
export function useAuthWithProfile() {
  const basicAuth = useAuth();
  const { data: user, isLoading: profileLoading } = useProfile();
  const updateProfileCache = useUpdateProfileCache();

  const loginWithProfile = useCallback(
    (authData: { access_token: string; refresh_token?: string; user: User }) => {
      basicAuth.login(authData);
      updateProfileCache(authData.user);
    },
    [basicAuth, updateProfileCache]
  );

  return {
    ...basicAuth,
    user: basicAuth.isAuthenticated ? user : null,
    isLoading: basicAuth.isAuthenticated && profileLoading,
    login: loginWithProfile,
  };
}
