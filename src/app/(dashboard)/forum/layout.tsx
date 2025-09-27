import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forum & Community",
  description:
    "Join our legal community forum to discuss issues, share experiences, and get help from other users. Connect with peers and explore common legal challenges.",
  keywords: [
    "legal forum",
    "community",
    "legal discussion",
    "peer support",
    "legal issues",
    "user community",
    "legal help",
    "discussion board",
  ],
  openGraph: {
    title: "Forum & Community",
    description:
      "Join our legal community forum to discuss issues, share experiences, and get help from other users. Connect with peers and explore common legal challenges.",
  },
};

export default function ForumLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
