import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Lawyer } from "@/types";
import { Award, Languages } from "lucide-react";

interface LawyerCredentialsProps {
  lawyer: Lawyer;
}

export function LawyerCredentials({ lawyer }: LawyerCredentialsProps) {
  return (
    <Card className="border border-gray-100 bg-white shadow-sm">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg text-gray-900 sm:text-xl">Credentials & Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0 sm:space-y-6 sm:p-6">
        <div>
          <h3 className="mb-2 flex items-center text-sm font-medium text-gray-900 sm:text-base">
            <Award className="mr-2 h-4 w-4 flex-shrink-0" />
            Education & Credentials
          </h3>
          <div className="space-y-3">
            {lawyer.educations.length > 0 && (
              <div>
                <h4 className="mb-1 text-xs font-medium text-gray-600 uppercase tracking-wide">Education</h4>
                <ul className="space-y-1">
                  {lawyer.educations.map(education => (
                    <li key={education} className="text-sm text-gray-700 sm:text-base">
                      • {education}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {lawyer.credentials.length > 0 && (
              <div>
                <h4 className="mb-1 text-xs font-medium text-gray-600 uppercase tracking-wide">Credentials</h4>
                <ul className="space-y-1">
                  {lawyer.credentials.map(credential => (
                    <li key={credential} className="text-sm text-gray-700 sm:text-base">
                      • {credential}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-2 flex items-center text-sm font-medium text-gray-900 sm:text-base">
            <Languages className="mr-2 h-4 w-4 flex-shrink-0" />
            Languages
          </h3>
          <p className="text-sm text-gray-700 sm:text-base">{lawyer.languages.join(", ")}</p>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-900 sm:text-base">Jurisdiction</h3>
          <p className="text-sm text-gray-700 sm:text-base">{lawyer.jurisdiction.join(", ")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
