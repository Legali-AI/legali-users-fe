import { useCallback, useEffect, useRef, useState } from "react";
import type { Message, WorkflowRecommendation } from "@/components/elements/chat/types";
import { chatService } from "@/services/chat.service";

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(initialConversationId);
  const [workflowRecommendations, setWorkflowRecommendations] = useState<WorkflowRecommendation[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  console.log("💾 Initializing conversation:", {
    fromURL: initialConversationId,
    hasInitialMessage: !!initialMessage,
    final: conversationId,
  });

  // Load messages when conversation ID changes - only for existing conversations with chat_id
  useEffect(() => {
    if (conversationId && initialConversationId) {
      // Only load existing messages if we started with a chat_id parameter
      loadMessages();
    } else if (messages.length === 0) {
      // Initialize with welcome message for new chats (no chat_id parameter)
      const welcomeMessages = [
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
  }, [conversationId, messages.length, initialConversationId]);

  const loadMessages = useCallback(async () => {
    if (!conversationId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await chatService.getMessages({
        id_conversation: conversationId,
        limit: 50, // Get last 50 messages
      });

      if (response.success && response.data) {
        const convertedMessages = response.data.map(chatService.convertApiMessageToMessage);
        setMessages(convertedMessages);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
      setError("Failed to load conversation history");
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  const sendMessage = useCallback(
    async (content: string, files?: File[]) => {
      if (!content.trim() && (!files || files.length === 0)) return;

      // Cancel any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      // Add user message to UI immediately
      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        content,
        isUser: true,
        timestamp: new Date(),
        attachments: files || undefined,
      };

      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);
      setError(null);

      try {
        const conversationType = chatService.getConversationTypeFromTool(toolParam || null);

        // Prepare request payload
        const requestPayload: any = {
          user_input: content,
        };

        if (conversationId) {
          requestPayload.conversation_id = conversationId;
        }

        if (conversationType) {
          requestPayload.conversation_type = conversationType;
        }

        if (files?.[0]) {
          requestPayload.file = files[0];
        }

        // Send message to API
        const response = await chatService.sendMessage(requestPayload);

        if (response.success && response.data) {
          // Update conversation ID if it's a new conversation
          if (!conversationId && response.data.conversation_id) {
            setConversationId(response.data.conversation_id);
          }

          // Add AI response to messages
          const aiMessage: Message = {
            id: `ai-${Date.now()}`,
            content: response.data.output,
            isUser: false,
            timestamp: new Date(),
            conversation_id: response.data.conversation_id,
          };

          // Update the user message with the actual conversation ID
          setMessages(prev =>
            prev
              .map(msg =>
                msg.id === userMessage.id
                  ? { ...msg, conversation_id: response.data.conversation_id }
                  : msg
              )
              .concat([aiMessage])
          );

          // Handle workflow recommendations with deduplication
          const allRecommendations = [
            ...(response.data.workflow_recommendations || []),
            ...(response.data.next_suggested_action ? [response.data.next_suggested_action] : []),
          ];

          console.log("📋 Raw recommendations from API:", {
            workflow_recommendations: response.data.workflow_recommendations?.length || 0,
            next_suggested_action: response.data.next_suggested_action ? "present" : "none",
            total_before_dedup: allRecommendations.length,
          });

          // Deduplicate based on action_type + title + endpoint
          const uniqueRecommendations = allRecommendations.filter((rec, index, arr) => {
            const key = `${rec.action_type}-${rec.title}-${rec.endpoint}`;
            return (
              arr.findIndex(r => `${r.action_type}-${r.title}-${r.endpoint}` === key) === index
            );
          });

          console.log(
            "📋 After deduplication:",
            uniqueRecommendations.length,
            "unique recommendations"
          );

          setWorkflowRecommendations(uniqueRecommendations);
        }
      } catch (err: any) {
        console.error("Failed to send message:", err);

        // Don't show error if request was aborted
        if (err.name !== "AbortError") {
          setError("Failed to send message. Please try again.");

          // Remove the user message if sending failed
          setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
        }
      } finally {
        setIsTyping(false);
        abortControllerRef.current = null;
      }
    },
    [conversationId, toolParam]
  );

  // Handle initial message from main page
  useEffect(() => {
    if (initialMessage && !isLoading && !isTyping && messages.length > 0) {
      // Small delay to ensure welcome message is displayed first
      const timer = setTimeout(() => {
        console.log("🚀 Sending initial message from main page:", initialMessage);
        sendMessage(initialMessage);
      }, 500);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [initialMessage, isLoading, isTyping, messages.length, sendMessage]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retryLastMessage = useCallback(() => {
    const lastUserMessage = messages.findLast(msg => msg.isUser);
    if (lastUserMessage) {
      // Remove the last user message and retry
      setMessages(prev => prev.filter(msg => msg.id !== lastUserMessage.id));
      sendMessage(lastUserMessage.content, lastUserMessage.attachments);
    }
  }, [messages, sendMessage]);

  const clearConversation = useCallback(() => {
    // Clear state
    setMessages([]);
    setConversationId(undefined);
    setWorkflowRecommendations([]);
    setError(null);
    setIsTyping(false);

    // Add welcome message
    const welcomeMessages = [
      {
        id: "welcome",
        content:
          "👋 Hello! I'm your AI legal confidant. I can help you analyze contracts, answer legal questions, and identify potential issues in documents. What would you like help with today?",
        isUser: false,
        timestamp: new Date(),
      },
    ];
    setMessages(welcomeMessages);
  }, []);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    messages,
    isLoading,
    isTyping,
    conversationId,
    workflowRecommendations,
    error,
    sendMessage,
    loadMessages,
    clearError,
    retryLastMessage,
    clearConversation,
  };
}
