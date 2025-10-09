import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Support Tickets",
  description:
    "Manage your support tickets and get help with your legal matters. Track ticket status, submit new requests, and communicate with our support team.",
  keywords: [
    "support tickets",
    "customer support",
    "legal help",
    "ticket management",
    "support system",
  ],
  openGraph: {
    title: "Support Tickets",
    description:
      "Manage your support tickets and get help with your legal matters. Track ticket status, submit new requests, and communicate with our support team.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
