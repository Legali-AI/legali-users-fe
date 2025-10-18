import { Clock, MapPin, Scale, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LitigationCase } from "@/types/litigation";
import { riskLevels } from "../mock-data";

interface CaseCardProps {
  case: LitigationCase;
  onClick: () => void;
}

export default function CaseCard({ case: caseData, onClick }: CaseCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const progressPercentage = (caseData.amountRaised / caseData.fundingGoal) * 100;

  return (
    <Card className="group cursor-pointer border border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:bg-white/90 hover:shadow-lg">
      <div
        onClick={onClick}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
        role="button"
        tabIndex={0}>
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={caseData.image}
            alt={caseData.title}
            width={400}
            height={192}
            className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-48"
          />
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
            <Badge variant="secondary" className={`text-xs font-medium ${riskLevels[caseData.riskLevel].color}`}>
              {caseData.riskLevel} Risk
            </Badge>
          </div>
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <Badge variant="outline" className="bg-white/90 text-xs text-gray-800">
              {caseData.category}
            </Badge>
          </div>
        </div>

        <CardHeader className="px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
          <CardTitle className="line-clamp-2 text-base leading-tight font-semibold text-gray-900 sm:text-lg">
            {caseData.title}
          </CardTitle>
          <p className="mt-2 line-clamp-3 text-xs text-gray-600 sm:text-sm">{caseData.description}</p>
        </CardHeader>

        <CardContent className="space-y-3 px-4 sm:space-y-4 sm:px-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Funding Progress</span>
              <span className="font-medium">
                <span className="sm:hidden">{formatCurrency(caseData.amountRaised)}</span>
                <span className="hidden sm:inline">
                  {formatCurrency(caseData.amountRaised)} of {formatCurrency(caseData.fundingGoal)}
                </span>
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{Math.round(progressPercentage)}% funded</span>
              <span>{caseData.daysRemaining > 0 ? `${caseData.daysRemaining} days left` : "Funding complete"}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 sm:gap-4">
            <div className="flex items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
              <Users className="h-3 w-3 flex-shrink-0 text-gray-500 sm:h-4 sm:w-4" />
              <span className="truncate text-gray-600">{caseData.investorCount} investors</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
              <TrendingUp className="h-3 w-3 flex-shrink-0 text-gray-500 sm:h-4 sm:w-4" />
              <span className="truncate text-gray-600">{caseData.expectedReturn}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
              <Clock className="h-3 w-3 flex-shrink-0 text-gray-500 sm:h-4 sm:w-4" />
              <span className="truncate text-gray-600">{caseData.timeframe}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
              <MapPin className="h-3 w-3 flex-shrink-0 text-gray-500 sm:h-4 sm:w-4" />
              <span className="truncate text-gray-600">{caseData.jurisdiction}</span>
            </div>
          </div>

          <div className="border-t pt-2 sm:pt-3">
            <div className="flex items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
              <Scale className="h-3 w-3 flex-shrink-0 text-gray-500 sm:h-4 sm:w-4" />
              <span className="truncate text-gray-600">{caseData.lawFirm}</span>
            </div>
            <div className="mt-1 truncate text-xs text-gray-500">Lead Counsel: {caseData.leadCounsel}</div>
          </div>
        </CardContent>
      </div>

      <CardFooter className="px-4 pt-3 pb-4 sm:px-6 sm:pt-4 sm:pb-6">
        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 flex-1 text-xs sm:h-9 sm:text-sm"
            onClick={e => {
              e.stopPropagation();
              onClick();
            }}>
            View Details
          </Button>
          <Button
            size="sm"
            className="h-8 flex-1 bg-sky-600 text-xs hover:bg-sky-700 sm:h-9 sm:text-sm"
            onClick={e => {
              e.stopPropagation();
              // Handle invest action
            }}>
            Invest Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
