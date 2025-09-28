import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Lawyer } from "@/types";

interface LawyerAboutProps {
  lawyer: Lawyer;
}

export function LawyerAbout({ lawyer }: LawyerAboutProps) {
  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-gray-900 text-lg sm:text-xl">About</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{lawyer.bio}</p>
      </CardContent>
    </Card>
  );
}
