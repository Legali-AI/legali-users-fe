"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AgentAvatar({ size = "md", className }: AgentAvatarProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-sky-blue-400 to-sky-blue-600 shadow-sm",
        {
          "size-8": size === "sm",
          "size-10": size === "md",
          "size-12": size === "lg",
        },
        className
      )}>
      <Sparkles
        className={cn("text-white", {
          "size-4": size === "sm",
          "size-5": size === "md",
          "size-6": size === "lg",
        })}
      />
    </div>
  );
}
