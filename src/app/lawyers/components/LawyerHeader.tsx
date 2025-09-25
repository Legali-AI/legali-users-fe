import { Clock, MapPin, Shield, Star } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Lawyer } from "@/types";

interface LawyerHeaderProps {
  lawyer: Lawyer;
}

export function LawyerHeader({ lawyer }: LawyerHeaderProps) {
  return (
    <Card className="border border-gray-100 bg-white shadow-sm">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:space-x-3">
              <CardTitle className="text-xl text-gray-900 sm:text-2xl">
                {lawyer.name}
              </CardTitle>
              {lawyer.verificationStatus === "verified" && (
                <div className="mt-1 flex w-fit items-center space-x-1 rounded-full border border-green-100 bg-green-50 px-2 py-1 text-sm text-green-700 sm:mt-0">
                  <Shield className="h-4 w-4" />
                  <span>Verified</span>
                </div>
              )}
            </div>
            <div className="mb-4 flex flex-col gap-2 text-sm text-gray-700 sm:flex-row sm:items-center sm:gap-0 sm:space-x-6">
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 text-yellow-500" />
                <span className="font-medium text-gray-900">
                  {lawyer.rating}
                </span>
                <span className="ml-1 text-gray-600">
                  ({lawyer.reviewCount} reviews)
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="mr-1 h-4 w-4" />
                <span>{lawyer.experience}+ years experience</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="mr-1 h-4 w-4" />
                <span>{lawyer.jurisdiction.join(", ")}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {lawyer.specialties.map((specialty) => (
                <span
                  key={`${lawyer.id}-specialty-${specialty}`}
                  className="inline-block rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm text-blue-700"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
          <div className="border-t pt-4 text-left sm:border-t-0 sm:pt-0 sm:text-right">
            <div className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {formatCurrency(lawyer.hourlyRate)}
            </div>
            <div className="text-sm text-gray-600">per hour</div>
            <div
              className={`mt-2 inline-flex items-center rounded-full border px-2 py-1 text-xs ${
                lawyer.availability === "available"
                  ? "border-green-100 bg-green-50 text-green-700"
                  : lawyer.availability === "busy"
                    ? "border-yellow-100 bg-yellow-50 text-yellow-700"
                    : "border-red-100 bg-red-50 text-red-700"
              }`}
            >
              <div
                className={`mr-1 h-2 w-2 rounded-full ${
                  lawyer.availability === "available"
                    ? "bg-green-500"
                    : lawyer.availability === "busy"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              ></div>
              {lawyer.availability === "available"
                ? "Available"
                : lawyer.availability === "busy"
                  ? "Busy"
                  : "Offline"}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
