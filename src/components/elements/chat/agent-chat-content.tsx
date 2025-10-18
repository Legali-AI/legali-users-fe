"use client";

import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Menu, Paperclip, RefreshCw, User } from "lucide-react";
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
import { useAuthStatus } from "@/hooks/use-auth-status";
import { useChat } from "@/hooks/use-chat";
import { clearPendingMessage, getPendingMessage } from "@/lib/session-storage";
import { chatService } from "@/services/chat.service";

export function AgentChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStatus();
  const toolParam = searchParams.get("tools");
  const chatId = searchParams.get("chat_id") || undefined;
  const initialMessage = searchParams.get("message") || undefined;
  const fromHistory = searchParams.get("from") === "history";

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Drag and drop state
  const [isDragOver, setIsDragOver] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }
    };
  }, []);

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
    isSendingMessage,
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
        return "lawyers";
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
  const hasSentPendingMessage = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Check for pending message from landing page (with files)
  useEffect(() => {
    // Only check once and only for new conversations
    if (hasSentPendingMessage.current || chatId) {
      return;
    }

    const pendingMessage = getPendingMessage();
    if (pendingMessage) {
      hasSentPendingMessage.current = true;

      // Clear from sessionStorage
      clearPendingMessage();

      // Send message with files
      const { text, files } = pendingMessage;

      // Wait a bit for the chat to initialize
      setTimeout(() => {
        sendMessage(text, files);
      }, 100);
    }
  }, [chatId, sendMessage]);

  // Don't redirect - just get the conversation_id from response
  // useEffect(() => {
  //   if (currentConversationId && !chatId) {
  //     const newSearchParams = new URLSearchParams(searchParams.toString());
  //     newSearchParams.set("chat_id", currentConversationId);

  //     // Clean up initial message param after first message is sent
  //     if (newSearchParams.has("message")) {
  //       newSearchParams.delete("message");
  //     }

  //     router.replace(`/agent?${newSearchParams.toString()}`);
  //   }
  // }, [currentConversationId, chatId, searchParams, router]);

  const handleSendMessage = async (content: string, files?: File[]) => {
    if (!content.trim() && (!files || files.length === 0)) return;
    await sendMessage(content, files);
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Clear any existing timeout
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }

    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Clear any existing timeout
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }

    // Only hide overlay if we're actually leaving the container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      dragTimeoutRef.current = setTimeout(() => {
        setIsDragOver(false);
      }, 100);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);

    if (files.length > 0) {
      // Validate file sizes (5MB max per file)
      const maxSize = 5 * 1024 * 1024; // 5MB
      const validFiles = files.filter(file => {
        if (file.size > maxSize) {
          alert(`File "${file.name}" is too large. Maximum size is 5MB.`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        // Add files to dropped files state instead of auto-sending
        setDroppedFiles(prev => [...prev, ...validFiles]);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex h-screen relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}>
      {/* Chat History Sidebar - Only show if user is authenticated */}
      {isAuthenticated && (
        <ChatHistorySidebar
          currentChatId={currentConversationId}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Header */}
      <div className="fixed top-0 right-0 left-0 z-10 border-b border-sky-blue-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Back button - conditional based on fromHistory */}
            {fromHistory && isAuthenticated ? (
              <Link href="/history-chats">
                <Button variant="ghost" size="icon" className="hover:bg-sky-blue-100">
                  <ArrowLeft className="size-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/">
                <Button variant="ghost" size="icon" className="hover:bg-sky-blue-100">
                  <ArrowLeft className="size-5" />
                </Button>
              </Link>
            )}
            {/* Only show menu button if user is authenticated */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(true)}
                className="hover:bg-sky-blue-100"
                aria-label="Open chat history">
                <Menu className="size-5" />
              </Button>
            )}
            <div className="flex items-center gap-3">
              <AgentAvatar />
              <div className="flex flex-col">
                <H1 level="h3" weight="semibold" className="text-deep-navy">
                  {selectedTool
                    ? AVAILABLE_TOOLS.find(t => t.id === selectedTool)?.name || "AI Legal Confidant"
                    : currentMode === "general"
                      ? "AI Legal Confidant"
                      : AVAILABLE_TOOLS.find(t => t.id === currentMode)?.name || "AI Legal Confidant"}
                </H1>
                {(selectedTool || currentMode !== "general") && (
                  <button
                    type="button"
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
              droppedFiles={droppedFiles}
              onClearDroppedFiles={() => setDroppedFiles([])}
              isSending={isSendingMessage}
            />
          </div>
        </div>
      </div>

      {/* Drag and Drop Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-sky-blue-50/90 backdrop-blur-sm">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-sky-blue-100">
              <Paperclip className="h-10 w-10 text-sky-blue-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-sky-blue-700">Drop files here to upload</h3>
            <p className="text-sm text-sky-blue-600">Maximum 5MB per file</p>
            <p className="mt-1 text-xs text-sky-blue-500">Files will be automatically sent to the chat</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
