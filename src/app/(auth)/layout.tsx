import type { Metadata } from "next";
import { AOSInit } from "../../aos";
import Navbar from "../../components/elements/navbar";
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
  return (
    <QueryProvider>
      <AOSInit />
      {/* <AuthGuard requireAuth={false} redirectTo="/profile"> */}
      <Navbar />
      {children}
      {/* </AuthGuard> */}
    </QueryProvider>
  );
}
