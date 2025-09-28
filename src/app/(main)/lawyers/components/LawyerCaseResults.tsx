import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Lawyer } from "@/types";

interface LawyerCaseResultsProps {
  lawyer: Lawyer;
}

export function LawyerCaseResults({ lawyer }: LawyerCaseResultsProps) {
  if (!lawyer.caseResults || lawyer.caseResults.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-gray-900 text-lg sm:text-xl">
          Notable Case Results
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="space-y-4">
          {lawyer.caseResults.map((result) => (
            <div
              key={result.id}
              className="border-l-4 border-blue-500 pl-3 sm:pl-4"
            >
              <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                {result.caseType} ({result.year})
              </h3>
              <p className="text-green-600 font-medium text-sm sm:text-base">
                {result.outcome}
              </p>
              <p className="text-gray-600 text-sm">{result.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
