import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const isSendingMessage = useRef(false);
  const hasSetWelcomeMessage = useRef(false);
  const isInitialMessage = useRef(false);

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

  // Update conversationId when initialConversationId changes (from URL)
  useEffect(() => {
    if (initialConversationId !== conversationId) {
      setConversationId(initialConversationId);
    }
  }, [initialConversationId, conversationId]);

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
  }, [cleanupOldStoredTools]); // Run once on mount

  // Initialize messages - either from query or welcome message
  useEffect(() => {
    if (conversationId && queryMessages.length > 0) {
      // For existing conversations, use messages from React Query
      setMessages(queryMessages);
    } else if (!conversationId && !hasSetWelcomeMessage.current) {
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
      hasSetWelcomeMessage.current = true;
    }
  }, [conversationId, queryMessages]);

  // Load stored selectedTool when conversationId changes (for existing chats)
  useEffect(() => {
    if (conversationId && !toolParam) {
      // Only load from storage if not coming from URL parameter
      const storedTool = getStoredSelectedTool(conversationId);
      if (storedTool && storedTool !== selectedTool) {
        setSelectedTool(storedTool);
      }
    }
  }, [conversationId, toolParam, selectedTool, getStoredSelectedTool]);

  // Direct initial message handler - simplified approach
  useEffect(() => {
    if (
      initialMessage &&
      !conversationId &&
      !hasProcessedInitialMessage.current &&
      hasSetWelcomeMessage.current &&
      !isSendingMessage.current
    ) {
      hasProcessedInitialMessage.current = true;
      isInitialMessage.current = true; // Mark as initial message

      // Send immediately - but only after welcome message is set
      // Use setTimeout to avoid dependency issues
      setTimeout(() => {
        handleSendMessage(initialMessage);
      }, 0);
    }
  }, [initialMessage, conversationId]);

  // Reset state when conversationId changes (for chat history navigation)
  useEffect(() => {
    if (conversationId && conversationId !== initialConversationId) {
      // Reset flags when switching conversations
      hasInitializedFromQuery.current = false;
      // Don't reset hasProcessedInitialMessage to prevent re-sending initial message
      // hasProcessedInitialMessage.current = false;

      // Clear current messages to prevent showing old data
      setMessages([]);
      setWorkflowRecommendations([]);
      setError(null);
    }
  }, [conversationId, initialConversationId]);

  // Handle messages error
  useEffect(() => {
    if (messagesError) {
      setError(messagesError.message);
    }
  }, [messagesError]);

  const handleSendMessage = useCallback(
    async (content: string, files?: File[]) => {
      // Prevent duplicate calls
      if (isSendingMessage.current) {
        return;
      }

      isSendingMessage.current = true;

      // Allow sending files without content, but require at least one of them
      if (!content.trim() && (!files || files.length === 0)) {
        console.warn("⚠️ handleSendMessage: Empty content and no files, returning early");
        isSendingMessage.current = false;
        return;
      }

      // Cancel any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      // IMMEDIATELY add user message to UI (optimistic update)
      // Use the same logic as mutation params for consistency
      const displayContent = content || "";

      const userMessage: Message = {
        id: `temp-user-${Date.now()}`,
        content: displayContent,
        isUser: true,
        timestamp: new Date(),
        attachments: files || undefined,
      };

      // Add user message immediately to messages array
      setMessages(prevMessages => [...prevMessages, userMessage]);

      setIsTyping(true);
      setError(null);

      try {
        // Validate files before sending
        if (files && files.length > 0) {
          // Check if any file is invalid
          const invalidFiles = files.filter(f => !(f instanceof File) || f.size === 0 || !f.name);
          if (invalidFiles.length > 0) {
            throw new Error(
              `Invalid files detected: ${invalidFiles.length} files are empty or invalid`
            );
          }

          // Check file sizes
          const maxSize = 5 * 1024 * 1024; // 5MB
          const oversizedFiles = files.filter(f => f.size > maxSize);
          if (oversizedFiles.length > 0) {
            const fileNames = oversizedFiles.map(f => f.name).join(", ");
            const fileSizes = oversizedFiles
              .map(f => `${(f.size / (1024 * 1024)).toFixed(2)}MB`)
              .join(", ");
            throw new Error(
              `File(s) too large: ${fileNames} (${fileSizes}). Please choose files smaller than 5MB.`
            );
          }
        }

        const mutationParams = {
          message: content || "", // Send empty message if no content
          ...(files && { files }),
          ...(conversationId && { conversationId }),
          ...(selectedTool && { toolParam: selectedTool }),
        };

        const result = await sendMessageMutation.mutateAsync(mutationParams);

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
        isSendingMessage.current = false;

        // Reset initial message flag after processing
        if (isInitialMessage.current) {
          isInitialMessage.current = false;
        }
      }
    },
    [conversationId, selectedTool, sendMessageMutation]
  );

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
