import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// API Response Types (keeping for future use if needed)
export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  email_confirmed_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface AuthSuccessResponse {
  success: true;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
  };
  timestamp?: string;
}

export interface AuthErrorField {
  field: string;
  message: string;
}

export interface AuthErrorResponse {
  success: false;
  message: string;
  errors?: AuthErrorField[];
}

export type AuthResponse = AuthSuccessResponse | AuthErrorResponse;
