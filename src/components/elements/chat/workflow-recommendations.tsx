"use client";

import { useRouter } from "next/navigation";
import type { WorkflowRecommendation } from "@/components/elements/chat/types";
import { Button } from "@/components/ui/button";
import { chatService } from "@/services/chat.service";

interface WorkflowRecommendationsProps {
  recommendations: WorkflowRecommendation[];
  onRecommendationClick?: (recommendation: WorkflowRecommendation) => void;
  disableNavigation?: boolean;
  selectedTool?: string | null;
}

export function WorkflowRecommendations({
  recommendations,
  onRecommendationClick,
  disableNavigation = false,
  selectedTool,
}: WorkflowRecommendationsProps) {
  const router = useRouter();

  const handleRecommendationClick = (recommendation: WorkflowRecommendation) => {
    if (onRecommendationClick) {
      onRecommendationClick(recommendation);
    }

    // Handle frontend routing only if navigation is not disabled
    if (!disableNavigation && recommendation.frontend_route) {
      // Build query params from frontend_params
      const params = new URLSearchParams();
      if (recommendation.frontend_params) {
        Object.entries(recommendation.frontend_params).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            params.append(key, String(value));
          }
        });
      }

      const queryString = params.toString();
      const url = `${recommendation.frontend_route}${queryString ? `?${queryString}` : ""}`;
      router.push(url);
    }
  };

  const getIconForRecommendation = (iconName: string) => {
    switch (iconName) {
      case "document":
        return "📄";
      case "analysis":
        return "🔍";
      case "lawyer":
        return "⚖️";
      case "funding":
        return "💰";
      case "timeline":
        return "📅";
      case "contract":
        return "📋";
      default:
        return "🔧";
    }
  };

  if (!recommendations.length) {
    return null;
  }

  // Filter recommendations based on selectedTool
  const filteredRecommendations = selectedTool
    ? recommendations.filter(rec => {
        const toolId = chatService.getToolIdFromActionType(rec.action_type);
        return toolId === selectedTool;
      })
    : recommendations;

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-gray-700">
        {selectedTool
          ? "Selected tool for your next message:"
          : "Recommended tools based on your conversation - click to select for your next message:"}
      </p>
      <div className="space-y-2">
        {filteredRecommendations.map(recommendation => {
          const toolId = chatService.getToolIdFromActionType(recommendation.action_type);
          const isSelected = selectedTool && toolId === selectedTool;

          return (
            <Button
              key={`${recommendation.action_type}-${recommendation.title}-${recommendation.endpoint}`}
              variant={isSelected ? "default" : "outline"}
              className={`h-auto w-full justify-start p-4 text-left ${
                isSelected
                  ? "border-sky-blue-300 bg-sky-blue-100 hover:bg-sky-blue-200"
                  : "hover:bg-sky-blue-50 hover:border-sky-blue-300"
              }`}
              onClick={() => handleRecommendationClick(recommendation)}>
              <div className="flex w-full items-start gap-3">
                <span className="text-lg" role="img" aria-label={recommendation.icon}>
                  {getIconForRecommendation(recommendation.icon)}
                </span>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-deep-navy">{recommendation.title}</h4>
                    {recommendation.confidence_score && (
                      <span className="text-xs text-slate-gray-500">
                        {Math.round(recommendation.confidence_score * 100)}% confidence
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-gray-600">{recommendation.description}</p>
                  {recommendation.estimated_time && (
                    <p className="text-xs text-slate-gray-500">⏱️ Estimated time: {recommendation.estimated_time}</p>
                  )}
                  {recommendation.case_context?.complexity_level && (
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={`rounded-full px-2 py-1 ${
                          recommendation.case_context.complexity_level === "simple"
                            ? "bg-green-100 text-green-700"
                            : recommendation.case_context.complexity_level === "moderate"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}>
                        {recommendation.case_context.complexity_level} complexity
                      </span>
                      {recommendation.case_context.urgency_level && (
                        <span
                          className={`rounded-full px-2 py-1 ${
                            recommendation.case_context.urgency_level === "low"
                              ? "bg-blue-100 text-blue-700"
                              : recommendation.case_context.urgency_level === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}>
                          {recommendation.case_context.urgency_level} urgency
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
