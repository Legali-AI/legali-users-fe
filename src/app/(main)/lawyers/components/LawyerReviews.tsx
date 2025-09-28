import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface Review {
  id: string;
  rating: number;
  comment: string;
  clientName: string;
  isAnonymous: boolean;
  caseType: string;
  date: string;
  verificationStatus: string;
}

interface LawyerReviewsProps {
  reviews: Review[] | undefined;
  isLoading: boolean;
}

export function LawyerReviews({ reviews, isLoading }: LawyerReviewsProps) {
  return (
    <Card className="border border-gray-100 bg-white shadow-sm">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg text-gray-900 sm:text-xl">Client Reviews</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }, () => (
              <div key={`review-skeleton-${Math.random().toString(36).substr(2, 9)}`} className="animate-pulse">
                <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="mb-1 h-3 w-full rounded bg-gray-200"></div>
                <div className="h-3 w-2/3 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-0">
                  <div className="flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-0 sm:space-x-2">
                      <span className="text-sm font-medium text-gray-900 sm:text-base">
                        {review.isAnonymous ? "Anonymous Client" : review.clientName}
                      </span>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={`review-${review.id || "unknown"}-star-${i}`}
                            className={`h-4 w-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {review.caseType} • {formatDate(review.date)}
                    </p>
                  </div>
                  {review.verificationStatus === "verified" && (
                    <span className="w-fit rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">Verified</span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-gray-700 sm:text-base">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600 sm:text-base">No reviews available yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
