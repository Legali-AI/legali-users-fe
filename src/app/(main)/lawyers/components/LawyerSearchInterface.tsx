"use client";

import { useState } from "react";
import { FilterSidebar } from "@/components/filter-sidebar";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchLawyers } from "@/hooks/use-lawyers";
import type { CaseType, SearchParams } from "@/types";
import { LawyerCardGrid } from "./LawyerCardGrid";

interface LawyerSearchInterfaceProps {
  caseTypeOptions: Array<{ label: string; value: CaseType; count: number }>;
  languageOptions: Array<{ label: string; value: string; count: number }>;
}

export default function LawyerSearchInterface({ caseTypeOptions, languageOptions }: LawyerSearchInterfaceProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: "",
    location: "",
    page: 1,
    limit: 12,
    sortBy: "rating",
    sortOrder: "desc",
  });

  const [showFilters, setShowFilters] = useState(false);
  const { data: searchResults, isLoading } = useSearchLawyers(searchParams);

  const updateSearchParams = (updates: Partial<SearchParams>) => {
    setSearchParams(prev => ({ ...prev, ...updates, page: 1 }));
  };

  const handleSearch = (query: string) => {
    updateSearchParams({ query });
  };

  const clearAllFilters = () => {
    setSearchParams({
      query: "",
      location: "",
      page: 1,
      limit: 12,
      sortBy: "rating",
      sortOrder: "desc",
    });
  };

  // Stats for the search results
  // const searchStats = [
  //   { label: "Total Results", value: searchResults?.total || 0 },
  //   { label: "Average Rating", value: "4.8" },
  //   { label: "Response Time", value: "< 2hrs" },
  //   { label: "Success Rate", value: "94%" },
  // ];

  const hasActiveFilters = Boolean(
    searchParams.query ||
      searchParams.location ||
      searchParams.caseType ||
      searchParams.rating ||
      searchParams.experience ||
      searchParams.language ||
      searchParams.budget
  );

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
                    isLoading={isLoading}
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
                  disabled={isLoading}
                  className="h-14 bg-white px-8 font-semibold text-blue-700 transition-all duration-200 hover:bg-blue-50 hover:text-blue-800 disabled:opacity-50">
                  {isLoading ? "Searching..." : "Search Lawyers"}
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
                  const updates: Partial<SearchParams> = {};
                  if (values[0]) {
                    updates.caseType = values[0];
                  }
                  updateSearchParams(updates);
                }}
                {...(searchParams.rating !== undefined && {
                  selectedRating: searchParams.rating,
                })}
                onRatingChange={rating => {
                  const updates: Partial<SearchParams> = {};
                  if (rating !== undefined) {
                    updates.rating = rating;
                  }
                  updateSearchParams(updates);
                }}
                priceRange={{
                  min: searchParams.budget?.min || 0,
                  max: searchParams.budget?.max || 0,
                }}
                onPriceRangeChange={range =>
                  updateSearchParams({
                    budget: { min: range.min, max: range.max },
                  })
                }
                {...(searchParams.experience !== undefined && {
                  selectedExperience: searchParams.experience,
                })}
                onExperienceChange={experience => {
                  const updates: Partial<SearchParams> = {};
                  if (experience !== undefined) {
                    updates.experience = experience;
                  }
                  updateSearchParams(updates);
                }}
                languageOptions={languageOptions}
                selectedLanguages={searchParams.language ? [searchParams.language] : []}
                onLanguageChange={values => {
                  const updates: Partial<SearchParams> = {};
                  if (values[0]) {
                    updates.language = values[0];
                  }
                  updateSearchParams(updates);
                }}
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
                <h1 className="text-2xl font-bold text-gray-900">{searchResults?.total || 0} lawyers found</h1>
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
                    if (
                      sortBy &&
                      (sortBy === "rating" || sortBy === "price" || sortBy === "experience" || sortBy === "reviews")
                    ) {
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
                  <option value="experience-desc">Most Experience</option>
                  <option value="reviews-desc">Most Reviews</option>
                </select>
              </div>
            </div>

            {/* Lawyer Cards Grid */}
            <LawyerCardGrid
              lawyers={searchResults?.lawyers || []}
              variant="default"
              isLoading={isLoading}
              columns={{ lg: 2, md: 2, sm: 1 }}
              emptyState={{
                title: "No lawyers found",
                description: "Try adjusting your search criteria or removing some filters.",
                action: hasActiveFilters ? <Button onClick={clearAllFilters}>Clear All Filters</Button> : undefined,
              }}
            />

            {/* Pagination */}
            {searchResults && searchResults.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-2">
                  {Array.from({ length: Math.min(5, searchResults.totalPages) }, (_, i) => (
                    <Button
                      key={`page-${i + 1}`}
                      variant={searchResults.page === i + 1 ? "default" : "outline"}
                      onClick={() => updateSearchParams({ page: i + 1 })}>
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
