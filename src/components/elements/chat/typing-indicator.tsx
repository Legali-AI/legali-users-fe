"use client";

import { useEffect, useState } from "react";

interface TypingIndicatorProps {
  isTyping: boolean;
  showTimer?: boolean;
}

export function TypingIndicator({ isTyping, showTimer = true }: TypingIndicatorProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!isTyping) {
      setElapsedTime(0);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isTyping]);

  if (!isTyping) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getStatusMessage = (seconds: number) => {
    if (seconds < 10) return "AI is thinking...";
    if (seconds < 30) return "Analyzing your request...";
    if (seconds < 60) return "Processing complex analysis...";
    return "Performing deep analysis, please wait...";
  };

  return (
    <div className="flex items-start gap-3">
      <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-sky-blue-100">
        <div className="size-3 rounded-full bg-sky-blue-500" />
      </div>
      <div className="max-w-xs rounded-2xl rounded-tl-md border border-sky-blue-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="h-2 w-2 animate-bounce rounded-full bg-sky-blue-400" style={{ animationDelay: "0ms" }} />
            <div className="h-2 w-2 animate-bounce rounded-full bg-sky-blue-400" style={{ animationDelay: "150ms" }} />
            <div className="h-2 w-2 animate-bounce rounded-full bg-sky-blue-400" style={{ animationDelay: "300ms" }} />
          </div>
          {showTimer && elapsedTime > 5 && (
            <span className="ml-2 text-xs text-slate-gray-500">{formatTime(elapsedTime)}</span>
          )}
        </div>
        {showTimer && elapsedTime > 10 && (
          <p className="mt-2 text-xs text-slate-gray-600">{getStatusMessage(elapsedTime)}</p>
        )}
        {elapsedTime > 90 && (
          <p className="mt-1 text-xs text-orange-600">
            This is taking longer than usual. The API may be processing a complex request.
          </p>
        )}
      </div>
    </div>
  );
}
