"use client";

import { AlertCircle, ArrowLeft, Download, FileText, Mail, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AgentAvatar } from "@/components/elements/chat/agent-avatar";
import { H1, H2, Typography } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";

export function AnalysisReportContent() {
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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-sky-blue-200 hover:bg-sky-blue-50">
              <Download className="size-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Analysis Summary Card */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-red-200 bg-white shadow-lg">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="size-8 text-red-600" />
                </div>
                <div>
                  <H1 level="h2" weight="bold" className="text-red-800">
                    HIGH RISK DETECTED
                  </H1>
                  <Typography className="text-red-700">We found 4 red flags in your employment agreement</Typography>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-red-700">85%</div>
                <Typography className="text-red-600">Risk Score</Typography>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <H2 weight="semibold" className="text-deep-navy">
                  Issues Found
                </H2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-lg bg-red-50 p-3">
                    <AlertCircle className="size-5 text-red-600" />
                    <div>
                      <Typography weight="medium" className="text-red-800">
                        Overly Broad Non-Compete Clause
                      </Typography>
                      <Typography className="text-sm text-red-600">
                        Restricts employment for 2 years across entire industry
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-orange-50 p-3">
                    <AlertCircle className="size-5 text-orange-600" />
                    <div>
                      <Typography weight="medium" className="text-orange-800">
                        Unclear Termination Terms
                      </Typography>
                      <Typography className="text-sm text-orange-600">
                        Vague language around termination conditions
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-red-50 p-3">
                    <AlertCircle className="size-5 text-red-600" />
                    <div>
                      <Typography weight="medium" className="text-red-800">
                        Overtime Pay Issues
                      </Typography>
                      <Typography className="text-sm text-red-600">No clear overtime compensation structure</Typography>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-orange-50 p-3">
                    <AlertCircle className="size-5 text-orange-600" />
                    <div>
                      <Typography weight="medium" className="text-orange-800">
                        IP Rights Ambiguity
                      </Typography>
                      <Typography className="text-sm text-orange-600">
                        Unclear intellectual property ownership terms
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <H2 weight="semibold" className="text-deep-navy">
                  Risk Assessment
                </H2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Typography>Legal Compliance</Typography>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 rounded-full bg-gray-200">
                        <div className="h-2 w-3/4 rounded-full bg-orange-500"></div>
                      </div>
                      <Typography className="text-sm text-orange-600">75%</Typography>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Typography>Employee Protection</Typography>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 rounded-full bg-gray-200">
                        <div className="h-2 w-1/2 rounded-full bg-red-500"></div>
                      </div>
                      <Typography className="text-sm text-red-600">50%</Typography>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Typography>Fair Compensation</Typography>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 rounded-full bg-gray-200">
                        <div className="h-2 w-1/3 rounded-full bg-red-500"></div>
                      </div>
                      <Typography className="text-sm text-red-600">40%</Typography>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Typography>Contract Clarity</Typography>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 rounded-full bg-gray-200">
                        <div className="h-2 w-3/5 rounded-full bg-orange-500"></div>
                      </div>
                      <Typography className="text-sm text-orange-600">60%</Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-sky-blue-200 bg-white shadow-lg">
          <div className="bg-gradient-to-r from-sky-blue-50 to-blue-50 px-6 py-4">
            <H2 weight="semibold" className="text-deep-navy">
              Recommended Next Steps
            </H2>
          </div>
          <div className="p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-sky-blue-200 bg-sky-blue-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-sky-blue-100">
                    <FileText className="size-5 text-sky-blue-600" />
                  </div>
                  <div>
                    <Typography weight="semibold" className="text-deep-navy">
                      Legal Review Required
                    </Typography>
                    <Typography className="text-sm text-slate-gray-600">Consult with an employment attorney</Typography>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-green-100">
                    <Mail className="size-5 text-green-600" />
                  </div>
                  <div>
                    <Typography weight="semibold" className="text-deep-navy">
                      Negotiate Terms
                    </Typography>
                    <Typography className="text-sm text-slate-gray-600">
                      Request modifications to problematic clauses
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-purple-100">
                    <TrendingUp className="size-5 text-purple-600" />
                  </div>
                  <div>
                    <Typography weight="semibold" className="text-deep-navy">
                      Market Research
                    </Typography>
                    <Typography className="text-sm text-slate-gray-600">Compare with industry standards</Typography>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-orange-100">
                    <AlertCircle className="size-5 text-orange-600" />
                  </div>
                  <div>
                    <Typography weight="semibold" className="text-deep-navy">
                      Document Everything
                    </Typography>
                    <Typography className="text-sm text-slate-gray-600">Keep records of all communications</Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
