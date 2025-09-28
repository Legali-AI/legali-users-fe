import type { Metadata } from "next";
import Navbar from "../../components/elements/navbar";
import { QueryProvider } from "../../lib/query-client";

export const metadata: Metadata = {
  title: "Welcome to Legali",
  description: "Complete your profile to get started with Legali's AI-powered legal platform.",
};

export default function WelcomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <Navbar />
      {children}
    </QueryProvider>
  );
}
