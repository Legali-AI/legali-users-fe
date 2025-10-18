"use client";

import { FilterSidebar } from "@/components/filter-sidebar";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLawyers } from "@/hooks/use-lawyers";
import { setTestToken } from "@/lib/auth-token";
import type { SearchParams } from "@/types";
import { useEffect, useState } from "react";
import { ApiLawyerCardGrid } from "./ApiLawyerCardGrid";

interface LawyerSearchInterfaceProps {}

export default function LawyerSearchInterface({}: LawyerSearchInterfaceProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: "",
    location: "",
    page: 1,
    limit: 12,
    sortBy: "rating",
    sortOrder: "desc",
  });
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedPracticeAreas, setSelectedPracticeAreas] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });

  const [showFilters, setShowFilters] = useState(false);
  const { lawyers, loading: isLoading, filterCounts, searchLawyers } = useLawyers({
    ...(searchParams.query && { searchQuery: searchParams.query }),
    ...(selectedPracticeAreas.length > 0 && { practiceAreas: selectedPracticeAreas }),
    ...(priceRange.min > 0 && { minPrice: priceRange.min }),
    ...(priceRange.max > 0 && { maxPrice: priceRange.max }),
    ...(searchParams.rating && { minRating: searchParams.rating }),
    ...(selectedLanguages.length > 0 && { languages: selectedLanguages }),
    ...(searchParams.sortBy && { sortBy: searchParams.sortBy }),
    ...(searchParams.sortOrder && { sortOrder: searchParams.sortOrder }),
  });

  // Set test token for API access
  useEffect(() => {
    setTestToken();
  }, []);

  // Initialize price range with data from API
  useEffect(() => {
    if (filterCounts.priceRange.min > 0 && filterCounts.priceRange.max > 0) {
      setPriceRange(prev => ({
        min: prev.min || filterCounts.priceRange.min,
        max: prev.max || filterCounts.priceRange.max,
      }));
    }
  }, [filterCounts.priceRange]);

  const updateSearchParams = (updates: Partial<SearchParams>) => {
    setSearchParams(prev => ({ ...prev, ...updates, page: 1 }));
  };

  const handleSearch = async (query: string) => {
    updateSearchParams({ query });
    await searchLawyers(query);
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
    setSelectedLanguages([]);
    setSelectedPracticeAreas([]);
    setPriceRange({ min: 0, max: 0 });
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
      selectedPracticeAreas.length > 0 ||
      searchParams.rating ||
      selectedLanguages.length > 0 ||
      priceRange.min > 0 ||
      priceRange.max > 0
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

        <div className="grid animate-in grid-cols-1 gap-8 delay-300 duration-500 slide-in-from-bottom-4 lg:grid-cols-6">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-2 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="sticky top-6">
              <FilterSidebar
                practiceAreaOptions={filterCounts.practiceAreas}
                selectedPracticeAreas={selectedPracticeAreas}
                onPracticeAreaChange={setSelectedPracticeAreas}
                {...(searchParams.rating !== undefined && {
                  selectedRating: searchParams.rating,
                })}
                ratingCounts={filterCounts.ratings}
                onRatingChange={(rating) => {
                  const updates: Partial<SearchParams> = {};
                  if (rating !== undefined) {
                    updates.rating = rating;
                  }
                  updateSearchParams(updates);
                }}
                priceRange={{
                  min: priceRange.min || filterCounts.priceRange.min,
                  max: priceRange.max || filterCounts.priceRange.max,
                }}
                onPriceRangeChange={setPriceRange}
                languageOptions={filterCounts.languages}
                selectedLanguages={selectedLanguages}
                onLanguageChange={(values) => {
                  // Convert to lowercase to match the filtering logic
                  setSelectedLanguages(values.map(v => v.toLowerCase()));
                }}
                hasActiveFilters={hasActiveFilters}
                onClearAll={clearAllFilters}
                className="rounded-lg border bg-white p-6 shadow-sm"
              />
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-4">
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{lawyers.length} lawyers found</h1>
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
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split("-");
                    const updates: Partial<SearchParams> = {};
                    if (
                      sortBy &&
                      (sortBy === "rating" || sortBy === "price" || sortBy === "name")
                    ) {
                      updates.sortBy = sortBy as "rating" | "price" | "name";
                    }
                    if (sortOrder && (sortOrder === "asc" || sortOrder === "desc")) {
                      updates.sortOrder = sortOrder as "asc" | "desc";
                    }
                    updateSearchParams(updates);
                  }}>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="rating-asc">Lowest Rated</option>
                  <option value="price-asc">Lowest Price</option>
                  <option value="price-desc">Highest Price</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                </select>
              </div>
            </div>

            {/* Lawyer Cards Grid */}
            <ApiLawyerCardGrid
              lawyers={lawyers}
              variant="default"
              isLoading={isLoading}
              columns={{ lg: 2, md: 2, sm: 1 }}
              emptyState={{
                title: "No lawyers found",
                description: "Try adjusting your search criteria or removing some filters.",
                action: hasActiveFilters ? <Button onClick={clearAllFilters}>Clear All Filters</Button> : undefined,
              }}
            />

          </div>
        </div>
      </div>
    </>
  );
}
