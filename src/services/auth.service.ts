import { apiClient } from "@/lib/api-client";
import { API_CONFIG } from "@/lib/config";
import type {
  AuthResponse,
  AuthSuccessResponse,
  LoginFormData,
} from "@/schema/auth";

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Sign in user with email and password
 */
export async function signIn(
  credentials: LoginFormData
): Promise<AuthSuccessResponse["data"]> {
  try {
    const response = await apiClient.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.SIGNIN,
      credentials
    );

    const data = response.data;

    if (!data.success) {
      throw new AuthError(data.message, response.status, data.errors);
    }

    return data.data;
  } catch (error: any) {
    // Handle different types of errors
    if (error instanceof AuthError) {
      throw error;
    }

    // Network or other errors
    if (error.response) {
      const responseData = error.response.data;
      throw new AuthError(
        responseData?.message || "Authentication failed",
        error.response.status,
        responseData?.errors
      );
    }

    // Network errors
    if (error.request) {
      throw new AuthError("Network error. Please check your connection.");
    }

    // Other errors
    throw new AuthError("An unexpected error occurred");
  }
}

/**
 * Sign out user (for future implementation)
 */
export async function signOut(): Promise<void> {
  try {
    await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.SIGNOUT);
  } catch (error) {
    // Even if signout fails on server, we should clear local tokens
    console.warn("Signout request failed:", error);
  }
}

/**
 * Refresh access token (for future implementation)
 */
export async function refreshToken(
  refreshToken: string
): Promise<AuthSuccessResponse["data"]> {
  try {
    const response = await apiClient.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REFRESH,
      { refresh_token: refreshToken }
    );

    const data = response.data;

    if (!data.success) {
      throw new AuthError(data.message);
    }

    return data.data;
  } catch (error: any) {
    if (error instanceof AuthError) {
      throw error;
    }

    throw new AuthError("Token refresh failed");
  }
}
