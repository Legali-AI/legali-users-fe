"use client";

import { useState } from "react";
import { FilterSidebar } from "@/components/filter-sidebar";
import { GlobalLayout } from "@/components/layout/global-layout";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { caseTypes, languages } from "@/data/mock-data";
import { useSearchLawyers } from "@/hooks/use-lawyers";
import type { SearchParams } from "@/types";
import { LawyerCardGrid } from "./components/LawyerCardGrid";
import { Stats } from "./components/Stats";

export default function LawyersPage() {
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

  // Convert case types to filter options
  const caseTypeOptions = caseTypes.map(caseType => ({
    label: caseType.label,
    value: caseType.value,
    count: Math.floor(Math.random() * 50) + 10, // Mock count
  }));

  // Language options
  const languageOptions = languages.map(lang => ({
    label: lang,
    value: lang,
    count: Math.floor(Math.random() * 30) + 5, // Mock count
  }));

  // Stats for the search results
  const searchStats = [
    { label: "Total Results", value: searchResults?.total || 0 },
    { label: "Average Rating", value: "4.8" },
    { label: "Response Time", value: "< 2hrs" },
    { label: "Success Rate", value: "94%" },
  ];

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
    <GlobalLayout variant="no-padding" className="mobile-safe-bottom bg-gradient-sky-blue min-h-screen">
      {/* Header */}
      {/* <Header showActions={false} /> */}

      {/* Search Hero Section */}
      <section className="bg-blue-600 py-12 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold">Find the Right Lawyer</h1>
          <p className="mb-8 text-xl text-blue-100">Connect with qualified legal professionals in your area</p>
          <div className="mx-auto flex max-w-2xl flex-col gap-4 md:flex-row">
            <SearchBar
              value={searchParams.query || ""}
              onChange={value => updateSearchParams({ query: value })}
              onSearch={handleSearch}
              placeholder="What legal help do you need?"
              size="lg"
              isLoading={isLoading}
              className="flex-1"
            />
            <Input
              placeholder="Enter location"
              value={searchParams.location || ""}
              onChange={e => updateSearchParams({ location: e.target.value })}
              className="h-14 bg-white text-lg text-gray-900 md:w-64"
            />
            <Button
              size="lg"
              onClick={() => handleSearch(searchParams.query || "")}
              className="h-14 bg-white font-semibold !text-blue-700 hover:!text-white ">
              Search
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Stats */}
        <div className="mb-8">
          <Stats stats={searchStats} variant="simple" size="sm" layout="horizontal" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
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
            className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}
          />

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
    </GlobalLayout>
  );
}
