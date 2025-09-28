import type { Metadata } from "next";
import { AuthGuard } from "../../components/auth/auth-guard";
import Navbar from "../../components/elements/navbar";
import { QueryProvider } from "../../lib/query-client";

export const metadata: Metadata = {
  title: "Get Started - Legali",
  description: "Choose how you'd like to use Legali's AI-powered legal platform to get started.",
};

export default function OnboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <AuthGuard requireAuth={true} redirectTo="/login">
        <Navbar />
        {children}
      </AuthGuard>
    </QueryProvider>
  );
}
