"use client";

import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Typography } from "../typography";

interface AnalysisReportButtonProps {
  reportUrl?: string;
}

export function AnalysisReportButton({ reportUrl }: AnalysisReportButtonProps) {
  const searchParams = useSearchParams();
  const toolParam = searchParams.get("tools");

  // If reportUrl is provided, open the PDF directly; otherwise use the default route
  const handleClick = () => {
    if (reportUrl) {
      window.open(reportUrl, "_blank");
    }
  };

  const content = (
    <Button
      variant="outline"
      size="lg"
      className="hover:bg-sky-blue-50 h-auto w-full justify-center rounded-2xl border-sky-blue-200 bg-white p-4 shadow-sm"
      onClick={reportUrl ? handleClick : undefined}
    >
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
          <FileText className="size-5 text-red-600" />
        </div>
        <Typography
          level="body"
          weight="semibold"
          className="text-slate-gray-900"
        >
          View Full Analysis Report
        </Typography>
      </div>
    </Button>
  );

  return (
    <div className="max-w-sm">
      {reportUrl ? (
        content
      ) : (
        <Link href={`/agent/report${toolParam ? `?tools=${toolParam}` : ""}`}>
          {content}
        </Link>
      )}
    </div>
  );
}
