import type { GetMessagesResponse, SendMessageResponse } from "@/components/elements/chat/types";
import { api } from "@/lib/api-client";

export interface SendMessageRequest {
  user_input: string;
  conversation_id?: string | undefined;
  conversation_type?: string | undefined;
  file?: File | undefined;
}

// Validation function for SendMessageRequest
export const validateSendMessageRequest = (request: SendMessageRequest): string[] => {
  const errors: string[] = [];

  // user_input is always required by the API, but we can provide a default for file-only uploads
  if (!request.user_input || request.user_input.trim() === "") {
    // This will be handled by providing a default message, so no error needed
    console.log("⚠️ user_input is empty, will use default message");
  }

  if (request.user_input && request.user_input.length > 10000) {
    errors.push("user_input is too long (max 10000 characters)");
  }

  if (request.conversation_id && typeof request.conversation_id !== "string") {
    errors.push("conversation_id must be a string");
  }

  if (request.conversation_type && typeof request.conversation_type !== "string") {
    errors.push("conversation_type must be a string");
  }

  if (request.file && !(request.file instanceof File)) {
    errors.push("file must be a File object");
  }

  if (request.file && request.file.size > 5 * 1024 * 1024) { // 5MB limit (reduced from 10MB)
    errors.push("file size must be less than 5MB");
  }

  if (request.file && request.file.size === 0) {
    errors.push("file cannot be empty");
  }

  if (request.file && !request.file.name) {
    errors.push("file must have a name");
  }

  return errors;
};

// Helper function to debug FormData
export const debugFormData = (formData: FormData): void => {
  console.log("🔍 FormData Debug Info:");
  console.log("  - FormData size:", formData.toString().length);
  console.log("  - FormData entries:");
  
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`    ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
    } else {
      console.log(`    ${key}: "${value}" (${typeof value})`);
    }
  }
};

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
    console.log("📝 Request payload:", {
      user_input: request.user_input,
      conversation_id: request.conversation_id,
      conversation_type: request.conversation_type,
      has_file: !!request.file,
      file_name: request.file?.name,
      file_size: request.file?.size,
    });

    // Debug the incoming request object
    console.log("🔍 Raw request object:", {
      type: typeof request,
      keys: Object.keys(request),
      user_input: request.user_input,
      user_input_type: typeof request.user_input,
      user_input_length: request.user_input?.length,
      conversation_id: request.conversation_id,
      conversation_type: request.conversation_type,
      file: request.file,
    });

    // Validate request data
    const validationErrors = validateSendMessageRequest(request);
    if (validationErrors.length > 0) {
      console.error("❌ Validation errors:", validationErrors);
      console.error("❌ Request object that failed validation:", request);
      throw new Error(`Validation failed: ${validationErrors.join(", ")}`);
    }

    const formData = new FormData();
    
    // Send a default message if user_input is empty but file is provided
    const userInput = request.user_input?.trim() || "I send document(s)";
    formData.append("user_input", userInput);

    if (request.conversation_id) {
      formData.append("conversation_id", request.conversation_id);
    }

    if (request.conversation_type) {
      formData.append("conversation_type", request.conversation_type);
    }

    if (request.file) {
      console.log("📎 Adding file to FormData:", {
        name: request.file.name,
        size: request.file.size,
        type: request.file.type,
        lastModified: request.file.lastModified,
      });
      formData.append("file", request.file);
    }

    // Debug FormData contents
    debugFormData(formData);

    try {
      const response = await api.post<SendMessageResponse>("/api/chats/sendmessage", formData, {
        headers: {
          // Don't set Content-Type manually - let axios handle it for FormData
          // This ensures proper boundary is set for multipart/form-data
        },
        timeout: 300000, // 5 minutes timeout for chat API calls
      });

      const endTime = Date.now();
      const duration = endTime - startTime;
      console.log(
        `✅ Chat API request completed in ${duration}ms (${(duration / 1000).toFixed(2)}s)`
      );
      console.log("📥 Response data:", {
        success: response.success,
        conversation_id: response.data?.conversation_id,
        has_output: !!response.data?.output,
        output_length: response.data?.output?.length || 0,
      });

      return response;
    } catch (error: any) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Enhanced error logging
      console.error(
        `❌ Chat API request failed after ${duration}ms (${(duration / 1000).toFixed(2)}s)`
      );
      console.error("❌ Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        },
      });

      // Log the actual FormData that was sent
      console.error("❌ FormData that was sent:");
      if (error.config?.data instanceof FormData) {
        for (const [key, value] of error.config.data.entries()) {
          if (value instanceof File) {
            console.error(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
          } else {
            console.error(`  ${key}: "${value}"`);
          }
        }
      }

      // Provide more specific error messages
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || "Bad Request";
        throw new Error(`Invalid request: ${errorMessage}`);
      } else if (error.response?.status === 401) {
        throw new Error("Authentication required. Please log in again.");
      } else if (error.response?.status === 413) {
        const fileSize = request.file ? `${(request.file.size / (1024 * 1024)).toFixed(2)}MB` : "unknown";
        throw new Error(`File too large (${fileSize}). Please choose a file smaller than 5MB.`);
      } else if (error.response?.status >= 500) {
        throw new Error("Server error. Please try again later.");
      } else {
        throw error;
      }
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
    } catch (error: any) {
      console.error("❌ Failed to fetch chat history:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Failed to fetch chat history",
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
