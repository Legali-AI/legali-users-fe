"use client";

import { Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { Typography } from "../typography";
import { AgentAvatar } from "./agent-avatar";
import { AnalysisReportButton } from "./analysis-report-button";
import { MarkdownRenderer } from "./markdown-renderer";
import type { Message } from "./types";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { content, isUser, timestamp, attachments, report_file_path } = message;

  // if (!isUser) {
  //   console.log("🔍 ChatMessage: AI message received:", message);
  //   console.log("🔍 ChatMessage: report_file_path value:", report_file_path);
  // }

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
    <div className="space-y-4">
      {/* Main Message */}
      <div className={cn("flex items-start gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
        {/* Avatar */}
        {!isUser && <AgentAvatar size="sm" />}

        {/* Message Content */}
        <div
          className={cn(
            "max-w-xs rounded-2xl px-4 py-3 shadow-sm sm:max-w-md lg:max-w-lg",
            isUser ? "rounded-tr-md bg-sky-blue-400 text-white" : "rounded-tl-md border border-sky-blue-200 bg-white"
          )}>
          {/* Message Text */}
          <MarkdownRenderer content={content} isUser={isUser} />

          {/* Attachments */}
          {attachments && attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {attachments.map((file, index) => {
                const fileName = file instanceof File ? file.name : file.filename;
                return (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center gap-2 rounded-lg p-2 text-xs",
                      isUser ? "bg-sky-blue-500/30 text-white" : "bg-sky-blue-50 text-slate-gray-700"
                    )}>
                    <Paperclip className="size-3" />
                    <span className="truncate">{fileName}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Timestamp */}
          <Typography level="caption" className={cn("mt-2 opacity-70", isUser ? "text-white" : "text-slate-gray-500")}>
            {timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </div>
      </div>

      {/* Analysis Report Card - Show when report_file_path is present and message is from AI */}
      {!isUser && report_file_path && (
        <div className="flex items-start gap-3">
          <AgentAvatar size="sm" />
          <AnalysisReportButton reportUrl={report_file_path || ""} />
        </div>
      )}
    </div>
  );
}
