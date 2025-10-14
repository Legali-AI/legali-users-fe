import type { AxiosError } from "axios";
import type { GetMessagesResponse, SendMessageResponse } from "@/components/elements/chat/types";
import { api } from "@/lib/api-client";

export interface SendMessageRequest {
  user_input: string;
  conversation_id?: string | undefined;
  conversation_type?: string | undefined;
  file?: File | undefined;
}

export interface GetMessagesRequest {
  id_conversation: string;
  offset?: number;
  limit?: number;
  role_filter?: "user" | "assistant" | "system";
  start_date?: string;
  end_date?: string;
}

export const chatService = {
  // Send a message to the chat
  sendMessage: async (request: SendMessageRequest): Promise<SendMessageResponse> => {
    const startTime = Date.now();
    console.log("🚀 Chat API request started at:", new Date().toISOString());

    const formData = new FormData();
    formData.append("user_input", request.user_input);

    if (request.conversation_id) {
      formData.append("conversation_id", request.conversation_id);
    }

    if (request.conversation_type) {
      formData.append("conversation_type", request.conversation_type);
    }

    if (request.file) {
      formData.append("file", request.file);
    }

    try {
      const response = await api.post<SendMessageResponse>("/api/chats/sendmessage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 300000, // 2 minutes timeout for chat API calls
      });

      const endTime = Date.now();
      const duration = endTime - startTime;
      console.log(
        `✅ Chat API request completed in ${duration}ms (${(duration / 1000).toFixed(2)}s)`
      );

      return response;
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      console.error(
        `❌ Chat API request failed after ${duration}ms (${(duration / 1000).toFixed(2)}s):`,
        error
      );
      throw error;
    }
  },

  // Get messages from a conversation
  getMessages: async (request: GetMessagesRequest): Promise<GetMessagesResponse> => {
    const params = new URLSearchParams();

    if (request.offset !== undefined) {
      params.append("offset", request.offset.toString());
    }

    if (request.limit !== undefined) {
      params.append("limit", request.limit.toString());
    }

    if (request.role_filter) {
      params.append("role_filter", request.role_filter);
    }

    if (request.start_date) {
      params.append("start_date", request.start_date);
    }

    if (request.end_date) {
      params.append("end_date", request.end_date);
    }

    const queryString = params.toString();
    const url = `/api/chats/${request.id_conversation}${queryString ? `?${queryString}` : ""}`;

    return api.get<GetMessagesResponse>(url);
  },

  // Helper function to convert API message to local message format
  convertApiMessageToMessage: (apiMessage: any) => ({
    id: apiMessage.id,
    content: apiMessage.content,
    isUser: apiMessage.role === "user",
    timestamp: new Date(apiMessage.created_at || apiMessage.timestamp),
    conversation_id: apiMessage.conversation_id,
    role: apiMessage.role,
    attachments: apiMessage.attachments?.length > 0 ? apiMessage.attachments : undefined,
    report_file_path: apiMessage.report_file_path,
  }),

  // Get chat history for the current user
  getChatHistory: async (): Promise<{
    success: boolean;
    data?: Array<{
      id: string;
      user_id: string;
      session_name: string;
      summary: string | null;
      created_at: string;
    }>;
    message?: string;
    error?: string;
  }> => {
    try {
      console.log("📋 Fetching chat history from API...");
      const response = (await api.get("/api/chats")) as any;
      console.log("📋 Raw API response:", response);
      console.log("📋 Response data:", response.data);

      // Handle different response formats
      if (response.data) {
        // Case 1: Direct array response (when cached/304)
        if (Array.isArray(response.data)) {
          console.log("✅ Chat history fetched (direct array):", response.data);
          return {
            success: true,
            data: response.data,
          };
        }

        // Case 2: Wrapped response with success field
        if (response.data.success && response.data.data) {
          console.log("✅ Chat history fetched (wrapped):", response.data.data);
          return {
            success: true,
            data: response.data.data,
            message: response.data.message,
          };
        }

        // Case 3: Error response
        if (response.data.success === false) {
          console.error("❌ API returned error:", response.data.error);
          return {
            success: false,
            error: response.data.error || "Failed to fetch chat history",
          };
        }
      }

      console.error("❌ Unexpected API response format:", response.data);
      return {
        success: false,
        error: "Unexpected response format",
      };
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("❌ Failed to fetch chat history:", error);
      return {
        success: false,
        error:
          axiosError.response?.data?.message ??
          axiosError.message ??
          "Failed to fetch chat history",
      };
    }
  },

  // Helper function to get conversation type from URL params or tool IDs
  // Based on API documentation: red_flag_analysis, litigation_builder, document_builder,
  // case_builder, contract_review, mediation_support, high_value_dispute, support
  getConversationTypeFromTool: (toolParam: string | null): string | undefined => {
    switch (toolParam) {
      // Full tool IDs (used by selectedTool)
      case "red-flag-analysis":
        return "red_flag_analysis";
      case "legal-template":
        return "document_builder";
      case "legal-dossier-builder":
        return "case_builder";
      case "case-timeline-builder":
        return "case_builder";
      case "litigation-funding-investors":
        return "litigation_builder";
      case "lawyers-marketplace":
        return "support";

      // Legacy URL param formats (for backward compatibility)
      case "redflag":
        return "red_flag_analysis";
      case "template":
        return "document_builder";
      case "dossier":
        return "case_builder";
      case "timeline":
        return "case_builder";
      case "funding-investors":
        return "litigation_builder";
      case "funding-litigants":
        return "litigation_builder";
      default:
        return undefined; // For general chat, no specific conversation_type
    }
  },

  // Helper function to check if action_type is supported
  isSupportedActionType: (actionType: string | null): boolean => {
    const supportedTypes = [
      "red_flag_analysis",
      "litigation_builder",
      "document_builder",
      "case_builder",
      "contract_review",
      "mediation_support",
      "high_value_dispute",
      "support",
    ];
    return actionType ? supportedTypes.includes(actionType) : false;
  },

  // Helper function to get tool ID from action_type (reverse mapping)
  getToolIdFromActionType: (actionType: string | null): string | null => {
    switch (actionType) {
      case "red_flag_analysis":
        return "red-flag-analysis";
      case "document_builder":
        return "legal-template";
      case "case_builder":
        return "legal-dossier-builder"; // or "case-timeline-builder" - we'll use dossier as primary
      case "litigation_builder":
        return "litigation-funding-investors";
      case "contract_review":
        return "red-flag-analysis"; // closest match for contract analysis
      case "mediation_support":
        return "lawyers-marketplace"; // legal professionals for mediation
      case "high_value_dispute":
        return "litigation-funding-investors"; // high-value cases often need funding
      case "support":
        return "lawyers-marketplace";
      default:
        return null;
    }
  },
};
