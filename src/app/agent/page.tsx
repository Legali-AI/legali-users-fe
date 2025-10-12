"use client";

import { Suspense } from "react";
import { AgentChatContent } from "@/components/elements/chat/agent-chat-content";

// Loading component for Suspense fallback
function AgentChatLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="size-8 animate-spin rounded-full border-2 border-sky-blue-200 border-t-sky-blue-600" />
        <p className="text-slate-gray-600">Loading AI Legal Assistant...</p>
      </div>
    </div>
  );
}

export default function AgentChatPage() {
  return (
    <Suspense fallback={<AgentChatLoading />}>
      <AgentChatContent />
    </Suspense>
  );
}
