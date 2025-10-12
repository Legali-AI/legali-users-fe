"use client";

import { Suspense } from "react";
import { AnalysisReportContent } from "@/components/elements/chat/analysis-report-content";

// Loading component for Suspense fallback
function AnalysisReportLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="size-8 animate-spin rounded-full border-2 border-sky-blue-200 border-t-sky-blue-600" />
        <p className="text-slate-gray-600">Loading Analysis Report...</p>
      </div>
    </div>
  );
}

export default function AnalysisReportPage() {
  return (
    <Suspense fallback={<AnalysisReportLoading />}>
      <AnalysisReportContent />
    </Suspense>
  );
}
