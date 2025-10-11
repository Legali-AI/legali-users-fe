"use client";

import { AgentAvatar } from "@/components/elements/chat/agent-avatar";
import { ChatInput } from "@/components/elements/chat/chat-input";
import { ChatMessage } from "@/components/elements/chat/chat-message";
import {
  AVAILABLE_TOOLS,
  type Tool,
  ToolSuggestion,
} from "@/components/elements/chat/tool-suggestion";
import type { Message } from "@/components/elements/chat/types";
import { H1 } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function AgentChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toolParam = searchParams.get("tools");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "👋 Hello! I'm your AI legal assistant. I can help you analyze contracts, answer legal questions, and identify potential issues in documents. What would you like help with today?",
      isUser: false,
      timestamp: new Date(),
    },
    {
      id: "1",
      content:
        "I have an employment agreement that I need reviewed before signing",
      isUser: true,
      timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    },
    {
      id: "2",
      content:
        "I'll help you analyze that! What are your main concerns about this employment agreement?",
      isUser: false,
      timestamp: new Date(Date.now() - 4 * 60000), // 4 minutes ago
    },
    {
      id: "3",
      content:
        "The non-compete clause seems too broad, and I'm not sure about the overtime pay terms",
      isUser: true,
      timestamp: new Date(Date.now() - 3 * 60000), // 3 minutes ago
    },
    {
      id: "4",
      content:
        "Those are important concerns. I'll analyze those sections carefully, along with other potential issues. Please upload your employment agreement document.",
      isUser: false,
      timestamp: new Date(Date.now() - 2 * 60000), // 2 minutes ago
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [suggestedTools, setSuggestedTools] = useState<Tool[]>([]);
  const [currentMode, setCurrentMode] = useState<string>(
    toolParam === "redflag" ? "red-flag-analysis" : "general"
  ); // "general" or tool id
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string, files?: File[]) => {
    if (!content.trim() && (!files || files.length === 0)) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
      attachments: files || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Check if user mentioned analyzing - suggest tools
    const shouldSuggestTools =
      content.toLowerCase().includes("analyze") && currentMode === "general";

    // Check if user wants to see results in Red Flag Analysis mode
    const shouldShowResults =
      content.toLowerCase().includes("result") &&
      currentMode === "red-flag-analysis";

    // Simulate agent response
    setTimeout(() => {
      let agentResponse = "";
      let toolsToSuggest: Tool[] = [];

      if (shouldShowResults) {
        agentResponse =
          "Analysis complete! I found 4 red flags in your employment agreement, including concerns about the non-compete clause, termination terms, overtime pay, and intellectual property rights. The overall risk level is HIGH.";

        // Show analysis report button after response
        setTimeout(() => {
          const reportMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: "VIEW_FULL_ANALYSIS_REPORT", // Special content for report button
            isUser: false,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, reportMessage]);
        }, 1000);
      } else if (shouldSuggestTools) {
        agentResponse =
          "I can help you analyze that! I have several specialized tools that might be perfect for your needs. Let me suggest some options:";
        // Suggest Red Flag Analysis for document analysis
        toolsToSuggest = [
          AVAILABLE_TOOLS.find(t => t.id === "red-flag-analysis")!,
        ];
      } else {
        const responses = [
          "I've received your message. Let me analyze this for you...",
          "Thank you for sharing that information. I'll review the details and provide my analysis.",
          "I understand your concerns. Let me break this down for you step by step.",
          "That's a great question! Let me help you understand the legal implications.",
          files && files.length > 0
            ? `I've received your ${files.length === 1 ? "document" : "documents"}. I'm analyzing ${files.map(f => f.name).join(", ")} for potential legal issues.`
            : "I'm processing your request and will provide a detailed response shortly.",
        ];
        agentResponse = responses[Math.floor(Math.random() * responses.length)];
      }

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: agentResponse,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, agentMessage]);
      setSuggestedTools(toolsToSuggest);
      setIsTyping(false);
    }, 1500);
  };

  const handleToolSelect = (tool: Tool) => {
    // Update URL with tool parameter
    const toolParam = tool.id === "red-flag-analysis" ? "redflag" : tool.id;
    router.push(`/agent?tools=${toolParam}`);

    // Start specialized conversation for the selected tool
    setCurrentMode(tool.id);
    setSuggestedTools([]);

    // Add a message showing tool selection
    const toolMessage: Message = {
      id: Date.now().toString(),
      content: `🔧 **${tool.name}** activated`,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, toolMessage]);

    // Simulate tool-specific welcome message
    setTimeout(() => {
      let welcomeMessage = "";

      if (tool.id === "red-flag-analysis") {
        welcomeMessage =
          "I'll help you with Red Flag Analysis! This tool is designed to identify potential issues, problematic clauses, and legal concerns in your documents. Please upload your document or describe the specific areas you'd like me to analyze.";
      } else {
        welcomeMessage = `Welcome to ${tool.name}! I'm now focused on helping you with this specific tool. How can I assist you?`;
      }

      const welcomeMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: welcomeMessage,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, welcomeMsg]);
    }, 800);
  };

  return (
    <div className="flex h-screen">
      {/* Header */}
      <div className="fixed top-0 right-0 left-0 z-10 border-b border-sky-blue-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-sky-blue-100"
              >
                <ArrowLeft className="size-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <AgentAvatar />
              <div className="flex flex-col">
                <H1 level="h3" weight="semibold" className="text-deep-navy">
                  {currentMode === "general"
                    ? "AI Legal Assistant"
                    : AVAILABLE_TOOLS.find(t => t.id === currentMode)?.name ||
                      "AI Legal Assistant"}
                </H1>
                {currentMode !== "general" && (
                  <button
                    onClick={() => {
                      setCurrentMode("general");
                      setSuggestedTools([]);
                      router.push("/agent");
                    }}
                    className="text-left text-xs text-sky-blue-600 hover:text-sky-blue-800"
                  >
                    ← Back to general chat
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-sky-blue-100"
            >
              <User className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col pt-20">
        {/* Messages Container */}
        <div
          ref={chatContainerRef}
          className="flex-1 space-y-4 overflow-y-auto px-4 py-6"
        >
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* Tool Suggestions */}
          {suggestedTools.length > 0 && (
            <div className="flex items-start gap-3">
              <AgentAvatar size="sm" />
              <div className="flex-1">
                <ToolSuggestion
                  tools={suggestedTools}
                  onToolSelect={handleToolSelect}
                />
              </div>
            </div>
          )}

          {isTyping && (
            <div className="flex items-start gap-3">
              <AgentAvatar size="sm" />
              <div className="max-w-xs rounded-2xl rounded-tl-md border border-sky-blue-200 bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-sky-blue-400"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-sky-blue-400"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-sky-blue-400"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="border-t border-sky-blue-200 bg-white/95 backdrop-blur-sm">
          <div className="px-4 py-4">
            <ChatInput
              onSendMessage={handleSendMessage}
              placeholder="Upload your documents, share your concerns, or simply ask a question—we'll take it from there"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
