import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Submit Support Ticket",
  description:
    "Submit a support ticket to get help with your legal matters. Describe your issue, attach relevant documents, and get assistance from our support team.",
  keywords: ["support ticket", "customer support", "legal help", "ticket submission", "support request"],
  openGraph: {
    title: "Submit Support Ticket",
    description:
      "Submit a support ticket to get help with your legal matters. Describe your issue, attach relevant documents, and get assistance from our support team.",
  },
};

export default function SupportSubmitLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
