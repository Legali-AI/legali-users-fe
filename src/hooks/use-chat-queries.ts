import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import type { Message } from "@/components/elements/chat/types";
import { chatService } from "@/services/chat.service";

// Query keys
export const chatQueryKeys = {
  all: ["chat"] as const,
  messages: (chatId: string) => [...chatQueryKeys.all, "messages", chatId] as const,
  history: () => [...chatQueryKeys.all, "history"] as const,
};

// Hook to fetch messages for a specific chat
export function useChatMessages(chatId: string | undefined) {
  return useQuery({
    queryKey: chatQueryKeys.messages(chatId || ""),
    queryFn: async () => {
      if (!chatId) return [];

      const response = await chatService.getMessages({
        id_conversation: chatId,
        limit: 50,
      });

      if (response.success && response.data) {
        return response.data.map(chatService.convertApiMessageToMessage);
      }

      throw new Error(response.error || "Failed to load messages");
    },
    enabled: !!chatId, // Only run query if chatId exists
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Hook to fetch chat history
export function useChatHistory() {
  return useQuery({
    queryKey: chatQueryKeys.history(),
    queryFn: async () => {
      const response = await chatService.getChatHistory();

      if (response.success && response.data) {
        // Deduplicate chat history entries
        const deduplicatedData = response.data.filter((chat, index, arr) => {
          // Find first occurrence of this chat
          const firstIndex = arr.findIndex(
            c =>
              c.id === chat.id ||
              (c.session_name === chat.session_name && c.created_at === chat.created_at)
          );
          return firstIndex === index;
        });

        return deduplicatedData;
      }

      const errorMessage = response.error || "Failed to load chat history";
      console.error("❌ Chat history API error:", errorMessage);
      throw new Error(errorMessage);
    },
    staleTime: 15 * 60 * 1000, // 15 minutes - cache for longer to prevent redundant calls
    gcTime: 30 * 60 * 1000, // 30 minutes - keep in memory longer
    retry: 1, // Only retry once to reduce API calls
    retryDelay: 2000, // 2 second delay before retry
  });
}

// Hook to send a message with optimistic updates
export function useSendMessage() {
  const queryClient = useQueryClient();
  const isSendingRef = useRef(false);

  return useMutation({
    mutationFn: async ({
      message,
      files,
      conversationId,
      toolParam,
    }: {
      message: string;
      files?: File[];
      conversationId?: string;
      toolParam?: string | null;
    }) => {
      // Prevent duplicate calls
      if (isSendingRef.current) {
        console.warn("⚠️ Duplicate sendMessage call prevented");
        throw new Error("Message is already being sent");
      }

      isSendingRef.current = true;

      // Allow empty message if files are provided
      const finalMessage = message?.trim() || "";

      if (!finalMessage && (!files || files.length === 0)) {
        console.error("❌ Invalid message parameter:", { message, type: typeof message });
        throw new Error("Message is required when no files are provided");
      }

      const conversationType = chatService.getConversationTypeFromTool(toolParam || null);

      const requestPayload: any = {
        user_input: finalMessage,
      };

      if (conversationId) {
        requestPayload.conversation_id = conversationId;
      }

      if (conversationType) {
        requestPayload.conversation_type = conversationType;
      }

      if (files && files.length > 0) {
        const file = files[0];

        // Validate file before sending
        if (!(file instanceof File)) {
          throw new Error("Invalid file object");
        }
        if (file.size === 0) {
          throw new Error("File is empty");
        }
        if (!file.name) {
          throw new Error("File has no name");
        }
        if (file.size > 5 * 1024 * 1024) {
          // 5MB limit
          const fileSize = `${(file.size / (1024 * 1024)).toFixed(2)}MB`;
          throw new Error(`File too large (${fileSize}). Please choose a file smaller than 5MB.`);
        }

        requestPayload.file = file;
      }

      const response = await chatService.sendMessage(requestPayload);

      if (!response.success) {
        throw new Error(response.error || "Failed to send message");
      }

      return response;
    },
    onMutate: async ({ message, files, conversationId }) => {
      // Optimistic update: add user message immediately
      if (conversationId) {
        const queryKey = chatQueryKeys.messages(conversationId);

        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey });

        // Snapshot previous value
        const previousMessages = queryClient.getQueryData<Message[]>(queryKey) || [];

        // Optimistically update with new user message
        const optimisticUserMessage: Message = {
          id: `temp-${Date.now()}`,
          content: message,
          isUser: true,
          timestamp: new Date(),
          attachments: files || undefined,
        };

        queryClient.setQueryData<Message[]>(queryKey, [...previousMessages, optimisticUserMessage]);

        return { previousMessages, optimisticUserMessage };
      }

      return { previousMessages: [], optimisticUserMessage: null };
    },
    onSuccess: (response, variables, context) => {
      const finalConversationId = response.data?.conversation_id || variables.conversationId;

      if (finalConversationId) {
        const queryKey = chatQueryKeys.messages(finalConversationId);

        // Replace optimistic message with real messages from server
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          content: response.data?.output || "",
          isUser: false,
          timestamp: new Date(),
          conversation_id: response.data?.conversation_id,
        };

        // If we had an optimistic update, replace the temp message
        if (context?.optimisticUserMessage) {
          const previousMessages = context.previousMessages || [];
          const realUserMessage: Message = {
            ...context.optimisticUserMessage,
            id: `user-${Date.now()}`,
            conversation_id: response.data?.conversation_id,
          };

          queryClient.setQueryData<Message[]>(queryKey, [
            ...previousMessages,
            realUserMessage,
            aiMessage,
          ]);
        } else {
          // No previous conversation, this is the first message
          const userMessage: Message = {
            id: `user-${Date.now()}`,
            content: variables.message,
            isUser: true,
            timestamp: new Date(),
            conversation_id: response.data?.conversation_id,
            attachments: variables.files || undefined,
          };

          queryClient.setQueryData<Message[]>(queryKey, [userMessage, aiMessage]);
        }

        // Invalidate chat history to refresh the sidebar
        queryClient.invalidateQueries({ queryKey: chatQueryKeys.history() });
      }

      // Reset sending flag
      isSendingRef.current = false;
    },
    onError: (error, variables, context) => {
      // Revert optimistic update on error
      if (context?.previousMessages && variables.conversationId) {
        const queryKey = chatQueryKeys.messages(variables.conversationId);
        queryClient.setQueryData<Message[]>(queryKey, context.previousMessages);
      }

      console.error("Failed to send message:", error);

      // Reset sending flag
      isSendingRef.current = false;
    },
    retry: 2, // Retry failed requests twice
  });
}
