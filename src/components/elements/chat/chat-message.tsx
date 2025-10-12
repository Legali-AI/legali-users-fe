"use client";

import { cn } from "@/lib/utils";
import { Paperclip } from "lucide-react";
import { Typography } from "../typography";
import { AgentAvatar } from "./agent-avatar";
import { AnalysisReportButton } from "./analysis-report-button";
import type { Message } from "./types";

// Helper function to parse markdown-style links and create clickable links
function parseTextWithLinks(text: string, isUser: boolean) {
  // Regex to match markdown-style links: [text](url)
  const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;

  // Split text by markdown links while preserving the matches
  const parts: (string | { text: string; url: string })[] = [];
  let lastIndex = 0;
  let match;

  while ((match = markdownLinkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Add the link data
    parts.push({
      text: match[1], // The text inside [brackets]
      url: match[2], // The URL inside (parentheses)
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last link
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  // If no markdown links found, return the original text
  if (parts.length === 0) {
    return text;
  }

  return parts.map((part, index) => {
    if (typeof part === "object") {
      // This is a link
      return (
        <a
          key={index}
          href={part.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-1 underline hover:no-underline",
            isUser
              ? "text-sky-100 hover:text-white"
              : "text-blue-600 hover:text-blue-800"
          )}
          title={part.url} // Show full URL on hover
        >
          {part.text}
          <svg
            className="h-3 w-3 opacity-70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      );
    }
    // This is regular text
    return part;
  });
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { content, isUser, timestamp, attachments } = message;

  // Special case for analysis report button
  if (content === "VIEW_FULL_ANALYSIS_REPORT" && !isUser) {
    return (
      <div className="flex items-start gap-3">
        <AgentAvatar size="sm" />
        <AnalysisReportButton />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      {!isUser && <AgentAvatar size="sm" />}

      {/* Message Content */}
      <div
        className={cn(
          "max-w-xs rounded-2xl px-4 py-3 shadow-sm sm:max-w-md lg:max-w-lg",
          isUser
            ? "rounded-tr-md bg-sky-blue-400 text-white"
            : "rounded-tl-md border border-sky-blue-200 bg-white"
        )}
      >
        {/* Message Text */}
        <Typography
          level="body"
          className={cn(
            "leading-relaxed",
            isUser ? "text-white" : "text-slate-gray-800"
          )}
        >
          {parseTextWithLinks(content, isUser)}
        </Typography>

        {/* Attachments */}
        {attachments && attachments.length > 0 && (
          <div className="mt-3 space-y-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-2 rounded-lg p-2 text-xs",
                  isUser
                    ? "bg-sky-blue-500/30 text-white"
                    : "bg-sky-blue-50 text-slate-gray-700"
                )}
              >
                <Paperclip className="size-3" />
                <span className="truncate">{file.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <Typography
          level="caption"
          className={cn(
            "mt-2 opacity-70",
            isUser ? "text-white" : "text-slate-gray-500"
          )}
        >
          {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      </div>
    </div>
  );
}
