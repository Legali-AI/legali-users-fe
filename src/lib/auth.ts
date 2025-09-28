import Cookies from "js-cookie";

// Simple cookie management (only for tokens now)
const COOKIE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
} as const;

// User data interface (matches UserProfileDao from SDK)
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture_url?: string | null;
  city_id?: number | null;
}

// Simple cookie functions
export function setAccessToken(token: string): void {
  Cookies.set(COOKIE_KEYS.ACCESS_TOKEN, token, {
    expires: 7,
    secure: true,
    sameSite: "lax",
  });
}

export function getAccessToken(): string | undefined {
  return Cookies.get(COOKIE_KEYS.ACCESS_TOKEN);
}

export function setRefreshToken(token: string): void {
  Cookies.set(COOKIE_KEYS.REFRESH_TOKEN, token, {
    expires: 30,
    secure: true,
    sameSite: "lax",
  });
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(COOKIE_KEYS.REFRESH_TOKEN);
}

// Note: Profile management is now handled by react-query hooks
// Use useProfile(), useUpdateProfileCache(), useInvalidateProfile(), useClearProfile()
// from @/hooks/use-profile.ts instead of these functions

export function clearAuth(): void {
  // Clear tokens
  Object.values(COOKIE_KEYS).forEach(key => {
    Cookies.remove(key, { path: "/" });
  });

  // Note: Profile cache clearing is handled by react-query
  // Use useClearProfile() hook when needed
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

export function getAuthHeader(): string | null {
  const token = getAccessToken();
  return token ? `Bearer ${token}` : null;
}
