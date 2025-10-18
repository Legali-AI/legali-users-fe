import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { ApiLawyer } from "@/types";
import { ArrowRight, MapPin, Star } from "lucide-react";
import Link from "next/link";

interface ApiLawyerCardProps {
  lawyer: ApiLawyer;
  variant?: "default" | "featured" | "compact";
  showFullDetails?: boolean;
}

export function ApiLawyerCard({ lawyer, variant = "default", showFullDetails = false }: ApiLawyerCardProps) {
  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";
  const rating = parseFloat(lawyer.avg_rating);
  const priceRange = `${formatCurrency(lawyer.min_price)} - ${formatCurrency(lawyer.max_price)}`;

  return (
    <Card className="border border-gray-100 bg-white transition-all duration-200 hover:border-gray-200 hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center space-x-2">
              <CardTitle className={`${isFeatured ? "text-xl" : "text-lg"} text-gray-900`}>{lawyer.name}</CardTitle>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-700">
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 text-yellow-500" />
                <span className="font-medium text-gray-900">{rating.toFixed(1)}</span>
                <span className="ml-1 text-gray-600">({lawyer.total_review})</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="mr-1 h-4 w-4" />
                <span>{lawyer.city}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`${isFeatured ? "text-lg" : "text-base"} font-bold text-gray-900`}>
              {priceRange}
            </div>
            <div className="text-sm text-gray-600">per hour</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Practice Areas */}
          <div>
            {showFullDetails && <p className="mb-1 text-sm font-medium text-gray-900">Practice Areas:</p>}
            <div className="mb-2 flex flex-wrap gap-1">
              {lawyer.practice_area.slice(0, isCompact ? 2 : 3).map(area => (
                <span
                  key={area}
                  className="inline-block rounded-full border border-blue-100 bg-blue-50 px-2 py-1 text-xs text-blue-700">
                  {area}
                </span>
              ))}
              {lawyer.practice_area.length > (isCompact ? 2 : 3) && (
                <span className="inline-block rounded-full border border-gray-100 bg-gray-50 px-2 py-1 text-xs text-gray-700">
                  +{lawyer.practice_area.length - (isCompact ? 2 : 3)} more
                </span>
              )}
            </div>
          </div>

          {/* Bio (only if not compact) */}
          {!isCompact && (
            <p className="line-clamp-2 text-sm leading-relaxed text-gray-700">{lawyer.about}</p>
          )}

          {/* Footer with action */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-xs font-medium text-gray-600 capitalize">Available</span>
            </div>
            <Link href={`/lawyers/${lawyer.id}`}>
              <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                {isFeatured ? (
                  <>
                    View Profile & Book
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "View Profile"
                )}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
