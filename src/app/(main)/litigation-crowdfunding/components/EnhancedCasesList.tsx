"use client";

import { AlertCircle, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CaseStats, LitigationCase } from "@/types/litigation";
import {
  fundingStages,
  mockCases,
  practiceAreas,
  returnRanges,
  riskLevels,
} from "../mock-data";
import CaseCard from "./CaseCard";

interface EnhancedCasesListProps {
  onCaseSelect: (caseItem: LitigationCase) => void;
}

export default function EnhancedCasesList({
  onCaseSelect,
}: EnhancedCasesListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPracticeArea, setSelectedPracticeArea] =
    useState("All Practice Areas");
  const [selectedFundingStage, setSelectedFundingStage] =
    useState("All Stages");
  const [selectedRiskProfile, setSelectedRiskProfile] =
    useState("All Risk Levels");
  const [selectedReturnRange, setSelectedReturnRange] = useState("All Returns");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedCases = useMemo(() => {
    const filtered = mockCases.filter((caseItem) => {
      // Only show approved cases to public
      if (caseItem.adminStatus !== "Approved") return false;

      const matchesSearch =
        caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.lawFirm.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPracticeArea =
        selectedPracticeArea === "All Practice Areas" ||
        caseItem.practiceArea === selectedPracticeArea;

      const matchesFundingStage =
        selectedFundingStage === "All Stages" ||
        caseItem.fundingStage === selectedFundingStage;

      const matchesRiskProfile =
        selectedRiskProfile === "All Risk Levels" ||
        caseItem.riskProfile === selectedRiskProfile;

      // Return range filtering
      const returnRange = returnRanges.find(
        (range) => range.label === selectedReturnRange
      );
      const matchesReturnRange =
        selectedReturnRange === "All Returns" ||
        (returnRange &&
          ((caseItem.expectedReturnMin >= returnRange.min &&
            caseItem.expectedReturnMax <= returnRange.max) ||
            (caseItem.expectedReturnMin <= returnRange.max &&
              caseItem.expectedReturnMax >= returnRange.min)));

      return (
        matchesSearch &&
        matchesPracticeArea &&
        matchesFundingStage &&
        matchesRiskProfile &&
        matchesReturnRange
      );
    });

    // Sort cases
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.filedDate).getTime() - new Date(a.filedDate).getTime()
          );
        case "highest-return":
          return b.expectedReturnMax - a.expectedReturnMax;
        case "lowest-risk": {
          const riskOrder = { Low: 1, Medium: 2, High: 3 };
          return (
            riskOrder[a.riskLevel as keyof typeof riskOrder] -
            riskOrder[b.riskLevel as keyof typeof riskOrder]
          );
        }
        case "funding-high":
          return b.amountRaised - a.amountRaised;
        case "progress":
          return (
            b.amountRaised / b.fundingGoal - a.amountRaised / a.fundingGoal
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    searchTerm,
    selectedPracticeArea,
    selectedFundingStage,
    selectedRiskProfile,
    selectedReturnRange,
    sortBy,
  ]);

  const stats = useMemo((): CaseStats => {
    const approvedCases = mockCases.filter((c) => c.adminStatus === "Approved");
    const totalCases = approvedCases.length;
    const activeCases = approvedCases.filter(
      (c) => c.status === "Active"
    ).length;
    const fundedCases = approvedCases.filter(
      (c) => c.status === "Funded"
    ).length;
    const totalRaised = approvedCases.reduce(
      (sum, c) => sum + c.amountRaised,
      0
    );

    return { totalCases, activeCases, fundedCases, totalRaised };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedPracticeArea("All Practice Areas");
    setSelectedFundingStage("All Stages");
    setSelectedRiskProfile("All Risk Levels");
    setSelectedReturnRange("All Returns");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Stats */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold">
              Democratizing Access to Justice
            </h1>
            <p className="mx-auto mb-6 max-w-3xl text-xl text-blue-100">
              Invest in vetted legal cases and help plaintiffs get the justice
              they deserve while earning returns on successful outcomes.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {stats.totalCases}
              </div>
              <div className="text-sm text-blue-200">Vetted Cases</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {stats.activeCases}
              </div>
              <div className="text-sm text-blue-200">Active Funding</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {stats.fundedCases}
              </div>
              <div className="text-sm text-blue-200">Funded Cases</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {formatCurrency(stats.totalRaised)}
              </div>
              <div className="text-sm text-blue-200">Total Raised</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="sticky top-0 z-10 border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-4 flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search cases by title, description, or law firm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Select
                value={selectedPracticeArea}
                onValueChange={setSelectedPracticeArea}
              >
                <SelectTrigger className="h-12 w-48">
                  <SelectValue placeholder="Practice Area" />
                </SelectTrigger>
                <SelectContent>
                  {practiceAreas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedFundingStage}
                onValueChange={setSelectedFundingStage}
              >
                <SelectTrigger className="h-12 w-48">
                  <SelectValue placeholder="Funding Stage" />
                </SelectTrigger>
                <SelectContent>
                  {fundingStages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="highest-return">Highest Return</SelectItem>
                  <SelectItem value="lowest-risk">Lowest Risk</SelectItem>
                  <SelectItem value="funding-high">Highest Funded</SelectItem>
                  <SelectItem value="progress">Most Progress</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 px-4"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="rounded-lg border bg-gray-50 p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Risk Profile
                  </label>
                  <Select
                    value={selectedRiskProfile}
                    onValueChange={setSelectedRiskProfile}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Risk Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Risk Levels">
                        All Risk Levels
                      </SelectItem>
                      {Object.keys(riskLevels).map((risk) => (
                        <SelectItem key={risk} value={risk}>
                          {risk} Risk
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Expected Return Range
                  </label>
                  <Select
                    value={selectedReturnRange}
                    onValueChange={setSelectedReturnRange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Returns" />
                    </SelectTrigger>
                    <SelectContent>
                      {returnRanges.map((range) => (
                        <SelectItem key={range.label} value={range.label}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {(selectedPracticeArea !== "All Practice Areas" ||
            selectedFundingStage !== "All Stages" ||
            selectedRiskProfile !== "All Risk Levels" ||
            selectedReturnRange !== "All Returns" ||
            searchTerm) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 text-xs"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedPracticeArea !== "All Practice Areas" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedPracticeArea}
                  <button
                    onClick={() =>
                      setSelectedPracticeArea("All Practice Areas")
                    }
                    className="ml-1 text-xs"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedFundingStage !== "All Stages" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedFundingStage}
                  <button
                    onClick={() => setSelectedFundingStage("All Stages")}
                    className="ml-1 text-xs"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedRiskProfile !== "All Risk Levels" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedRiskProfile}
                  <button
                    onClick={() => setSelectedRiskProfile("All Risk Levels")}
                    className="ml-1 text-xs"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedReturnRange !== "All Returns" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedReturnRange}
                  <button
                    onClick={() => setSelectedReturnRange("All Returns")}
                    className="ml-1 text-xs"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Disclosure Notice */}
      <div className="border-b bg-blue-50">
        <div className="container mx-auto px-4 py-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> All cases shown have passed our due
              diligence process. Investment disclosures are available for each
              case. KYC verification required before investing.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            {filteredAndSortedCases.length} Vetted{" "}
            {filteredAndSortedCases.length === 1 ? "Case" : "Cases"} Available
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedCases.map((caseItem) => (
            <CaseCard
              key={caseItem.id}
              case={caseItem}
              onClick={() => onCaseSelect(caseItem)}
            />
          ))}
        </div>

        {filteredAndSortedCases.length === 0 && (
          <div className="py-12 text-center">
            <div className="mb-4 text-lg text-gray-500">
              No vetted cases match your criteria
            </div>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
