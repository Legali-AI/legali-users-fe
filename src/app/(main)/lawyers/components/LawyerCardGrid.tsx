import type { Lawyer } from "@/types";
import { LawyerCard } from "./LawyerCard";

interface LawyerCardGridProps {
  lawyers: Lawyer[];
  variant?: "default" | "featured" | "compact";
  showFullDetails?: boolean;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  isLoading?: boolean;
  emptyState?: {
    title: string;
    description: string;
    action?: React.ReactNode;
  };
}

export function LawyerCardGrid({
  lawyers,
  variant = "default",
  showFullDetails = false,
  columns = { md: 2, lg: 3 },
  isLoading = false,
  emptyState,
}: LawyerCardGridProps) {
  // Generate grid classes based on columns prop using static classes
  const getGridClasses = () => {
    const baseClasses = "grid gap-6";

    // Static class mappings for each breakpoint
    const smClass =
      columns.sm === 2
        ? "grid-cols-2"
        : columns.sm === 3
          ? "grid-cols-3"
          : columns.sm === 4
            ? "grid-cols-4"
            : "grid-cols-1";
    const mdClass =
      columns.md === 1
        ? "md:grid-cols-1"
        : columns.md === 2
          ? "md:grid-cols-2"
          : columns.md === 3
            ? "md:grid-cols-3"
            : columns.md === 4
              ? "md:grid-cols-4"
              : "";
    const lgClass =
      columns.lg === 1
        ? "lg:grid-cols-1"
        : columns.lg === 2
          ? "lg:grid-cols-2"
          : columns.lg === 3
            ? "lg:grid-cols-3"
            : columns.lg === 4
              ? "lg:grid-cols-4"
              : "";
    const xlClass =
      columns.xl === 1
        ? "xl:grid-cols-1"
        : columns.xl === 2
          ? "xl:grid-cols-2"
          : columns.xl === 3
            ? "xl:grid-cols-3"
            : columns.xl === 4
              ? "xl:grid-cols-4"
              : "";

    return [baseClasses, smClass, mdClass, lgClass, xlClass]
      .filter(Boolean)
      .join(" ");
  };

  // Loading skeleton
  if (isLoading) {
    const skeletonCount = variant === "featured" ? 3 : 6;
    return (
      <div className={getGridClasses()}>
        {Array.from({ length: skeletonCount }, () => (
          <div
            key={`${variant}-skeleton-${skeletonCount}-${Math.random().toString(36).substr(2, 9)}`}
            className="animate-pulse rounded-lg border border-gray-100 bg-white p-6"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 h-6 w-3/4 rounded bg-gray-200"></div>
                <div className="h-4 w-1/2 rounded bg-gray-200"></div>
              </div>
              <div className="h-8 w-16 rounded bg-gray-200"></div>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="h-6 w-16 rounded-full bg-gray-200"></div>
                <div className="h-6 w-20 rounded-full bg-gray-200"></div>
              </div>
              <div className="h-4 rounded bg-gray-200"></div>
              <div className="h-4 w-5/6 rounded bg-gray-200"></div>
              <div className="flex items-center justify-between pt-2">
                <div className="h-4 w-20 rounded bg-gray-200"></div>
                <div className="h-8 w-24 rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!lawyers || lawyers.length === 0) {
    if (emptyState) {
      return (
        <div className="py-12 text-center">
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            {emptyState.title}
          </h3>
          <p className="mb-4 text-gray-600">{emptyState.description}</p>
          {emptyState.action}
        </div>
      );
    }
    return (
      <div className="py-12 text-center">
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No lawyers found
        </h3>
        <p className="text-gray-600">
          Try adjusting your search criteria or removing some filters.
        </p>
      </div>
    );
  }

  // Lawyer cards grid
  return (
    <div className={getGridClasses()}>
      {lawyers.map((lawyer) => (
        <LawyerCard
          key={lawyer.id}
          lawyer={lawyer}
          variant={variant}
          showFullDetails={showFullDetails}
        />
      ))}
    </div>
  );
}
