"use client";

import { AlertCircle, ArrowLeft, Download, FileText, Mail, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AgentAvatar } from "@/components/elements/chat/agent-avatar";
import { H1, H2, Typography } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";

export default function AnalysisReportPage() {
  const searchParams = useSearchParams();
  const tool = searchParams.get("tools");

  return (
    <div className="to-sky-blue-50 min-h-screen bg-gradient-to-br from-sky-blue-100 via-white">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-sky-blue-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href={`/agent${tool ? `?tools=${tool}` : ""}`}>
              <Button variant="ghost" size="icon" className="hover:bg-sky-blue-100">
                <ArrowLeft className="size-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <AgentAvatar />
              <H1 level="h3" weight="semibold" className="text-deep-navy">
                Analysis Results
              </H1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        {/* Analysis Summary Card */}
        <div className="rounded-2xl border border-sky-blue-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="size-5 text-sky-blue-600" />
            <H2 level="h4" weight="semibold" className="text-slate-gray-800">
              Analysis Summary
            </H2>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Red Flags */}
            <div className="text-center">
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="size-6 text-red-600" />
              </div>
              <div className="mb-1 text-2xl font-bold text-slate-gray-900">4</div>
              <Typography level="body" className="text-slate-gray-600">
                Red Flags
              </Typography>
            </div>

            {/* Risk Status */}
            <div className="text-center">
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <AlertCircle className="size-6 text-orange-600" />
              </div>
              <div className="mb-1 text-2xl font-bold text-slate-gray-900">High Risk</div>
              <Typography level="body" className="text-slate-gray-600">
                Status
              </Typography>
            </div>

            {/* Confidence */}
            <div className="text-center">
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <TrendingUp className="size-6 text-green-600" />
              </div>
              <div className="mb-1 text-2xl font-bold text-slate-gray-900">85%</div>
              <Typography level="body" className="text-slate-gray-600">
                Confidence
              </Typography>
            </div>
          </div>
        </div>

        {/* Next Steps Card */}
        <div className="rounded-2xl border border-sky-blue-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <div className="inline-flex h-6 w-6 items-center justify-center rounded bg-yellow-100">
              <span className="text-sm text-yellow-600">⚡</span>
            </div>
            <H2 level="h4" weight="semibold" className="text-slate-gray-800">
              Next Steps
            </H2>
          </div>

          <Typography level="body" className="mb-4 text-slate-gray-600">
            Take action on these findings
          </Typography>

          <div className="space-y-3">
            {/* Review Suggested Revisions */}
            <Button
              variant="outline"
              size="lg"
              className="hover:bg-sky-blue-50 h-auto w-full justify-between border-sky-blue-200 p-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <FileText className="size-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-slate-gray-900">Review Suggested Revisions</div>
                  <Typography level="caption" className="text-slate-gray-500">
                    See AI-generated improvements with redlines
                  </Typography>
                </div>
              </div>
              <span className="text-slate-gray-400">›</span>
            </Button>

            {/* Draft Response Email */}
            <Button
              variant="outline"
              size="lg"
              className="hover:bg-sky-blue-50 h-auto w-full justify-between border-sky-blue-200 p-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <Mail className="size-5 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-slate-gray-900">Draft Response Email</div>
                  <Typography level="caption" className="text-slate-gray-500">
                    Get help writing to your employer
                  </Typography>
                </div>
              </div>
              <span className="text-slate-gray-400">›</span>
            </Button>

            {/* Download & Share Report */}
            <Button
              variant="outline"
              size="lg"
              className="hover:bg-sky-blue-50 h-auto w-full justify-between border-sky-blue-200 p-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                  <Download className="size-5 text-yellow-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-slate-gray-900">Download & Share Report</div>
                  <Typography level="caption" className="text-slate-gray-500">
                    Export analysis for your records
                  </Typography>
                </div>
              </div>
              <span className="text-slate-gray-400">›</span>
            </Button>
          </div>
        </div>

        {/* Back to Chat Button */}
        <div className="pt-4 text-center">
          <Link href={`/agent${tool ? `?tools=${tool}` : ""}`}>
            <Button variant="default" size="lg" className="bg-sky-blue-400 hover:bg-sky-blue-500">
              Continue Chat
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
