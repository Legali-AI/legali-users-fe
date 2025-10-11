import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent Chat - Legali",
  description: "Chat with your AI legal assistant",
};

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return <div className="to-sky-blue-50 min-h-screen bg-gradient-to-br from-sky-blue-100 via-white">{children}</div>;
}
