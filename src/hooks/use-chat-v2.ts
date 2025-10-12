import type {
  Message,
  WorkflowRecommendation,
} from "@/components/elements/chat/types";
import { chatService } from "@/services/chat.service";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useChatMessages, useSendMessage } from "./use-chat-queries";

export interface UseChatOptions {
  conversationId?: string | undefined;
  toolParam?: string | null | undefined;
  initialMessage?: string | undefined;
}

export function useChat({
  conversationId: initialConversationId,
  toolParam,
  initialMessage,
}: UseChatOptions) {
  const router = useRouter();

  // State
  const [conversationId, setConversationId] = useState<string | undefined>(
    initialConversationId
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [workflowRecommendations, setWorkflowRecommendations] = useState<
    WorkflowRecommendation[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(
    toolParam || null
  );

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasProcessedInitialMessage = useRef(false);

  // React Query hooks
  const {
    data: queryMessages = [],
    isLoading,
    error: messagesError,
    refetch: refetchMessages,
  } = useChatMessages(conversationId);

  const sendMessageMutation = useSendMessage();

  console.log("💾 Initializing conversation:", {
    fromURL: initialConversationId,
    hasInitialMessage: !!initialMessage,
    final: conversationId,
  });

  // Initialize messages - either from query or welcome message
  useEffect(() => {
    if (conversationId && initialConversationId) {
      // For existing conversations, use messages from React Query
      setMessages(queryMessages);
    } else if (!conversationId && messages.length === 0) {
      // For new chats, show welcome message
      const welcomeMessages: Message[] = [
        {
          id: "welcome",
          content:
            "👋 Hello! I'm your AI legal assistant. I can help you analyze contracts, answer legal questions, and identify potential issues in documents. What would you like help with today?",
          isUser: false,
          timestamp: new Date(),
        },
      ];
      setMessages(welcomeMessages);
    }
  }, [conversationId, initialConversationId, queryMessages, messages.length]);

  // Handle initial message from main page (Option B: Show welcome briefly, then send)
  useEffect(() => {
    if (
      initialMessage &&
      !hasProcessedInitialMessage.current &&
      !conversationId && // Only for new chats
      messages.length > 0 && // After welcome message is shown
      !isLoading &&
      !isTyping
    ) {
      hasProcessedInitialMessage.current = true;

      // Brief delay to show welcome message (200ms as discussed)
      const timer = setTimeout(() => {
        console.log(
          "🚀 Sending initial message from main page:",
          initialMessage
        );
        handleSendMessage(initialMessage);
      }, 200);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [initialMessage, conversationId, messages.length, isLoading, isTyping]);

  // Update messages when React Query data changes
  useEffect(() => {
    if (conversationId && queryMessages.length > 0) {
      setMessages(queryMessages);
    }
  }, [conversationId, queryMessages]);

  // Handle messages error
  useEffect(() => {
    if (messagesError) {
      setError(messagesError.message);
    }
  }, [messagesError]);

  const handleSendMessage = async (content: string, files?: File[]) => {
    if (!content.trim() && (!files || files.length === 0)) return;

    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    // IMMEDIATELY add user message to UI (optimistic update)
    const userMessage: Message = {
      id: `temp-user-${Date.now()}`,
      content,
      isUser: true,
      timestamp: new Date(),
      attachments: files || undefined,
    };

    // Add user message immediately to messages array
    setMessages(prevMessages => [...prevMessages, userMessage]);

    setIsTyping(true);
    setError(null);

    try {
      const result = await sendMessageMutation.mutateAsync({
        message: content,
        ...(files && { files }),
        ...(conversationId && { conversationId }),
        ...(selectedTool && { toolParam: selectedTool }),
      });

      // Update conversation ID if this was a new conversation
      if (!conversationId && result.data?.conversation_id) {
        setConversationId(result.data.conversation_id);

        // Update URL with new chat_id
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("chat_id", result.data.conversation_id);

        // Remove initial message param after first message
        if (currentUrl.searchParams.has("message")) {
          currentUrl.searchParams.delete("message");
        }

        router.replace(currentUrl.pathname + currentUrl.search);
      }

      // Replace temporary user message with real data and add AI response
      setMessages(prevMessages => {
        // Remove the temporary user message
        const messagesWithoutTemp = prevMessages.filter(
          msg => msg.id !== userMessage.id
        );

        // Create real user message
        const realUserMessage: Message = {
          id: `user-${Date.now()}`,
          content,
          isUser: true,
          timestamp: new Date(),
          attachments: files || undefined,
          conversation_id: result.data?.conversation_id,
        };

        // Create AI response message
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          content: result.data?.output || "",
          isUser: false,
          timestamp: new Date(),
          conversation_id: result.data?.conversation_id,
        };

        return [...messagesWithoutTemp, realUserMessage, aiMessage];
      });

      // Handle workflow recommendations - filter by supported action types
      if (result.data?.workflow_recommendations) {
        const supportedRecommendations =
          result.data.workflow_recommendations.filter(
            (rec: WorkflowRecommendation) => {
              const isSupported = chatService.isSupportedActionType(
                rec.action_type
              );
              if (!isSupported) {
                console.log(
                  "🚫 Filtering out unsupported recommendation:",
                  rec.action_type,
                  rec.title
                );
              }
              return isSupported;
            }
          );

        const uniqueRecommendations = supportedRecommendations.filter(
          (
            rec: WorkflowRecommendation,
            index: number,
            self: WorkflowRecommendation[]
          ) =>
            self.findIndex(
              r => r.title === rec.title && r.action_type === rec.action_type
            ) === index
        );

        console.log(
          "✅ Showing supported recommendations:",
          uniqueRecommendations
        );
        setWorkflowRecommendations(uniqueRecommendations);
      }
    } catch (err: any) {
      console.error("Failed to send message:", err);

      // Remove the temporary user message on error
      setMessages(prevMessages =>
        prevMessages.filter(msg => msg.id !== userMessage.id)
      );

      setError(err.message || "Failed to send message");
    } finally {
      setIsTyping(false);
    }
  };

  const retryLastMessage = async () => {
    const lastUserMessage = messages
      .slice()
      .reverse()
      .find(msg => msg.isUser);

    if (lastUserMessage) {
      await handleSendMessage(
        lastUserMessage.content,
        lastUserMessage.attachments
      );
    }
  };

  const clearError = () => {
    setError(null);
  };

  const clearConversation = () => {
    setMessages([]);
    setConversationId(undefined);
    setWorkflowRecommendations([]);
    setError(null);
    setIsTyping(false);
    setSelectedTool(null);
    hasProcessedInitialMessage.current = false;

    // Add welcome message for new conversation
    const welcomeMessages: Message[] = [
      {
        id: "welcome",
        content:
          "👋 Hello! I'm your AI legal assistant. I can help you analyze contracts, answer legal questions, and identify potential issues in documents. What would you like help with today?",
        isUser: false,
        timestamp: new Date(),
      },
    ];
    setMessages(welcomeMessages);
  };

  const selectTool = (toolId: string) => {
    setSelectedTool(toolId);
  };

  const clearSelectedTool = () => {
    setSelectedTool(null);
  };

  return {
    messages,
    isLoading,
    isTyping,
    conversationId,
    workflowRecommendations,
    selectedTool,
    error,
    sendMessage: handleSendMessage,
    retryLastMessage,
    clearError,
    clearConversation,
    refetchMessages,
    selectTool,
    clearSelectedTool,
  };
}
