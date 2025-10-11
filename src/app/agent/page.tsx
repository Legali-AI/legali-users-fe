"use client";

import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AgentAvatar } from "@/components/elements/chat/agent-avatar";
import { ChatInput } from "@/components/elements/chat/chat-input";
import { ChatMessage } from "@/components/elements/chat/chat-message";
import { AVAILABLE_TOOLS, type Tool, ToolSuggestion } from "@/components/elements/chat/tool-suggestion";
import type { Message } from "@/components/elements/chat/types";
import { H1 } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";

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
      content: "I have an employment agreement that I need reviewed before signing",
      isUser: true,
      timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    },
    {
      id: "2",
      content: "I'll help you analyze that! What are your main concerns about this employment agreement?",
      isUser: false,
      timestamp: new Date(Date.now() - 4 * 60000), // 4 minutes ago
    },
    {
      id: "3",
      content: "The non-compete clause seems too broad, and I'm not sure about the overtime pay terms",
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
  const getToolIdFromParam = (param: string | null) => {
    switch (param) {
      case "redflag":
        return "red-flag-analysis";
      case "template":
        return "legal-template";
      case "lawyers":
        return "lawyers-marketplace";
      case "funding-investors":
        return "litigation-funding-investors";
      case "funding-litigants":
        return "litigation-funding-litigants";
      case "dossier":
        return "legal-dossier-builder";
      case "timeline":
        return "case-timeline-builder";
      default:
        return "general";
    }
  };

  const [currentMode, setCurrentMode] = useState<string>(getToolIdFromParam(toolParam)); // "general" or tool id
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

    // Check for tool triggers
    const contentLower = content.toLowerCase();
    const shouldSuggestTools =
      currentMode === "general" &&
      (contentLower.includes("analyze") ||
        contentLower.includes("template") ||
        contentLower.includes("lawyer") ||
        contentLower.includes("marketplace") ||
        contentLower.includes("funding") ||
        contentLower.includes("dossier") ||
        contentLower.includes("timeline") ||
        contentLower.includes("case"));

    // Check if user wants to see results in Red Flag Analysis mode
    const shouldShowResults = content.toLowerCase().includes("result") && currentMode === "red-flag-analysis";

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
        // Determine which tools to suggest based on keywords
        const suggestTools = () => {
          const tools: Tool[] = [];

          if (contentLower.includes("analyze") || contentLower.includes("red flag")) {
            tools.push(AVAILABLE_TOOLS.find(t => t.id === "red-flag-analysis")!);
          }
          if (contentLower.includes("template") || contentLower.includes("document")) {
            tools.push(AVAILABLE_TOOLS.find(t => t.id === "legal-template")!);
          }
          if (
            contentLower.includes("lawyer") ||
            contentLower.includes("attorney") ||
            contentLower.includes("marketplace")
          ) {
            tools.push(AVAILABLE_TOOLS.find(t => t.id === "lawyers-marketplace")!);
          }
          if (
            contentLower.includes("funding") &&
            (contentLower.includes("investor") || contentLower.includes("invest"))
          ) {
            tools.push(AVAILABLE_TOOLS.find(t => t.id === "litigation-funding-investors")!);
          }
          if (
            contentLower.includes("funding") &&
            (contentLower.includes("litigant") || contentLower.includes("plaintiff") || contentLower.includes("help"))
          ) {
            tools.push(AVAILABLE_TOOLS.find(t => t.id === "litigation-funding-litigants")!);
          }
          if (contentLower.includes("dossier") || contentLower.includes("organize")) {
            tools.push(AVAILABLE_TOOLS.find(t => t.id === "legal-dossier-builder")!);
          }
          if (contentLower.includes("timeline") || contentLower.includes("case") || contentLower.includes("track")) {
            tools.push(AVAILABLE_TOOLS.find(t => t.id === "case-timeline-builder")!);
          }

          // If no specific matches, default to Red Flag Analysis
          if (tools.length === 0) {
            tools.push(AVAILABLE_TOOLS.find(t => t.id === "red-flag-analysis")!);
          }

          return tools.filter(Boolean); // Remove any undefined results
        };

        toolsToSuggest = suggestTools();

        if (toolsToSuggest.length === 1) {
          agentResponse = `I can help you with that! I have a specialized tool that's perfect for your needs:`;
        } else {
          agentResponse = `I can help you with that! I have several specialized tools that might be perfect for your needs:`;
        }
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
    // Handle special redirects for specific tools
    if (tool.id === "lawyers-marketplace") {
      router.push("/lawyers");
      return;
    }

    if (tool.id === "litigation-funding-litigants") {
      router.push("/litigation-crowdfunding");
      return;
    }

    // Update URL with tool parameter - create shorter URLs
    const getToolParam = (toolId: string) => {
      switch (toolId) {
        case "red-flag-analysis":
          return "redflag";
        case "legal-template":
          return "template";
        case "lawyers-marketplace":
          return "lawyers";
        case "litigation-funding-investors":
          return "funding-investors";
        case "litigation-funding-litigants":
          return "funding-litigants";
        case "legal-dossier-builder":
          return "dossier";
        case "case-timeline-builder":
          return "timeline";
        default:
          return toolId;
      }
    };

    const toolParam = getToolParam(tool.id);
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

      switch (tool.id) {
        case "red-flag-analysis":
          welcomeMessage =
            "I'll help you with Red Flag Analysis! This tool is designed to identify potential issues, problematic clauses, and legal concerns in your documents. Please upload your document or describe the specific areas you'd like me to analyze.";
          break;
        case "legal-template":
          welcomeMessage =
            "Welcome to Legal Template Generator! I can help you create professional legal documents from our extensive template library. What type of document do you need to create?";
          break;
        case "lawyers-marketplace":
          welcomeMessage =
            "Welcome to the Lawyers Marketplace! I'll help you find qualified legal professionals who specialize in your area of need. What type of legal expertise are you looking for?";
          break;
        case "litigation-funding-investors":
          welcomeMessage =
            "Welcome to Litigation Funding for Investors! I'll help you discover investment opportunities in legal cases. Are you looking to diversify your portfolio with litigation funding?";
          break;
        case "litigation-funding-litigants":
          welcomeMessage =
            "Welcome to Litigation Funding for Litigants! I'll help you get financial support for your legal case. Tell me about your case and funding needs.";
          break;
        case "legal-dossier-builder":
          welcomeMessage =
            "Welcome to Legal Dossier Builder! I'll help you organize your documents, build timelines, and create comprehensive legal dossiers. What case or matter are you working on?";
          break;
        case "case-timeline-builder":
          welcomeMessage =
            "Welcome to Case Timeline Builder! I'll help you map events, track progress, and create detailed timelines for your legal case. What case would you like to build a timeline for?";
          break;
        default:
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
              <Button variant="ghost" size="icon" className="hover:bg-sky-blue-100">
                <ArrowLeft className="size-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <AgentAvatar />
              <div className="flex flex-col">
                <H1 level="h3" weight="semibold" className="text-deep-navy">
                  {currentMode === "general"
                    ? "AI Legal Assistant"
                    : AVAILABLE_TOOLS.find(t => t.id === currentMode)?.name || "AI Legal Assistant"}
                </H1>
                {currentMode !== "general" && (
                  <button
                    onClick={() => {
                      setCurrentMode("general");
                      setSuggestedTools([]);
                      router.push("/agent");
                    }}
                    className="text-left text-xs text-sky-blue-600 hover:text-sky-blue-800">
                    ← Back to general chat
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hover:bg-sky-blue-100">
              <User className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col pt-20">
        {/* Messages Container */}
        <div ref={chatContainerRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* Tool Suggestions */}
          {suggestedTools.length > 0 && (
            <div className="flex items-start gap-3">
              <AgentAvatar size="sm" />
              <div className="flex-1">
                <ToolSuggestion tools={suggestedTools} onToolSelect={handleToolSelect} />
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
