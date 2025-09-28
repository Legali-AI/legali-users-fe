import { ArrowRight, Clock, MapPin, Shield, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Lawyer } from "@/types";

interface LawyerCardProps {
  lawyer: Lawyer;
  variant?: "default" | "featured" | "compact";
  showFullDetails?: boolean;
}

export function LawyerCard({ lawyer, variant = "default", showFullDetails = false }: LawyerCardProps) {
  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";

  return (
    <Card className="border border-gray-100 bg-white transition-all duration-200 hover:border-gray-200 hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center space-x-2">
              <CardTitle className={`${isFeatured ? "text-xl" : "text-lg"} text-gray-900`}>{lawyer.name}</CardTitle>
              {lawyer.verificationStatus === "verified" && <Shield className="h-5 w-5 text-green-600" />}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-700">
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 text-yellow-500" />
                <span className="font-medium text-gray-900">{lawyer.rating}</span>
                <span className="ml-1 text-gray-600">({lawyer.reviewCount})</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="mr-1 h-4 w-4" />
                <span>{lawyer.experience}+ years</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`${isFeatured ? "text-2xl" : "text-xl"} font-bold text-gray-900`}>
              {formatCurrency(lawyer.hourlyRate)}
            </div>
            <div className="text-sm text-gray-600">per hour</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Specialties */}
          <div>
            {showFullDetails && <p className="mb-1 text-sm font-medium text-gray-900">Specialties:</p>}
            <div className="mb-2 flex flex-wrap gap-1">
              {lawyer.specialties.slice(0, isCompact ? 2 : 3).map(specialty => (
                <span
                  key={specialty}
                  className="inline-block rounded-full border border-blue-100 bg-blue-50 px-2 py-1 text-xs text-blue-700">
                  {specialty}
                </span>
              ))}
              {lawyer.specialties.length > (isCompact ? 2 : 3) && (
                <span className="inline-block rounded-full border border-gray-100 bg-gray-50 px-2 py-1 text-xs text-gray-700">
                  +{lawyer.specialties.length - (isCompact ? 2 : 3)} more
                </span>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-sm text-gray-700">
            <MapPin className="mr-1 h-4 w-4 text-gray-500" />
            <span>{lawyer.jurisdiction.join(", ")}</span>
          </div>

          {/* Bio (only if not compact) */}
          {!isCompact && <p className="line-clamp-2 text-sm leading-relaxed text-gray-700">{lawyer.bio}</p>}

          {/* Languages (only for featured cards with full details) */}
          {showFullDetails && (
            <div>
              <p className="mb-1 text-sm font-medium text-gray-900">Languages:</p>
              <p className="text-sm text-gray-700">{lawyer.languages.join(", ")}</p>
            </div>
          )}

          {/* Footer with availability and action */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  lawyer.availability === "available"
                    ? "bg-green-500"
                    : lawyer.availability === "busy"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}></div>
              <span className="text-xs font-medium text-gray-600 capitalize">{lawyer.availability}</span>
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
