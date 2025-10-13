import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Message, WorkflowRecommendation } from "@/components/elements/chat/types";
import { chatService } from "@/services/chat.service";
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
  const [conversationId, setConversationId] = useState<string | undefined>(initialConversationId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [workflowRecommendations, setWorkflowRecommendations] = useState<WorkflowRecommendation[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(toolParam || null);

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasProcessedInitialMessage = useRef(false);
  const hasInitializedFromQuery = useRef(false);

  // React Query hooks
  const {
    data: queryMessages = [],
    isLoading,
    error: messagesError,
    refetch: refetchMessages,
  } = useChatMessages(conversationId);

  const sendMessageMutation = useSendMessage();

  // localStorage helper functions for selectedTool persistence
  const getStoredSelectedTool = (chatId: string): string | null => {
    try {
      const key = `selectedTool_${chatId}`;
      return localStorage.getItem(key);
    } catch (error) {
      console.warn("Failed to get stored selected tool:", error);
      return null;
    }
  };

  const storeSelectedTool = (chatId: string, toolId: string | null) => {
    try {
      const key = `selectedTool_${chatId}`;
      if (toolId) {
        localStorage.setItem(key, toolId);
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn("Failed to store selected tool:", error);
    }
  };

  const cleanupOldStoredTools = () => {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith("selectedTool_"));

      // Keep only the last 50 stored tools to prevent localStorage bloat
      if (keys.length > 50) {
        const keysToRemove = keys.slice(0, keys.length - 50);
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
        });
      }
    } catch (error) {
      console.warn("Failed to cleanup old stored tools:", error);
    }
  };

  // console.log("💾 Initializing conversation:", {
  //   fromURL: initialConversationId,
  //   hasInitialMessage: !!initialMessage,
  //   final: conversationId,
  //   currentSelectedTool: selectedTool,
  // });

  // Cleanup old stored tools on initialization
  useEffect(() => {
    cleanupOldStoredTools();

    // Debug: Show currently stored tools
    // const storedTools = Object.keys(localStorage)
    //   .filter(key => key.startsWith("selectedTool_"))
    //   .map(key => ({
    //     chatId: key.replace("selectedTool_", ""),
    //     tool: localStorage.getItem(key),
    //   }));

    // if (storedTools.length > 0) {
    //   console.log("📋 Currently stored tools:", storedTools);
    // }
  }, []); // Run once on mount

  // Initialize messages - either from query or welcome message
  useEffect(() => {
    if (conversationId && initialConversationId && queryMessages.length > 0) {
      // For existing conversations, use messages from React Query (only once)
      // Check if we have a welcome message to preserve
      setMessages(prevMessages => {
        const hasWelcomeMessage = prevMessages.length > 0 && prevMessages[0].id === "welcome";
        if (hasWelcomeMessage) {
          // Preserve welcome message at the top
          return [prevMessages[0], ...queryMessages];
        }
        return queryMessages;
      });
    } else if (!conversationId && messages.length === 0) {
      // For new chats, show welcome message
      const welcomeMessages: Message[] = [
        {
          id: "welcome",
          content:
            "👋 Hello! I'm your AI legal confidant. I can help you analyze contracts, answer legal questions, and identify potential issues in documents. What would you like help with today?",
          isUser: false,
          timestamp: new Date(),
        },
      ];
      setMessages(welcomeMessages);
    }
  }, [conversationId, initialConversationId]); // Removed queryMessages and messages.length to prevent infinite loop

  // Load stored selectedTool when conversationId changes (for existing chats)
  useEffect(() => {
    if (conversationId && !toolParam) {
      // Only load from storage if not coming from URL parameter
      const storedTool = getStoredSelectedTool(conversationId);
      if (storedTool && storedTool !== selectedTool) {
        setSelectedTool(storedTool);
      }
    }
  }, [conversationId, toolParam, selectedTool]);

  // Direct initial message handler - simplified approach
  useEffect(() => {
    if (
      initialMessage &&
      !conversationId &&
      !hasProcessedInitialMessage.current &&
      messages.length > 0
    ) {
      hasProcessedInitialMessage.current = true;

      // Send immediately - but only after welcome message is set
      handleSendMessage(initialMessage);
    }
  }, [initialMessage, conversationId, messages.length]); // Run when these change

  // Fallback: Send initial message after a longer delay if not processed yet
  useEffect(() => {
    if (
      initialMessage &&
      !hasProcessedInitialMessage.current &&
      !conversationId &&
      messages.length > 0
    ) {
      const fallbackTimer = setTimeout(() => {
        if (!hasProcessedInitialMessage.current) {
          hasProcessedInitialMessage.current = true;
          handleSendMessage(initialMessage);
        }
      }, 2000); // 2 second fallback

      return () => clearTimeout(fallbackTimer);
    }
    return undefined;
  }, [initialMessage, conversationId, messages.length]);

  // Update messages when React Query data changes - but only for initial load
  useEffect(() => {
    if (conversationId && queryMessages.length > 0 && !hasInitializedFromQuery.current) {
      setMessages(prevMessages => {
        const hasWelcomeMessage = prevMessages.length > 0 && prevMessages[0].id === "welcome";
        if (hasWelcomeMessage) {
          // Preserve welcome message at the top
          return [prevMessages[0], ...queryMessages];
        }
        return queryMessages;
      });
      hasInitializedFromQuery.current = true;
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

        // Store selected tool for new conversation
        if (selectedTool) {
          storeSelectedTool(result.data.conversation_id, selectedTool);
        }

        // Update URL with new chat_id
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("chat_id", result.data.conversation_id);

        // Remove initial message param after first message
        if (currentUrl.searchParams.has("message")) {
          currentUrl.searchParams.delete("message");
        }

        router.replace(currentUrl.pathname + currentUrl.search);
      }

      // Create shared timestamp for AI message and recommendations
      const responseTimestamp = new Date();

      // Replace temporary user message with real data and add AI response
      setMessages(prevMessages => {
        // Remove the temporary user message
        const messagesWithoutTemp = prevMessages.filter(msg => msg.id !== userMessage.id);

        // Create real user message
        const realUserMessage: Message = {
          id: `user-${Date.now()}`,
          content,
          isUser: true,
          timestamp: new Date(),
          attachments: files || undefined,
          conversation_id: result.data?.conversation_id,
        };

        // Create AI response message with shared timestamp for recommendations
        // console.log("🔍 Full API Response:", JSON.stringify(result, null, 2));

        // Determine report URL from multiple possible sources
        const reportUrl = result.data?.report_file_path;

        // Create AI message - ALWAYS include report_file_path if present in API response
        const aiMessage: Message = {
          id: `aix-${Date.now()}`,
          content: result.data?.output || "",
          isUser: false,
          timestamp: responseTimestamp,
          conversation_id: result.data?.conversation_id,
          // Force include report_file_path from API response regardless of type/validation
          ...(reportUrl && {
            report_file_path: reportUrl,
          }),
        };

        const finalMessages = [...messagesWithoutTemp, realUserMessage, aiMessage];

        // console.log(
        //   "💬 Final messages array (showing last message):",
        //   JSON.stringify(finalMessages[finalMessages.length - 1], null, 2)
        // );

        return finalMessages;
      });

      // Handle workflow recommendations - filter by supported action types
      if (result.data?.workflow_recommendations) {
        // Use the same timestamp as the AI message to ensure proper chronological ordering
        const supportedRecommendations = result.data.workflow_recommendations.filter(
          (rec: WorkflowRecommendation) => {
            const isSupported = chatService.isSupportedActionType(rec.action_type);
            // if (!isSupported) {
            //   console.log(
            //     "🚫 Filtering out unsupported recommendation:",
            //     rec.action_type,
            //     rec.title
            //   );
            // }
            return isSupported;
          }
        );

        const uniqueRecommendations = supportedRecommendations
          .filter(
            (rec: WorkflowRecommendation, index: number, self: WorkflowRecommendation[]) =>
              self.findIndex(r => r.title === rec.title && r.action_type === rec.action_type) ===
              index
          )
          .map((rec: WorkflowRecommendation) => ({
            ...rec,
            timestamp: responseTimestamp,
          }));

        setWorkflowRecommendations(uniqueRecommendations);
      }
    } catch (err: any) {
      console.error("Failed to send message:", err);

      // Remove the temporary user message on error
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== userMessage.id));

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
      await handleSendMessage(lastUserMessage.content, lastUserMessage.attachments);
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
          "👋 Hello! I'm your AI legal confidant. I can help you analyze contracts, answer legal questions, and identify potential issues in documents. What would you like help with today?",
        isUser: false,
        timestamp: new Date(),
      },
    ];
    setMessages(welcomeMessages);
  };

  const selectTool = (toolId: string) => {
    setSelectedTool(toolId);

    // Store in localStorage if we have a conversationId
    if (conversationId) {
      storeSelectedTool(conversationId, toolId);
    }
  };

  const clearSelectedTool = () => {
    setSelectedTool(null);

    // Remove from localStorage if we have a conversationId
    if (conversationId) {
      storeSelectedTool(conversationId, null);
    }
  };

  // console.log("messages in useChat:", messages);

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
