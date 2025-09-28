"use client";

import { AlertCircle, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CaseStats, LitigationCase } from "@/types/litigation";
import { fundingStages, mockCases, practiceAreas, returnRanges, riskLevels } from "../mock-data";
import CaseCard from "./CaseCard";

interface EnhancedCasesListProps {
  onCaseSelect: (caseItem: LitigationCase) => void;
}

export default function EnhancedCasesList({ onCaseSelect }: EnhancedCasesListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPracticeArea, setSelectedPracticeArea] = useState("All Practice Areas");
  const [selectedFundingStage, setSelectedFundingStage] = useState("All Stages");
  const [selectedRiskProfile, setSelectedRiskProfile] = useState("All Risk Levels");
  const [selectedReturnRange, setSelectedReturnRange] = useState("All Returns");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredAndSortedCases = useMemo(() => {
    const filtered = mockCases.filter(caseItem => {
      // Only show approved cases to public
      if (caseItem.adminStatus !== "Approved") return false;

      const matchesSearch =
        caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.lawFirm.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPracticeArea =
        selectedPracticeArea === "All Practice Areas" || caseItem.practiceArea === selectedPracticeArea;

      const matchesFundingStage =
        selectedFundingStage === "All Stages" || caseItem.fundingStage === selectedFundingStage;

      const matchesRiskProfile =
        selectedRiskProfile === "All Risk Levels" || caseItem.riskProfile === selectedRiskProfile;

      // Return range filtering
      const returnRange = returnRanges.find(range => range.label === selectedReturnRange);
      const matchesReturnRange =
        selectedReturnRange === "All Returns" ||
        (returnRange &&
          ((caseItem.expectedReturnMin >= returnRange.min && caseItem.expectedReturnMax <= returnRange.max) ||
            (caseItem.expectedReturnMin <= returnRange.max && caseItem.expectedReturnMax >= returnRange.min)));

      return matchesSearch && matchesPracticeArea && matchesFundingStage && matchesRiskProfile && matchesReturnRange;
    });

    // Sort cases
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.filedDate).getTime() - new Date(a.filedDate).getTime();
        case "highest-return":
          return b.expectedReturnMax - a.expectedReturnMax;
        case "lowest-risk": {
          const riskOrder = { Low: 1, Medium: 2, High: 3 };
          return riskOrder[a.riskLevel as keyof typeof riskOrder] - riskOrder[b.riskLevel as keyof typeof riskOrder];
        }
        case "funding-high":
          return b.amountRaised - a.amountRaised;
        case "progress":
          return b.amountRaised / b.fundingGoal - a.amountRaised / a.fundingGoal;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedPracticeArea, selectedFundingStage, selectedRiskProfile, selectedReturnRange, sortBy]);

  const stats = useMemo((): CaseStats => {
    const approvedCases = mockCases.filter(c => c.adminStatus === "Approved");
    const totalCases = approvedCases.length;
    const activeCases = approvedCases.filter(c => c.status === "Active").length;
    const fundedCases = approvedCases.filter(c => c.status === "Funded").length;
    const totalRaised = approvedCases.reduce((sum, c) => sum + c.amountRaised, 0);

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
    setShowMobileFilters(false);
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Section with Stats */}
      <div className="bg-gradient-to-br from-sky-600/90 via-sky-700/90 to-blue-800/90 text-white backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="mb-6 text-center sm:mb-8">
            <h1 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl lg:text-4xl">Democratizing Access to Justice</h1>
            <p className="mx-auto mb-4 max-w-3xl px-2 text-base text-sky-100 sm:mb-6 sm:text-lg lg:text-xl">
              Invest in vetted legal cases and help plaintiffs get the justice they deserve while earning returns on
              successful outcomes.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:gap-6">
            <div className="rounded-lg bg-white/10 p-3 text-center backdrop-blur-sm sm:p-4">
              <div className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">{stats.totalCases}</div>
              <div className="text-xs text-sky-100 sm:text-sm">Vetted Cases</div>
            </div>
            <div className="rounded-lg bg-white/10 p-3 text-center backdrop-blur-sm sm:p-4">
              <div className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">{stats.activeCases}</div>
              <div className="text-xs text-sky-100 sm:text-sm">Active Funding</div>
            </div>
            <div className="rounded-lg bg-white/10 p-3 text-center backdrop-blur-sm sm:p-4">
              <div className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">{stats.fundedCases}</div>
              <div className="text-xs text-sky-100 sm:text-sm">Funded Cases</div>
            </div>
            <div className="rounded-lg bg-white/10 p-3 text-center backdrop-blur-sm sm:p-4">
              <div className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                {formatCurrency(stats.totalRaised)}
              </div>
              <div className="text-xs text-sky-100 sm:text-sm">Total Raised</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="sticky top-20 z-10 border-b bg-white/95 shadow-sm backdrop-blur-sm sm:top-0">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          {/* Search Bar - Always Visible */}
          <div className="relative mb-3 w-full">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400 sm:h-5 sm:w-5" />
            <Input
              placeholder="Search cases by title, description, or law firm..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="h-10 pl-9 text-sm sm:h-12 sm:pl-10 sm:text-base"
            />
          </div>

          {/* Mobile Filter Toggle + Desktop Filters */}
          <div className="flex flex-col gap-3">
            {/* Mobile: Show only filter toggle button */}
            <div className="sm:hidden">
              <Button
                variant="outline"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="h-10 w-full justify-center text-sm">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                {showMobileFilters ? "Hide Filters" : "Show Filters"}
                {(selectedPracticeArea !== "All Practice Areas" ||
                  selectedFundingStage !== "All Stages" ||
                  selectedRiskProfile !== "All Risk Levels" ||
                  selectedReturnRange !== "All Returns") && (
                  <span className="ml-2 h-2 w-2 rounded-full bg-sky-500"></span>
                )}
              </Button>
            </div>

            {/* Desktop: Always show filters, Mobile: Show when toggled */}
            <div className={`${showMobileFilters ? "block" : "hidden"} sm:block`}>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                {/* Mobile: 2 columns for first row, Desktop: horizontal */}
                <div className="grid flex-1 grid-cols-2 gap-2 sm:flex sm:gap-3">
                  <Select value={selectedPracticeArea} onValueChange={setSelectedPracticeArea}>
                    <SelectTrigger className="h-10 text-xs sm:h-12 sm:text-sm">
                      <SelectValue placeholder="Practice Area" />
                    </SelectTrigger>
                    <SelectContent>
                      {practiceAreas.map(area => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedFundingStage} onValueChange={setSelectedFundingStage}>
                    <SelectTrigger className="h-10 text-xs sm:h-12 sm:text-sm">
                      <SelectValue placeholder="Funding Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {fundingStages.map(stage => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Mobile: Second row with Sort and More Filters */}
                <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-10 text-xs sm:h-12 sm:text-sm">
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
                    className="h-10 px-3 text-xs sm:h-12 sm:px-4 sm:text-sm">
                    <SlidersHorizontal className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                    <span className="xs:inline hidden">More </span>Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="rounded-lg border bg-white/80 p-3 shadow-sm backdrop-blur-sm sm:p-4">
              <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
                <div>
                  <label
                    htmlFor="risk-profile-select"
                    className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
                    Risk Profile
                  </label>
                  <Select value={selectedRiskProfile} onValueChange={setSelectedRiskProfile}>
                    <SelectTrigger id="risk-profile-select" className="h-10 text-xs sm:h-11 sm:text-sm">
                      <SelectValue placeholder="All Risk Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Risk Levels">All Risk Levels</SelectItem>
                      {Object.keys(riskLevels).map(risk => (
                        <SelectItem key={risk} value={risk}>
                          {risk} Risk
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label
                    htmlFor="return-range-select"
                    className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
                    Expected Return Range
                  </label>
                  <Select value={selectedReturnRange} onValueChange={setSelectedReturnRange}>
                    <SelectTrigger id="return-range-select" className="h-10 text-xs sm:h-11 sm:text-sm">
                      <SelectValue placeholder="All Returns" />
                    </SelectTrigger>
                    <SelectContent>
                      {returnRanges.map(range => (
                        <SelectItem key={range.label} value={range.label}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button variant="outline" onClick={clearFilters} className="h-10 w-full text-xs sm:h-11 sm:text-sm">
                    Clear All Filters
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Display - Show only when filters are active */}
          {(selectedPracticeArea !== "All Practice Areas" ||
            selectedFundingStage !== "All Stages" ||
            selectedRiskProfile !== "All Risk Levels" ||
            selectedReturnRange !== "All Returns" ||
            searchTerm) && (
            <div className="mt-2 sm:mt-3">
              {/* Mobile: Compact view with clear all button */}
              <div className="flex items-center justify-between sm:hidden">
                <div className="flex flex-wrap gap-1">
                  {searchTerm && (
                    <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                      Search
                    </Badge>
                  )}
                  {selectedPracticeArea !== "All Practice Areas" && (
                    <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                      {selectedPracticeArea.length > 12
                        ? `${selectedPracticeArea.slice(0, 12)}...`
                        : selectedPracticeArea}
                    </Badge>
                  )}
                  {selectedFundingStage !== "All Stages" && (
                    <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                      {selectedFundingStage}
                    </Badge>
                  )}
                  {selectedRiskProfile !== "All Risk Levels" && (
                    <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                      {selectedRiskProfile}
                    </Badge>
                  )}
                  {selectedReturnRange !== "All Returns" && (
                    <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                      {selectedReturnRange}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-6 px-2 text-xs text-gray-500 hover:text-red-600">
                  Clear All
                </Button>
              </div>

              {/* Desktop: Full view with individual remove buttons */}
              <div className="hidden flex-wrap gap-2 sm:flex">
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1 text-xs">
                    Search: "{searchTerm.length > 20 ? `${searchTerm.slice(0, 20)}...` : searchTerm}"
                    <button type="button" onClick={() => setSearchTerm("")} className="ml-1 text-xs hover:text-red-600">
                      ×
                    </button>
                  </Badge>
                )}
                {selectedPracticeArea !== "All Practice Areas" && (
                  <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1 text-xs">
                    {selectedPracticeArea}
                    <button
                      type="button"
                      onClick={() => setSelectedPracticeArea("All Practice Areas")}
                      className="ml-1 text-xs hover:text-red-600">
                      ×
                    </button>
                  </Badge>
                )}
                {selectedFundingStage !== "All Stages" && (
                  <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1 text-xs">
                    {selectedFundingStage}
                    <button
                      type="button"
                      onClick={() => setSelectedFundingStage("All Stages")}
                      className="ml-1 text-xs hover:text-red-600">
                      ×
                    </button>
                  </Badge>
                )}
                {selectedRiskProfile !== "All Risk Levels" && (
                  <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1 text-xs">
                    {selectedRiskProfile}
                    <button
                      type="button"
                      onClick={() => setSelectedRiskProfile("All Risk Levels")}
                      className="ml-1 text-xs hover:text-red-600">
                      ×
                    </button>
                  </Badge>
                )}
                {selectedReturnRange !== "All Returns" && (
                  <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1 text-xs">
                    {selectedReturnRange}
                    <button
                      type="button"
                      onClick={() => setSelectedReturnRange("All Returns")}
                      className="ml-1 text-xs hover:text-red-600">
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Disclosure Notice */}
      <div className="border-b bg-sky-50/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-2 sm:py-3 lg:py-4">
          <Alert className="border-sky-200 bg-white/60 backdrop-blur-sm">
            <AlertCircle className="h-3 w-3 flex-shrink-0 text-sky-600 sm:h-4 sm:w-4" />
            <AlertDescription className="text-xs text-gray-700 sm:text-sm">
              <strong>Important:</strong> All cases shown have passed our due diligence process. Investment disclosures
              are available for each case. KYC verification required before investing.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto bg-transparent px-4 py-6 sm:py-8">
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <h2 className="text-lg font-semibold text-gray-900 sm:text-xl lg:text-2xl">
            {filteredAndSortedCases.length} Vetted {filteredAndSortedCases.length === 1 ? "Case" : "Cases"} Available
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedCases.map(caseItem => (
            <CaseCard key={caseItem.id} case={caseItem} onClick={() => onCaseSelect(caseItem)} />
          ))}
        </div>

        {filteredAndSortedCases.length === 0 && (
          <div className="py-8 text-center sm:py-12">
            <div className="mb-4 text-base text-gray-500 sm:text-lg">No vetted cases match your criteria</div>
            <Button variant="outline" onClick={clearFilters} className="text-sm sm:text-base">
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
