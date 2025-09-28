import { Clock, MapPin, Scale, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  const progressPercentage =
    (caseData.amountRaised / caseData.fundingGoal) * 100;

  return (
    <Card className="group cursor-pointer border border-gray-200 transition-all duration-300 hover:border-gray-300 hover:shadow-lg">
      <div onClick={onClick}>
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={caseData.image}
            alt={caseData.title}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <Badge
              variant="secondary"
              className={`font-medium ${riskLevels[caseData.riskLevel].color}`}
            >
              {caseData.riskLevel} Risk
            </Badge>
          </div>
          <div className="absolute top-3 left-3">
            <Badge variant="outline" className="bg-white/90 text-gray-800">
              {caseData.category}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-4">
          <CardTitle className="line-clamp-2 text-lg leading-tight font-semibold text-gray-900">
            {caseData.title}
          </CardTitle>
          <p className="mt-2 line-clamp-3 text-sm text-gray-600">
            {caseData.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Funding Progress</span>
              <span className="font-medium">
                {formatCurrency(caseData.amountRaised)} of{" "}
                {formatCurrency(caseData.fundingGoal)}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{Math.round(progressPercentage)}% funded</span>
              <span>
                {caseData.daysRemaining > 0
                  ? `${caseData.daysRemaining} days left`
                  : "Funding complete"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">
                {caseData.investorCount} investors
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{caseData.expectedReturn}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{caseData.timeframe}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{caseData.jurisdiction}</span>
            </div>
          </div>

          <div className="border-t pt-3">
            <div className="flex items-center gap-2 text-sm">
              <Scale className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{caseData.lawFirm}</span>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Lead Counsel: {caseData.leadCounsel}
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter className="pt-4">
        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            View Details
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={(e) => {
              e.stopPropagation();
              // Handle invest action
            }}
          >
            Invest Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
