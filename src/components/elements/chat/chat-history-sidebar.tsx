"use client";

import { Button } from "@/components/ui/button";
import { useChatHistory } from "@/hooks/use-chat-queries";
import { Clock, MessageSquare, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface ChatHistorySidebarProps {
  currentChatId?: string | undefined;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatHistorySidebar({ currentChatId, isOpen, onClose }: ChatHistorySidebarProps) {
  const router = useRouter();

  // Use React Query for chat history - fetch once and cache
  const { data: chatHistory = [], isLoading, error, refetch } = useChatHistory();

  const handleChatClick = (chatId: string) => {
    if (chatId !== currentChatId) {
      // Navigate to the chat in the same tab
      router.push(`/agent?chat_id=${chatId}`);
    }
    onClose();
  };

  const handleNewChat = () => {
    router.push("/agent");
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
          onKeyDown={e => {
            if (e.key === "Escape") {
              onClose();
            }
          }}
          role="button"
          tabIndex={0}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-80 transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold text-gray-900">Chat History</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="h-8 w-8 p-2"
              title="Refresh chat history">
              🔄
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="border-b p-4">
          <Button onClick={handleNewChat} className="w-full justify-start" variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="flex flex-col items-center gap-2">
                <div className="size-6 animate-spin rounded-full border-2 border-sky-blue-200 border-t-sky-blue-600" />
                <p className="text-sm text-gray-500">Loading chats...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <p className="mb-2 text-sm text-red-600">Failed to fetch chat history</p>
              <p className="mb-3 text-xs text-gray-500">{error?.message || "Please try again"}</p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          ) : !chatHistory || !Array.isArray(chatHistory) ? (
            <div className="p-4 text-center">
              <MessageSquare className="mx-auto mb-2 h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-500">Invalid chat data</p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : chatHistory.length === 0 ? (
            <div className="p-4 text-center">
              <MessageSquare className="mx-auto mb-2 h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-500">No chat history yet</p>
              <p className="mt-1 text-xs text-gray-400">Start a conversation to see it here</p>
            </div>
          ) : (
            <div className="p-2">
              {chatHistory.map(chat => (
                <button
                  type="button"
                  key={chat.id}
                  onClick={() => handleChatClick(chat.id)}
                  className={`mb-1 w-full rounded-lg p-3 text-left transition-colors hover:bg-gray-50 ${
                    currentChatId === chat.id ? "border border-sky-200 bg-sky-50" : ""
                  }`}>
                  <div className="flex items-start gap-3">
                    <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {chat.session_name || "Untitled Chat"}
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <p className="text-xs text-gray-500">{formatDate(chat.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
