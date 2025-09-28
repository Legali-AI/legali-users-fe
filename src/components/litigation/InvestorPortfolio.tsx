"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LitigationCase } from "@/types/litigation";

interface InvestorPortfolioProps {
  investments: Array<{
    case: LitigationCase;
    investmentAmount: number;
    investmentDate: string;
    status: "Active" | "Settled" | "Lost";
    currentValue?: number;
    expectedReturn?: number;
  }>;
}

export default function InvestorPortfolio({
  investments,
}: InvestorPortfolioProps) {
  const totalInvested = investments.reduce(
    (sum, inv) => sum + inv.investmentAmount,
    0
  );
  const totalCurrentValue = investments.reduce(
    (sum, inv) => sum + (inv.currentValue || inv.investmentAmount),
    0
  );
  const totalExpectedReturns = investments.reduce(
    (sum, inv) => sum + (inv.expectedReturn || 0),
    0
  );
  const activeInvestments = investments.filter(
    (inv) => inv.status === "Active"
  ).length;
  const settledInvestments = investments.filter(
    (inv) => inv.status === "Settled"
  ).length;

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
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Investment Portfolio
          </h1>
          <p className="text-gray-600">
            Track your litigation investments and returns
          </p>
        </div>

        {/* Portfolio Overview Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Invested
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalInvested)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {investments.length} cases
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Value
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalCurrentValue)}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalCurrentValue >= totalInvested ? (
                  <span className="flex items-center text-green-600">
                    <ArrowUpRight className="mr-1 h-3 w-3" />+
                    {(
                      ((totalCurrentValue - totalInvested) / totalInvested) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                ) : (
                  <span className="flex items-center text-red-600">
                    <ArrowDownRight className="mr-1 h-3 w-3" />-
                    {(
                      ((totalInvested - totalCurrentValue) / totalInvested) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Cases
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeInvestments}</div>
              <p className="text-xs text-muted-foreground">
                {settledInvestments} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Expected Returns
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalExpectedReturns)}
              </div>
              <p className="text-xs text-muted-foreground">
                Projected total returns
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Investment List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {investments.map((investment, index) => {
                const progressPercentage =
                  (investment.case.amountRaised / investment.case.fundingGoal) *
                  100;

                return (
                  <div
                    key={index}
                    className="rounded-lg border p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="line-clamp-1 font-semibold text-gray-900">
                            {investment.case.title}
                          </h3>
                          <Badge
                            variant={
                              investment.status === "Active"
                                ? "default"
                                : investment.status === "Settled"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {investment.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                          <div>
                            <span className="text-gray-500">Invested:</span>
                            <div className="font-medium">
                              {formatCurrency(investment.investmentAmount)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Date:</span>
                            <div className="font-medium">
                              {formatDate(investment.investmentDate)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">
                              Case Progress:
                            </span>
                            <div className="font-medium">
                              {Math.round(progressPercentage)}% funded
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">
                              Expected Return:
                            </span>
                            <div className="font-medium text-green-600">
                              {investment.expectedReturn
                                ? formatCurrency(investment.expectedReturn)
                                : investment.case.expectedReturn}
                            </div>
                          </div>
                        </div>

                        {investment.status === "Active" && (
                          <div className="mt-3">
                            <Progress
                              value={progressPercentage}
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {investments.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                <p>
                  No investments yet. Start investing in legal cases to track
                  your portfolio here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
