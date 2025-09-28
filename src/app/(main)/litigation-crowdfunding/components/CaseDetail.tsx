"use client";

import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Info,
  MapPin,
  Scale,
  Share2,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { LitigationCase } from "@/types/litigation";
import { riskLevels } from "../mock-data";

interface CaseDetailProps {
  case: LitigationCase;
  onBack: () => void;
  onInvestmentStart: (caseData: LitigationCase) => void;
}

export default function CaseDetail({ case: caseData, onBack, onInvestmentStart }: CaseDetailProps) {
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [investorNote, setInvestorNote] = useState("");
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const progressPercentage = (caseData.amountRaised / caseData.fundingGoal) * 100;

  const handleInvestment = () => {
    if (!investmentAmount || parseFloat(investmentAmount) < caseData.minimumInvestment) {
      toast({
        title: "Invalid Investment Amount",
        description: `Minimum investment is ${formatCurrency(caseData.minimumInvestment)}`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Investment Submitted",
      description: `Your investment of ${formatCurrency(parseFloat(investmentAmount))} has been submitted for review.`,
    });

    setShowInvestmentForm(false);
    setInvestmentAmount("");
    setInvestorNote("");
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="sticky top-16 z-40 border-b bg-white/95 shadow-sm backdrop-blur-sm sm:top-0">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button variant="ghost" onClick={onBack} className="flex h-8 items-center gap-2 px-2 sm:h-10 sm:px-3">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Cases</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">{caseData.title}</h1>
            </div>
            <div className="flex gap-1 sm:gap-2">
              <Button variant="outline" size="sm" className="h-8 px-2 sm:h-9 sm:px-3">
                <Share2 className="h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button variant="outline" size="sm" className="h-8 px-2 sm:h-9 sm:px-3">
                <Download className="h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Download Info</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="space-y-4 sm:space-y-6 lg:col-span-2">
            {/* Hero Image and Basic Info */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <div className="relative">
                <Image
                  src={caseData.image}
                  alt={caseData.title}
                  width={800}
                  height={256}
                  className="h-48 w-full rounded-t-lg object-cover sm:h-56 lg:h-64"
                />
                <div className="absolute top-3 right-3 flex gap-1.5 sm:top-4 sm:right-4 sm:gap-2">
                  <Badge variant="outline" className="bg-white/90 text-xs">
                    {caseData.category}
                  </Badge>
                  <Badge className={`${riskLevels[caseData.riskLevel].color} text-xs`}>{caseData.riskLevel} Risk</Badge>
                </div>
              </div>

              <CardContent className="p-4 sm:p-6">
                <div className="mb-4 grid grid-cols-2 gap-3 sm:mb-6 sm:gap-4 md:grid-cols-4">
                  <div className="rounded-lg bg-gray-50 p-3 text-center sm:p-4">
                    <TrendingUp className="mx-auto mb-2 h-6 w-6 text-green-600" />
                    <div className="font-semibold text-gray-900">{caseData.expectedReturn}</div>
                    <div className="text-sm text-gray-600">Expected Return</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 text-center">
                    <Clock className="mx-auto mb-2 h-6 w-6 text-blue-600" />
                    <div className="font-semibold text-gray-900">{caseData.timeframe}</div>
                    <div className="text-sm text-gray-600">Timeline</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 text-center">
                    <Users className="mx-auto mb-2 h-6 w-6 text-purple-600" />
                    <div className="font-semibold text-gray-900">{caseData.investorCount}</div>
                    <div className="text-sm text-gray-600">Investors</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 text-center">
                    <MapPin className="mx-auto mb-2 h-6 w-6 text-orange-600" />
                    <div className="font-semibold text-gray-900">{caseData.jurisdiction}</div>
                    <div className="text-sm text-gray-600">Jurisdiction</div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">Case Overview</h3>
                  <p className="leading-relaxed text-gray-700">{caseData.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Information Tabs */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="legal">Legal Team</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
                <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Case Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 font-semibold text-gray-900">Case Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Case Type:</span>
                            <span className="font-medium">{caseData.caseType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Filed Date:</span>
                            <span className="font-medium">{formatDate(caseData.filedDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Jurisdiction:</span>
                            <span className="font-medium">{caseData.jurisdiction}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <Badge variant="outline">{caseData.status}</Badge>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-2 font-semibold text-gray-900">Investment Terms</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Minimum Investment:</span>
                            <span className="font-medium">{formatCurrency(caseData.minimumInvestment)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Expected Return:</span>
                            <span className="font-medium text-green-600">{caseData.expectedReturn}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Risk Level:</span>
                            <Badge className={riskLevels[caseData.riskLevel].color}>{caseData.riskLevel}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Timeline:</span>
                            <span className="font-medium">{caseData.timeframe}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="mb-3 font-semibold text-gray-900">Key Success Factors</h4>
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        {caseData.keyFactors.map((factor, index) => (
                          <div
                            key={`factor-${factor.slice(0, 10)}-${index}`}
                            className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                            <span>{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="legal" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5" />
                      Legal Team
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100">
                          <Scale className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{caseData.lawFirm}</h3>
                          <p className="mb-2 text-sm text-gray-600">Lead Law Firm</p>
                          <div className="space-y-1 text-sm">
                            <div>
                              <span className="font-medium">Lead Counsel:</span> {caseData.leadCounsel}
                            </div>
                            <div>
                              <span className="font-medium">Experience:</span> {caseData.counselExperience}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        All legal teams on Legali are vetted for experience, track record, and good standing with their
                        respective bar associations.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="updates" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Case Updates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {caseData.updates.map((update, index) => (
                        <div key={index} className="flex gap-4 border-b pb-6 last:border-b-0 last:pb-0">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="mb-2 flex items-center justify-between">
                              <h4 className="font-semibold text-gray-900">{update.title}</h4>
                              <span className="text-sm text-gray-500">{formatDate(update.date)}</span>
                            </div>
                            <p className="text-sm text-gray-700">{update.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="risks" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Risk Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                      <h4 className="mb-2 font-semibold text-yellow-800">Risk Level: {caseData.riskLevel}</h4>
                      <p className="text-sm text-yellow-700">
                        This case has been assessed as having {caseData.riskLevel.toLowerCase()} risk based on various
                        factors including legal precedents, evidence strength, and market conditions.
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-3 font-semibold text-gray-900">Potential Risk Factors</h4>
                      <div className="space-y-2">
                        {caseData.risks.map((risk, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
                            <span>{risk}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Investment Risk:</strong> All litigation investments carry inherent risks. Past
                        performance does not guarantee future results. Please read all disclosure documents carefully
                        before investing.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Investment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Investment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Funding Progress</span>
                    <span className="font-medium">
                      {formatCurrency(caseData.amountRaised)} of {formatCurrency(caseData.fundingGoal)}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{Math.round(progressPercentage)}% funded</span>
                    <span>
                      {caseData.daysRemaining > 0 ? `${caseData.daysRemaining} days left` : "Funding complete"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Minimum Investment:</span>
                    <span className="font-medium">{formatCurrency(caseData.minimumInvestment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Return:</span>
                    <span className="font-medium text-green-600">{caseData.expectedReturn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Investors:</span>
                    <span className="font-medium">{caseData.investorCount}</span>
                  </div>
                </div>

                {!showInvestmentForm ? (
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => onInvestmentStart(caseData)}>
                    Start Investment Process
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="amount" className="mb-1 block text-sm font-medium text-gray-700">
                        Investment Amount
                      </label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder={`Min. ${formatCurrency(caseData.minimumInvestment)}`}
                        value={investmentAmount}
                        onChange={e => setInvestmentAmount(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="note" className="mb-1 block text-sm font-medium text-gray-700">
                        Investor Note (Optional)
                      </label>
                      <Textarea
                        id="note"
                        placeholder="Any comments or questions..."
                        value={investorNote}
                        onChange={e => setInvestorNote(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setShowInvestmentForm(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleInvestment}>
                        Invest
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Filed Date:</span>
                  <span className="font-medium">{formatDate(caseData.filedDate)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last Update:</span>
                  <span className="font-medium">{formatDate(caseData.lastUpdate)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Case Stage:</span>
                  <Badge variant="outline">{caseData.fundingStage}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">KYC Required:</span>
                  <span className="font-medium">{caseData.kycRequired ? "Yes" : "No"}</span>
                </div>
              </CardContent>
            </Card>

            {/* Disclosure */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> This is a speculative investment with inherent risks. Please read all
                disclosures before investing.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}
