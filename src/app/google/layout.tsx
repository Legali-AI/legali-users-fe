import type { Metadata } from "next";
import { QueryProvider } from "../../lib/query-client";

export const metadata: Metadata = {
  title: "Authentication - Legali",
  description: "Sign in to your Legali account to access your AI-powered legal platform.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <QueryProvider>{children}</QueryProvider>;
}
