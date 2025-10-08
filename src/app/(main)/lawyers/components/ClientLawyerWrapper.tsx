"use client";

import dynamic from "next/dynamic";
import type { CaseType } from "@/types";

// Dynamic imports for client-side components
const LawyerSearchInterface = dynamic(() => import("./LawyerSearchInterface"), {
  ssr: false, // This component needs client-side state management
  loading: () => (
    <div className="animate-pulse">
      <div className="mb-8 h-24 rounded bg-gray-200"></div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="h-96 rounded bg-gray-200 lg:col-span-1"></div>
        <div className="space-y-4 lg:col-span-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded bg-gray-200"></div>
          ))}
        </div>
      </div>
    </div>
  ),
});

interface ClientLawyerWrapperProps {
  caseTypeOptions: Array<{ label: string; value: CaseType; count: number }>;
  languageOptions: Array<{ label: string; value: string; count: number }>;
}

export default function ClientLawyerWrapper({ caseTypeOptions, languageOptions }: ClientLawyerWrapperProps) {
  return (
    <div className="animate-in duration-500 fade-in">
      <LawyerSearchInterface caseTypeOptions={caseTypeOptions} languageOptions={languageOptions} />
    </div>
  );
}
