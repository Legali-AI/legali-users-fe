"use client";

import { AlertCircle, ArrowLeft, Menu, RefreshCw, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AgentAvatar } from "@/components/elements/chat/agent-avatar";
import { ChatHistorySidebar } from "@/components/elements/chat/chat-history-sidebar";
import { ChatInput } from "@/components/elements/chat/chat-input";
import { ChatMessage } from "@/components/elements/chat/chat-message";
import { AVAILABLE_TOOLS } from "@/components/elements/chat/tool-suggestion";
import type { Message, WorkflowRecommendation } from "@/components/elements/chat/types";
import { TypingIndicator } from "@/components/elements/chat/typing-indicator";
import { WorkflowRecommendations } from "@/components/elements/chat/workflow-recommendations";
import { H1 } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/use-chat-v2";
import { chatService } from "@/services/chat.service";

export function AgentChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toolParam = searchParams.get("tools");
  const chatId = searchParams.get("chat_id") || undefined;
  const initialMessage = searchParams.get("message") || undefined;

  // Debug initial message
  // console.log("🔍 Agent page - URL params:", {
  //   toolParam,
  //   chatId,
  //   initialMessage,
  //   searchParams: searchParams.toString(),
  // });

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Use the chat hook
  const {
    messages,
    isLoading,
    isTyping,
    conversationId: currentConversationId,
    workflowRecommendations,
    selectedTool,
    error,
    sendMessage,
    clearError,
    retryLastMessage,
    clearConversation,
    selectTool,
    clearSelectedTool,
  } = useChat({
    conversationId: chatId || undefined,
    toolParam,
    initialMessage: initialMessage || undefined,
  });

  const getToolIdFromParam = (param: string | null) => {
    switch (param) {
      case "redflag":
        return "red-flag-analysis";
      case "template":
        return "legal-template";
      case "lawyers":
        return "lawyers-marketplace";
      case "funding-investors":
        return "litigation-funding-investors";
      case "funding-litigants":
        return "litigation-funding-litigants";
      case "dossier":
        return "legal-dossier-builder";
      case "timeline":
        return "case-timeline-builder";
      default:
        return "general";
    }
  };

  const currentMode = getToolIdFromParam(toolParam);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update URL with chat_id when conversation ID becomes available (after first message)
  useEffect(() => {
    if (currentConversationId && !chatId) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("chat_id", currentConversationId);

      // Clean up initial message param after first message is sent
      if (newSearchParams.has("message")) {
        newSearchParams.delete("message");
      }

      router.replace(`/agent?${newSearchParams.toString()}`);
    }
  }, [currentConversationId, chatId, searchParams, router]);

  const handleSendMessage = async (content: string, files?: File[]) => {
    if (!content.trim() && (!files || files.length === 0)) return;
    await sendMessage(content, files);
  };

  return (
    <div className="flex h-screen">
      {/* Chat History Sidebar */}
      <ChatHistorySidebar
        currentChatId={currentConversationId}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Header */}
      <div className="fixed top-0 right-0 left-0 z-10 border-b border-sky-blue-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-sky-blue-100">
                <ArrowLeft className="size-5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="hover:bg-sky-blue-100"
              aria-label="Open chat history">
              <Menu className="size-5" />
            </Button>
            <div className="flex items-center gap-3">
              <AgentAvatar />
              <div className="flex flex-col">
                <H1 level="h3" weight="semibold" className="text-deep-navy">
                  {selectedTool
                    ? AVAILABLE_TOOLS.find(t => t.id === selectedTool)?.name || "AI Legal Assistant"
                    : currentMode === "general"
                      ? "AI Legal Assistant"
                      : AVAILABLE_TOOLS.find(t => t.id === currentMode)?.name || "AI Legal Assistant"}
                </H1>
                {(selectedTool || currentMode !== "general") && (
                  <button
                    onClick={() => {
                      if (selectedTool) {
                        clearSelectedTool();
                      } else {
                        const newSearchParams = new URLSearchParams();
                        if (currentConversationId) {
                          newSearchParams.set("chat_id", currentConversationId);
                        }
                        const queryString = newSearchParams.toString();
                        router.push(`/agent${queryString ? `?${queryString}` : ""}`);
                      }
                    }}
                    className="text-left text-xs text-sky-blue-600 hover:text-sky-blue-800">
                    ← Back to general chat
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clearConversation();
                router.push("/agent");
              }}
              className="hover:bg-sky-blue-50 text-xs">
              New Chat
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-sky-blue-100">
              <User className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col pt-20">
        {/* Messages Container */}
        <div ref={chatContainerRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
          {isLoading && messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="size-8 animate-spin rounded-full border-2 border-sky-blue-200 border-t-sky-blue-600" />
                <p className="text-slate-gray-600">Loading conversation...</p>
              </div>
            </div>
          ) : (
            (() => {
              // Create unified timeline of messages and recommendations
              const timeline: Array<{
                timestamp: Date;
                content:
                  | { type: "message"; data: Message }
                  | { type: "recommendations"; data: WorkflowRecommendation[] };
              }> = [];

              // Add all messages to timeline
              messages.forEach(message => {
                // console.log("🔍 Message timestamp:", message);
                timeline.push({
                  timestamp: message.timestamp,
                  content: {
                    type: "message",
                    data: message,
                  },
                });
              });

              // Add workflow recommendations to timeline (if any)
              if (workflowRecommendations.length > 0) {
                const recTimestamp = workflowRecommendations[0]?.timestamp;
                if (recTimestamp) {
                  timeline.push({
                    timestamp: recTimestamp,
                    content: {
                      type: "recommendations",
                      data: workflowRecommendations,
                    },
                  });
                }
              }

              // Sort timeline by timestamp
              timeline.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

              return timeline.map((item, index) => {
                // console.log("item:", item);
                if (item.content.type === "message") {
                  return <ChatMessage key={item.content.data.id} message={item.content.data} />;
                } else {
                  return (
                    <div key={`recommendations-${index}`} className="space-y-4">
                      <div className="flex items-start gap-3">
                        <AgentAvatar size="sm" />
                        <WorkflowRecommendations
                          recommendations={item.content.data}
                          selectedTool={selectedTool}
                          disableNavigation={true}
                          onRecommendationClick={(recommendation: WorkflowRecommendation) => {
                            const toolId = chatService.getToolIdFromActionType(recommendation.action_type);

                            if (toolId) {
                              selectTool(toolId);
                            } else {
                              console.warn("No valid tool ID found for action_type:", recommendation.action_type);
                            }
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              });
            })()
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3">
              <AgentAvatar size="sm" />
              <div className="flex-1 rounded-2xl rounded-tl-md border border-red-200 bg-red-50 px-4 py-3">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="size-4" />
                  <span className="text-sm font-medium">Error</span>
                </div>
                <p className="mt-1 text-sm text-red-600">{error}</p>
                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={retryLastMessage}
                    className="border-red-300 text-red-700 hover:bg-red-100">
                    <RefreshCw className="mr-1 size-3" />
                    Retry
                  </Button>
                  <Button size="sm" variant="ghost" onClick={clearError} className="text-red-700 hover:bg-red-100">
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          )}

          <TypingIndicator isTyping={isTyping} showTimer={true} />

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="border-t border-sky-blue-200 bg-white/95 backdrop-blur-sm">
          <div className="px-4 py-4">
            <ChatInput
              onSendMessage={handleSendMessage}
              placeholder="Upload your documents, share your concerns, or simply ask a question—we'll take it from there"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
