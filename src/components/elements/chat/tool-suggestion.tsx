"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Clock,
  FileText,
  Folder,
  Gavel,
  TrendingUp,
  Users,
} from "lucide-react";
import { Typography } from "../typography";

export interface Tool {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

export const AVAILABLE_TOOLS: Tool[] = [
  {
    id: "red-flag-analysis",
    name: "Red Flag Analysis",
    icon: AlertTriangle,
    description: "Identify potential issues in legal documents",
  },
  {
    id: "legal-template",
    name: "Legal Template",
    icon: FileText,
    description: "Generate legal document templates",
  },
  {
    id: "lawyers-marketplace",
    name: "Lawyers Marketplace",
    icon: Users,
    description: "Find qualified legal professionals",
  },
  {
    id: "litigation-funding-investors",
    name: "Fund Your Litigation: For Investors",
    icon: TrendingUp,
    description: "Investment opportunities in legal cases",
  },
  {
    id: "legal-dossier-builder",
    name: "Legal Dossier Builder",
    icon: Folder,
    description: "Organize and build comprehensive legal files",
  },
  {
    id: "case-timeline-builder",
    name: "Case and Timeline Builder",
    icon: Clock,
    description: "Create detailed case timelines and documentation",
  },
  {
    id: "litigation-funding-litigants",
    name: "Fund Your Litigation: For Litigants",
    icon: Gavel,
    description: "Get funding support for your legal case",
  },
];

interface ToolSuggestionProps {
  tools: Tool[];
  onToolSelect: (tool: Tool) => void;
  className?: string;
}

export function ToolSuggestion({
  tools,
  onToolSelect,
  className,
}: ToolSuggestionProps) {
  if (tools.length === 0) return null;

  return (
    <div className={cn("space-y-4", className)}>
      <Typography level="body" className="font-medium text-slate-gray-600">
        💡 Suggested tools for you:
      </Typography>

      <div className="space-y-3">
        {tools.map(tool => {
          const IconComponent = tool.icon;

          // Enhanced card for Red Flag Analysis
          if (tool.id === "red-flag-analysis") {
            return (
              <div key={tool.id} className="max-w-md">
                <Button
                  variant="outline"
                  onClick={() => onToolSelect(tool)}
                  className="hover:bg-sky-blue-50 h-auto w-full rounded-2xl border-sky-blue-200 bg-white p-0 transition-all hover:border-sky-blue-400"
                >
                  <div className="w-full p-4 text-left">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                        <IconComponent className="size-5 text-red-600" />
                      </div>
                      <Typography
                        level="body"
                        weight="semibold"
                        className="text-slate-gray-900"
                      >
                        {tool.name}
                      </Typography>
                    </div>
                  </div>
                </Button>
              </div>
            );
          }

          // Standard button for other tools
          return (
            <Button
              key={tool.id}
              variant="outline"
              size="lg"
              onClick={() => onToolSelect(tool)}
              className="bg-sky-blue-50 flex items-center gap-2 rounded-full border-sky-blue-300 transition-all hover:border-sky-blue-400 hover:bg-sky-blue-100"
            >
              <IconComponent className="size-4 text-sky-blue-600" />
              <Typography level="body" className="text-slate-gray-700">
                {tool.name}
              </Typography>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
