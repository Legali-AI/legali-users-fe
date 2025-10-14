import { ArrowRight, MapPin, Star, Wallet } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { MarketplaceLawyer } from "@/types";

interface LawyerCardProps {
  lawyer: MarketplaceLawyer;
  variant?: "default" | "featured" | "compact";
  showFullDetails?: boolean;
}

export function LawyerCard({ lawyer, variant = "default", showFullDetails = false }: LawyerCardProps) {
  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";
  const ratingLabel = lawyer.avgRating > 0 ? lawyer.avgRating.toFixed(1) : "New";
  const reviewsLabel =
    lawyer.totalReview > 0 ? `(${lawyer.totalReview} review${lawyer.totalReview > 1 ? "s" : ""})` : "(No reviews yet)";
  const minPrice = formatCurrency(lawyer.minPrice);
  const priceDisplay =
    lawyer.maxPrice && lawyer.maxPrice !== lawyer.minPrice
      ? `${minPrice} – ${formatCurrency(lawyer.maxPrice)}`
      : minPrice;
  const practiceAreas = lawyer.practiceAreas.length > 0 ? lawyer.practiceAreas : ["General Practice"];

  return (
    <Card className="group relative overflow-hidden border border-blue-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400" />

      <CardHeader className="pb-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className={`${isFeatured ? "text-xl" : "text-lg"} font-semibold text-gray-900`}>
                  {lawyer.name}
                </CardTitle>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                    <Star className="mr-1 h-3.5 w-3.5 text-yellow-400" />
                    {ratingLabel}
                    <span className="ml-1 text-blue-500">{reviewsLabel}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    <MapPin className="h-3.5 w-3.5 text-slate-500" />
                    {lawyer.city || "Available nationwide"}
                  </span>
                </div>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-blue-50 via-white to-white px-4 py-3 text-right shadow-inner">
                <div className="text-xs uppercase tracking-wide text-slate-500">Budget range</div>
                <div className={`${isFeatured ? "text-2xl" : "text-xl"} font-bold text-gray-900`}>{priceDisplay}</div>
                <div className="mt-1 flex items-center justify-end text-xs font-medium text-blue-600">
                  <Wallet className="mr-1 h-3.5 w-3.5 text-blue-500" />
                  Flexible payment
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-5 pt-6">
        <div className="flex flex-wrap gap-2">
          {practiceAreas.slice(0, isCompact ? 2 : 3).map(area => (
            <span
              key={area}
              className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {area}
            </span>
          ))}
          {practiceAreas.length > (isCompact ? 2 : 3) && (
            <span className="inline-flex items-center rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-medium text-slate-600">
              +{practiceAreas.length - (isCompact ? 2 : 3)} more
            </span>
          )}
        </div>

        {!isCompact && lawyer.about && (
          <p className="line-clamp-3 text-sm leading-relaxed text-slate-700">{lawyer.about}</p>
        )}

        {showFullDetails && (
          <p className="text-sm text-slate-500">
            Serving clients in <span className="font-medium text-gray-900">{lawyer.city || "multiple regions"}</span>
          </p>
        )}

        <div className="flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
              Trusted on Legali
            </div>
          </div>
          <Link href={`/lawyers/${lawyer.id}`} className="inline-flex">
            <Button
              size={isFeatured ? "lg" : "sm"}
              className="group/button relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-500 hover:via-blue-400 hover:to-sky-400">
              <span className="mr-2">View Profile</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/button:translate-x-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
