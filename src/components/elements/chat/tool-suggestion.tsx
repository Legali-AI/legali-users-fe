"use client";

import { AlertTriangle, Clock, FileText, Folder, Gavel, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

export function ToolSuggestion({ tools, onToolSelect, className }: ToolSuggestionProps) {
  if (tools.length === 0) return null;

  return (
    <div className={cn("space-y-4", className)}>
      <Typography level="body" className="font-medium text-slate-gray-600">
        💡 Suggested tools for you:
      </Typography>

      <div className="space-y-3">
        {tools.map(tool => {
          const IconComponent = tool.icon;

          // Enhanced cards for all tools
          const getToolCardConfig = (toolId: string) => {
            switch (toolId) {
              case "red-flag-analysis":
                return {
                  bgColor: "bg-red-100",
                  iconColor: "text-red-600",
                  stats: [
                    { label: "Scan", sublabel: "Red Flags" },
                    { label: "Assess", sublabel: "Risk Level" },
                    { label: "Report", sublabel: "Analysis" },
                  ],
                  description:
                    "Get comprehensive analysis of your documents with detailed red flag identification and risk assessment",
                };
              case "legal-template":
                return {
                  bgColor: "bg-blue-100",
                  iconColor: "text-blue-600",
                  stats: [
                    { label: "Browse", sublabel: "Templates" },
                    { label: "Customize", sublabel: "Content" },
                    { label: "Generate", sublabel: "Document" },
                  ],
                  description:
                    "Access professional legal document templates and customize them for your specific needs",
                };
              case "lawyers-marketplace":
                return {
                  bgColor: "bg-purple-100",
                  iconColor: "text-purple-600",
                  stats: [
                    { label: "Search", sublabel: "Lawyers" },
                    { label: "Compare", sublabel: "Profiles" },
                    { label: "Connect", sublabel: "Directly" },
                  ],
                  description:
                    "Find and connect with qualified legal professionals who specialize in your area of need",
                };
              case "litigation-funding-investors":
                return {
                  bgColor: "bg-green-100",
                  iconColor: "text-green-600",
                  stats: [
                    { label: "Evaluate", sublabel: "Cases" },
                    { label: "Fund", sublabel: "Litigation" },
                    { label: "Track", sublabel: "Returns" },
                  ],
                  description:
                    "Discover investment opportunities in legal cases and diversify your portfolio with litigation funding",
                };
              case "legal-dossier-builder":
                return {
                  bgColor: "bg-orange-100",
                  iconColor: "text-orange-600",
                  stats: [
                    { label: "Organize", sublabel: "Documents" },
                    { label: "Build", sublabel: "Timeline" },
                    { label: "Compile", sublabel: "Dossier" },
                  ],
                  description: "Create comprehensive legal dossiers with organized documents, timelines, and evidence",
                };
              case "case-timeline-builder":
                return {
                  bgColor: "bg-indigo-100",
                  iconColor: "text-indigo-600",
                  stats: [
                    { label: "Map", sublabel: "Events" },
                    { label: "Track", sublabel: "Progress" },
                    { label: "Export", sublabel: "Timeline" },
                  ],
                  description: "Build detailed case timelines to track events, deadlines, and case progression",
                };
              case "litigation-funding-litigants":
                return {
                  bgColor: "bg-teal-100",
                  iconColor: "text-teal-600",
                  stats: [
                    { label: "Apply", sublabel: "For Funding" },
                    { label: "Get", sublabel: "Approved" },
                    { label: "Pursue", sublabel: "Justice" },
                  ],
                  description:
                    "Get financial support for your legal case with litigation funding designed for plaintiffs",
                };
              default:
                return {
                  bgColor: "bg-gray-100",
                  iconColor: "text-gray-600",
                  stats: [],
                  description: tool.description || "",
                };
            }
          };

          const config = getToolCardConfig(tool.id);

          return (
            <div key={tool.id} className="max-w-md">
              <Button
                variant="outline"
                onClick={() => onToolSelect(tool)}
                className="hover:bg-sky-blue-50 h-auto w-full rounded-2xl border-sky-blue-200 bg-white p-0 transition-all hover:border-sky-blue-400">
                <div className="w-full p-4 text-left">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${config.bgColor}`}>
                      <IconComponent className={`size-5 ${config.iconColor}`} />
                    </div>
                    <Typography level="body" weight="semibold" className="text-slate-gray-900">
                      {tool.name}
                    </Typography>
                  </div>
                </div>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
