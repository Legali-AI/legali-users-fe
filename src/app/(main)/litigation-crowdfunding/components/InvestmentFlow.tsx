"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CreditCard,
  Download,
  FileText,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useToast } from "@/hooks/use-toast";
import type {
  InvestmentData,
  InvestmentStep,
  LitigationCase,
} from "@/types/litigation";

interface InvestmentFlowProps {
  case: LitigationCase;
  onBack: () => void;
  onComplete: () => void;
}

export default function InvestmentFlow({
  case: caseData,
  onBack,
  onComplete,
}: InvestmentFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [investmentData, setInvestmentData] = useState<InvestmentData>({
    amount: "",
    investorNote: "",
    disclosureAcknowledged: false,
    riskAcknowledged: false,
    termsAccepted: false,
    kycConfirmed: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const steps: InvestmentStep[] = [
    {
      number: 1,
      title: "Investment Amount",
      description: "Enter your investment amount",
    },
    {
      number: 2,
      title: "Disclosures",
      description: "Review case details and risks",
    },
    { number: 3, title: "Payment", description: "Complete secure payment" },
    {
      number: 4,
      title: "Confirmation",
      description: "Investment confirmation",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateExpectedReturn = (amount: number) => {
    const minReturn = amount * (caseData.expectedReturnMin || 1.5);
    const maxReturn = amount * (caseData.expectedReturnMax || 3.0);
    return `${formatCurrency(minReturn)} - ${formatCurrency(maxReturn)}`;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (
        !investmentData.amount ||
        parseFloat(investmentData.amount) < caseData.minimumInvestment
      ) {
        toast({
          title: "Invalid Amount",
          description: `Minimum investment is ${formatCurrency(caseData.minimumInvestment)}`,
          variant: "destructive",
        });
        return;
      }
    }

    if (currentStep === 2) {
      if (
        !investmentData.disclosureAcknowledged ||
        !investmentData.riskAcknowledged ||
        !investmentData.kycConfirmed
      ) {
        toast({
          title: "Required Acknowledgments",
          description:
            "Please review and acknowledge all required disclosures.",
          variant: "destructive",
        });
        return;
      }
    }

    if (currentStep === 3) {
      if (!investmentData.termsAccepted) {
        toast({
          title: "Terms Required",
          description: "Please accept the terms and conditions to proceed.",
          variant: "destructive",
        });
        return;
      }
      handlePayment();
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep(4);
      toast({
        title: "Investment Successful",
        description: `Your investment of ${formatCurrency(parseFloat(investmentData.amount))} has been processed successfully.`,
      });
    }, 3000);
  };

  const handleBack = () => {
    if (currentStep === 1) {
      onBack();
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateInvestmentData = (updates: Partial<InvestmentData>) => {
    setInvestmentData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Investment Process
              </h1>
              <p className="text-gray-600">{caseData.title}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex-1">
                  <div className="flex items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                        currentStep >= step.number
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300 bg-white text-gray-500"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        step.number
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`mx-4 h-0.5 flex-1 ${
                          currentStep > step.number
                            ? "bg-blue-600"
                            : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {step.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Step 1: Investment Amount */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="amount"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Investment Amount *
                      </label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder={`Minimum ${formatCurrency(caseData.minimumInvestment)}`}
                        value={investmentData.amount}
                        onChange={(e) =>
                          updateInvestmentData({ amount: e.target.value })
                        }
                        className="text-lg"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Minimum investment:{" "}
                        {formatCurrency(caseData.minimumInvestment)}
                      </p>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Expected Return Range
                      </label>
                      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                        <div className="text-lg font-semibold text-green-800">
                          {investmentData.amount
                            ? calculateExpectedReturn(
                                parseFloat(investmentData.amount) || 0
                              )
                            : `${formatCurrency(caseData.minimumInvestment * caseData.expectedReturnMin)} - ${formatCurrency(caseData.minimumInvestment * caseData.expectedReturnMax)}`}
                        </div>
                        <div className="text-sm text-green-600">
                          Based on {caseData.expectedReturn} multiplier
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="note"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Investor Note (Optional)
                    </label>
                    <Textarea
                      id="note"
                      placeholder="Any comments, questions, or special instructions..."
                      value={investmentData.investorNote}
                      onChange={(e) =>
                        updateInvestmentData({ investorNote: e.target.value })
                      }
                    />
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Your investment will be held in a secure escrow account
                      until the funding goal is met.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Step 2: Disclosures */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <h3 className="mb-2 font-semibold text-blue-900">
                      Investment Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">
                          Investment Amount:
                        </span>
                        <div className="font-semibold text-blue-900">
                          {formatCurrency(parseFloat(investmentData.amount))}
                        </div>
                      </div>
                      <div>
                        <span className="text-blue-700">Expected Return:</span>
                        <div className="font-semibold text-blue-900">
                          {calculateExpectedReturn(
                            parseFloat(investmentData.amount)
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="disclosure"
                        checked={investmentData.disclosureAcknowledged}
                        onCheckedChange={(checked) =>
                          updateInvestmentData({
                            disclosureAcknowledged: !!checked,
                          })
                        }
                      />
                      <label
                        htmlFor="disclosure"
                        className="text-sm leading-relaxed"
                      >
                        I have read and understood the{" "}
                        <Button
                          variant="link"
                          className="h-auto p-0 font-normal underline"
                        >
                          investment disclosure document
                        </Button>{" "}
                        and acknowledge that I have reviewed all case details,
                        financial projections, and legal analysis.
                      </label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="risk"
                        checked={investmentData.riskAcknowledged}
                        onCheckedChange={(checked) =>
                          updateInvestmentData({ riskAcknowledged: !!checked })
                        }
                      />
                      <label htmlFor="risk" className="text-sm leading-relaxed">
                        I understand that litigation investment carries
                        significant risks, including the possibility of total
                        loss of my investment. I acknowledge this is a
                        speculative investment with no guaranteed returns.
                      </label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="kyc"
                        checked={investmentData.kycConfirmed}
                        onCheckedChange={(checked) =>
                          updateInvestmentData({ kycConfirmed: !!checked })
                        }
                      />
                      <label htmlFor="kyc" className="text-sm leading-relaxed">
                        I confirm that I have completed the required KYC (Know
                        Your Customer) verification process and that all my
                        information is accurate and up-to-date.
                      </label>
                    </div>
                  </div>

                  <Alert>
                    <FileText className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Legal Notice:</strong> By proceeding, you
                      acknowledge that you have received and reviewed all
                      required disclosures for this investment opportunity.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="rounded-lg border bg-gray-50 p-4">
                    <h3 className="mb-3 font-semibold text-gray-900">
                      Payment Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Investment Amount:</span>
                        <span className="font-medium">
                          {formatCurrency(parseFloat(investmentData.amount))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform Fee (2.5%):</span>
                        <span className="font-medium">
                          {formatCurrency(
                            parseFloat(investmentData.amount) * 0.025
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-semibold">
                        <span>Total Amount:</span>
                        <span>
                          {formatCurrency(
                            parseFloat(investmentData.amount) * 1.025
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-green-800">
                          Secure Payment
                        </span>
                      </div>
                      <p className="text-sm text-green-700">
                        Your payment is processed securely and held in escrow
                        until the case funding goal is met.
                      </p>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={investmentData.termsAccepted}
                        onCheckedChange={(checked) =>
                          updateInvestmentData({ termsAccepted: !!checked })
                        }
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm leading-relaxed"
                      >
                        I accept the{" "}
                        <Button
                          variant="link"
                          className="h-auto p-0 font-normal underline"
                        >
                          Terms of Service
                        </Button>{" "}
                        and{" "}
                        <Button
                          variant="link"
                          className="h-auto p-0 font-normal underline"
                        >
                          Investment Agreement
                        </Button>{" "}
                        for this litigation investment.
                      </label>
                    </div>
                  </div>

                  {isProcessing && (
                    <div className="py-8 text-center">
                      <div className="inline-flex items-center gap-2 text-blue-600">
                        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
                        Processing your payment...
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <div className="space-y-6 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <div>
                    <h2 className="mb-2 text-2xl font-bold text-gray-900">
                      Investment Successful!
                    </h2>
                    <p className="text-gray-600">
                      Your investment of{" "}
                      {formatCurrency(parseFloat(investmentData.amount))} has
                      been processed successfully.
                    </p>
                  </div>

                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-left">
                    <h3 className="mb-2 font-semibold text-blue-900">
                      What happens next?
                    </h3>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>
                        • You'll receive a confirmation email with your
                        investment details
                      </li>
                      <li>• Your funds are held securely in escrow</li>
                      <li>
                        • You'll receive regular updates on the case progress
                      </li>
                      <li>
                        • Returns will be distributed if the case is successful
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Download investment receipt
                        toast({
                          title: "Receipt Downloaded",
                          description:
                            "Your investment receipt has been downloaded.",
                        });
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Receipt
                    </Button>
                    <Button
                      onClick={onComplete}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Return to Cases
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          {currentStep < 4 && (
            <div className="mt-6 flex items-center justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {currentStep === 1 ? "Back to Case" : "Previous"}
              </Button>

              <Button
                onClick={handleNext}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {currentStep === 3 ? (
                  isProcessing ? (
                    "Processing..."
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Complete Payment
                    </>
                  )
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
