import { Metadata } from "next";

export const metadata: Metadata = {
  title: "History Chats | Legali",
  description: "View and continue your previous chat conversations with our AI Legal Confidant.",
};

export default function HistoryChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

