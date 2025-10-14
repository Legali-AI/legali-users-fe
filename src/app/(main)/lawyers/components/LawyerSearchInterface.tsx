"use client";

import { useRef, useState } from "react";
import { FilterSidebar } from "@/components/filter-sidebar";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchLawyers } from "@/hooks/use-lawyers";
import type { LawyerSearchResponse } from "@/services/lawyer.service";
import type { CaseType, SearchParams } from "@/types";
import { LawyerCardGrid } from "./LawyerCardGrid";

interface LawyerSearchInterfaceProps {
  caseTypeOptions: Array<{ label: string; value: CaseType; count?: number }>;
  initialParams: SearchParams;
  initialResults: LawyerSearchResponse;
  initialUpdatedAt: number;
}

export default function LawyerSearchInterface({
  caseTypeOptions,
  initialParams,
  initialResults,
  initialUpdatedAt,
}: LawyerSearchInterfaceProps) {
  const baselineParamsRef = useRef<SearchParams>({ ...initialParams });
  const [searchParams, setSearchParams] = useState<SearchParams>(() => ({ ...initialParams }));

  const [showFilters, setShowFilters] = useState(false);
  const {
    data: searchResults = initialResults,
    isLoading,
    isFetching,
  } = useSearchLawyers(searchParams, {
    initialData: initialResults,
    initialDataUpdatedAt: initialUpdatedAt,
  });

  const baselineParams = baselineParamsRef.current;

  const updateSearchParams = (updates: Partial<SearchParams>, shouldResetPage = true) => {
    setSearchParams(prev => {
      const nextParams = { ...prev, ...updates };
      if (shouldResetPage && updates.page === undefined) {
        nextParams.page = 1;
      }
      return nextParams;
    });
  };

  const handleSearch = (query: string) => {
    updateSearchParams({ query });
  };

  const clearAllFilters = () => {
    setSearchParams({ ...baselineParams });
  };

  // Stats for the search results
  // const searchStats = [
  //   { label: "Total Results", value: searchResults?.total || 0 },
  //   { label: "Average Rating", value: "4.8" },
  //   { label: "Response Time", value: "< 2hrs" },
  //   { label: "Success Rate", value: "94%" },
  // ];

  const baselineBudgetMin = baselineParams.budget?.min ?? 0;
  const baselineBudgetMax = baselineParams.budget?.max ?? 0;
  const activeBudgetMin = searchParams.budget?.min ?? 0;
  const activeBudgetMax = searchParams.budget?.max ?? 0;

  const hasActiveFilters =
    (searchParams.query ?? "") !== (baselineParams.query ?? "") ||
    (searchParams.location ?? "") !== (baselineParams.location ?? "") ||
    (searchParams.caseType ?? "") !== (baselineParams.caseType ?? "") ||
    (searchParams.rating ?? null) !== (baselineParams.rating ?? null) ||
    ((baselineBudgetMin || baselineBudgetMax || activeBudgetMin || activeBudgetMax) &&
      (baselineBudgetMin !== activeBudgetMin || baselineBudgetMax !== activeBudgetMax));

  const resultsSummary = searchResults ?? initialResults;
  const isBusy = isLoading || isFetching;
  const isInitialLoading = isLoading && resultsSummary.lawyers.length === 0;

  return (
    <>
      {/* Search Hero Section */}
      <section className="relative animate-in bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-16 text-white duration-700 fade-in slide-in-from-top-4">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-8 space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Find the Right Lawyer</h1>
            <p className="mx-auto max-w-2xl text-lg text-blue-100 sm:text-xl">
              Connect with qualified legal professionals in your area. Get expert help for your case.
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <SearchBar
                    value={searchParams.query || ""}
                    onChange={value => updateSearchParams({ query: value })}
                    onSearch={handleSearch}
                    placeholder="What legal help do you need?"
                    size="lg"
                    isLoading={isBusy}
                    className="h-14 text-base"
                  />
                </div>
                <div className="md:w-72">
                  <Input
                    placeholder="Enter location (City, State)"
                    value={searchParams.location || ""}
                    onChange={e => updateSearchParams({ location: e.target.value })}
                    className="h-14 border-0 bg-white/90 text-base text-gray-900 transition-colors placeholder:text-gray-500 focus:bg-white"
                  />
                </div>
                <Button
                  size="lg"
                  onClick={() => handleSearch(searchParams.query || "")}
                  disabled={isBusy}
                  className="h-14 bg-white px-8 font-semibold text-blue-700 transition-all duration-200 hover:bg-blue-50 hover:text-blue-800 disabled:opacity-50">
                  {isBusy ? "Searching..." : "Search Lawyers"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Search Stats */}
        {/* <div className="mb-8 animate-in delay-200 duration-500 slide-in-from-bottom-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {searchStats.map(stat => (
              <div
                key={stat.label}
                className="rounded-lg border bg-white p-4 text-center shadow-sm"
              >
                <div className="text-2xl font-bold text-blue-600">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div> */}

        <div className="grid animate-in grid-cols-1 gap-8 delay-300 duration-500 slide-in-from-bottom-4 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="sticky top-6">
              <FilterSidebar
                practiceAreaOptions={caseTypeOptions}
                selectedPracticeAreas={searchParams.caseType ? [searchParams.caseType] : []}
                onPracticeAreaChange={values => {
                  const nextCaseType = values[0];
                  updateSearchParams({ caseType: nextCaseType ?? undefined });
                }}
                selectedRating={searchParams.rating}
                onRatingChange={rating => {
                  updateSearchParams({ rating });
                }}
                priceRange={{
                  min: searchParams.budget?.min || 0,
                  max: searchParams.budget?.max || 0,
                }}
                onPriceRangeChange={range =>
                  updateSearchParams({
                    budget: range.min > 0 || range.max > 0 ? { min: range.min, max: range.max } : undefined,
                  })
                }
                selectedExperience={undefined}
                onExperienceChange={() => updateSearchParams({ experience: undefined })}
                languageOptions={[]}
                selectedLanguages={[]}
                onLanguageChange={() => updateSearchParams({ language: undefined })}
                showExperience={false}
                showLanguages={false}
                hasActiveFilters={hasActiveFilters}
                onClearAll={clearAllFilters}
                className="rounded-lg border bg-white p-6 shadow-sm"
              />
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">{resultsSummary.total} lawyers found</h1>
                  {isFetching && (
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      Updating...
                    </span>
                  )}
                </div>
                {searchParams.query && (
                  <p className="text-gray-600">
                    Results for &ldquo;{searchParams.query}&rdquo;
                    {searchParams.location && ` in ${searchParams.location}`}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 lg:hidden">
                  Filters
                </button>
                <select
                  className="rounded-md border px-4 py-2 text-gray-700"
                  value={`${searchParams.sortBy}-${searchParams.sortOrder}`}
                  onChange={e => {
                    const [sortBy, sortOrder] = e.target.value.split("-");
                    const updates: Partial<SearchParams> = {};
                    if (sortBy && (sortBy === "rating" || sortBy === "price" || sortBy === "reviews")) {
                      updates.sortBy = sortBy;
                    }
                    if (sortOrder && (sortOrder === "asc" || sortOrder === "desc")) {
                      updates.sortOrder = sortOrder;
                    }
                    updateSearchParams(updates);
                  }}>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="price-asc">Lowest Price</option>
                  <option value="price-desc">Highest Price</option>
                  <option value="reviews-desc">Most Reviews</option>
                </select>
              </div>
            </div>

            {/* Lawyer Cards Grid */}
            <LawyerCardGrid
              lawyers={resultsSummary.lawyers}
              variant="default"
              isLoading={isInitialLoading}
              columns={{ lg: 2, md: 2, sm: 1 }}
              emptyState={{
                title: "No lawyers found",
                description: "Try adjusting your search criteria or removing some filters.",
                action: hasActiveFilters ? <Button onClick={clearAllFilters}>Clear All Filters</Button> : undefined,
              }}
            />

            {/* Pagination */}
            {resultsSummary.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-2">
                  {Array.from({ length: Math.min(5, resultsSummary.totalPages) }, (_, i) => (
                    <Button
                      key={`page-${i + 1}`}
                      variant={resultsSummary.page === i + 1 ? "default" : "outline"}
                      onClick={() => updateSearchParams({ page: i + 1 }, false)}>
                      {i + 1}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
