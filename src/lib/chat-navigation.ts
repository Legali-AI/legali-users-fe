/**
 * Utility functions for navigating to the agent chat
 */

export interface NavigateToAgentOptions {
  message?: string | undefined;
  tool?: string | undefined;
}

/**
 * Navigate to the agent chat page with optional initial message and settings
 */
export const navigateToAgent = (options: NavigateToAgentOptions = {}) => {
  const params = new URLSearchParams();

  if (options.message) {
    params.set("message", options.message);
  }

  if (options.tool) {
    params.set("tools", options.tool);
  }

  const queryString = params.toString();
  const url = `/agent${queryString ? `?${queryString}` : ""}`;

  // Return the URL for router navigation
  return url;
};

/**
 * Navigate to agent with a new chat (coming from main page)
 */
export const startNewChatWithMessage = (message: string, tool?: string | undefined) => {
  const options: NavigateToAgentOptions = {
    message,
  };

  if (tool) {
    options.tool = tool;
  }

  return navigateToAgent(options);
};

/**
 * Navigate to agent with a specific tool
 */
export const navigateToAgentTool = (tool: string, message?: string | undefined) => {
  const options: NavigateToAgentOptions = {
    tool,
  };

  if (message) {
    options.message = message;
  }

  return navigateToAgent(options);
};

/**
 * Continue existing conversation
 */
export const continueConversation = (conversationId: string) => {
  return `/agent?chat_id=${conversationId}`;
};
