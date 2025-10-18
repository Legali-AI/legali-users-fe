"use client";

import { Star } from "lucide-react";
import { FilterButton } from "@/components/filter-button";
import { PriceRangeFilter } from "@/components/price-range-filter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterSidebarProps {
  // Practice Area
  practiceAreaOptions: FilterOption[];
  selectedPracticeAreas: string[];
  onPracticeAreaChange: (values: string[]) => void;

  // Rating
  selectedRating?: number;
  onRatingChange: (rating?: number) => void;
  ratingCounts?: Array<{ rating: number; count: number }>;

  // Price Range
  priceRange: { min: number; max: number };
  onPriceRangeChange: (range: { min: number; max: number }) => void;

  // Languages
  languageOptions: FilterOption[];
  selectedLanguages: string[];
  onLanguageChange: (values: string[]) => void;

  // General
  hasActiveFilters: boolean;
  onClearAll: () => void;
  className?: string;
}

export function FilterSidebar({
  practiceAreaOptions,
  selectedPracticeAreas,
  onPracticeAreaChange,
  selectedRating,
  onRatingChange,
  ratingCounts = [],
  priceRange,
  onPriceRangeChange,
  languageOptions,
  selectedLanguages,
  onLanguageChange,
  hasActiveFilters,
  onClearAll,
  className = "",
}: FilterSidebarProps) {
  return (
    <div className={className}>
      <Card className="sticky top-6 border border-gray-200 bg-white shadow-lg">
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-900">Filters</CardTitle>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline">
                Clear All
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-8 py-6">
          {/* Practice Area Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Practice Area</h3>
            <FilterButton
              title="Practice Area"
              options={practiceAreaOptions}
              selectedValues={selectedPracticeAreas}
              onChange={onPracticeAreaChange}
              multiple={true}
              placeholder="All practice areas"
            />
          </div>

          {/* Rating Filter with Stars */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Minimum Rating</h3>
            <div className="space-y-3">
              {[5, 4, 3].map(rating => {
                const count = ratingCounts.find(rc => rc.rating === rating)?.count || 0;
                return (
                  <label
                    key={rating}
                    className="flex cursor-pointer items-center space-x-3 rounded-lg p-3 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm">
                    <input
                      type="checkbox"
                      checked={selectedRating === rating}
                      onChange={e => onRatingChange(e.target.checked ? rating : undefined)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    <div className="flex flex-1 items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-700">{rating}+ stars</span>
                      </div>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {count}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Hourly Rate</h3>
            <PriceRangeFilter value={priceRange} onChange={onPriceRangeChange} />
          </div>

          {/* Languages Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Languages</h3>
            <FilterButton
              title="Languages"
              options={languageOptions}
              selectedValues={selectedLanguages}
              onChange={onLanguageChange}
              multiple={true}
              placeholder="Any language"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
