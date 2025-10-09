"use client";

import {
  clearAuth,
  getRefreshToken,
  isAuthenticated,
  setAccessToken,
  setRefreshToken,
  type User,
} from "@/lib/auth";
import {
  logoutApiAuthLogoutPost,
  refreshTokenApiAuthRefreshPost,
} from "@/sdk/out/sdk.gen";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { PROFILE_QUERY_KEY, useProfileQuery } from "./use-profile";

export function useAuth() {
  const authenticated = isAuthenticated();
  const queryClient = useQueryClient();
  const { data: profileResponse, isLoading: profileLoading } =
    useProfileQuery();
  const user = profileResponse?.data ?? null;

  const clearProfile = useCallback(() => {
    queryClient.removeQueries({ queryKey: PROFILE_QUERY_KEY });
  }, [queryClient]);

  const isLoading = profileLoading;

  const refreshToken = useCallback(async () => {
    const refreshTokenValue = getRefreshToken();
    if (!refreshTokenValue) return false;

    try {
      const response = await refreshTokenApiAuthRefreshPost({
        body: { refresh_token: refreshTokenValue },
      });

      if (response.data?.data?.access_token) {
        setAccessToken(response.data.data.access_token);
        if (response.data.data.refresh_token) {
          setRefreshToken(response.data.data.refresh_token);
        }
        return true;
      }
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
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
    [queryClient]
  );

  const logout = useCallback(async () => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await logoutApiAuthLogoutPost({
          body: { refresh_token: refreshToken },
        });
      }
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
