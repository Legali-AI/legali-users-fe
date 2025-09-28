import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Lawyer } from "@/types";

interface QuickInfoProps {
  lawyer: Lawyer;
}

export function QuickInfo({ lawyer }: QuickInfoProps) {
  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-gray-900 text-base sm:text-lg">
          Quick Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm p-4 sm:p-6 pt-0">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
          <span className="text-gray-600">Response Time:</span>
          <span className="font-medium text-gray-900">Within 2 hours</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
          <span className="text-gray-600">Consultation Type:</span>
          <span className="font-medium text-gray-900 text-right sm:text-right">
            Phone, Video, In-person
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
          <span className="text-gray-600">Payment:</span>
          <span className="font-medium text-gray-900">Secure escrow</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
          <span className="text-gray-600">Member Since:</span>
          <span className="font-medium text-gray-900">
            {formatDate(lawyer.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
