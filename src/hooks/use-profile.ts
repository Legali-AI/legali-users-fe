"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { HARDCODED_USERS } from "@/data/auth.data";
import type { User } from "@/lib/auth";
import { getAccessToken } from "@/lib/auth";
import { getProfileApiAuthProfileGet } from "@/sdk/sdk.gen";

// Query key for profile
export const PROFILE_QUERY_KEY = ["profile"] as const;

// Profile query function
async function fetchProfile(): Promise<User | null> {
  const token = getAccessToken();
  if (!token) throw new Error("No access token");

  // Check if this is a mock token
  try {
    const payload = JSON.parse(atob(token));
    const mockUser = HARDCODED_USERS.find(user => user.id === payload.userId);

    if (mockUser) {
      // Return mock user data directly
      return {
        id: mockUser.id,
        email: mockUser.email,
        first_name: mockUser.first_name,
        last_name: mockUser.last_name,
        profile_picture_url: mockUser.profile_picture_url || null,
        city_id: mockUser.city_id || null,
      };
    }
  } catch (error) {
    // If token parsing fails, continue with real API call
    console.error("Error parsing token:", error);
  }

  // Use real API for non-mock users
  const response = await getProfileApiAuthProfileGet({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.data?.data) {
    const profileData = response.data.data;

    return {
      id: profileData.id,
      email: profileData.email,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      profile_picture_url: profileData.profile_picture_url || null,
      city_id: profileData.city_id || null,
    };
  }

  throw new Error("No profile data received");
}

// Hook to get user profile
export function useProfile() {
  const token = getAccessToken();

  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: fetchProfile,
    enabled: !!token, // Only run if we have a token
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry if it's an auth error or no token
      if (!token || (error instanceof Error && error.message.includes("token"))) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

// Hook to update profile cache manually
export function useUpdateProfileCache() {
  const queryClient = useQueryClient();

  return (user: User) => {
    queryClient.setQueryData(PROFILE_QUERY_KEY, user);
  };
}

// Hook to invalidate profile cache
export function useInvalidateProfile() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
  };
}

// Hook to clear profile cache
export function useClearProfile() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.removeQueries({ queryKey: PROFILE_QUERY_KEY });
  };
}
