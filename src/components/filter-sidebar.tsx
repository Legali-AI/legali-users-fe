"use client";

import { Star } from "lucide-react";
import { CheckboxFilter } from "@/components/checkbox-filter";
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

  // Price Range
  priceRange: { min: number; max: number };
  onPriceRangeChange: (range: { min: number; max: number }) => void;

  // Experience
  selectedExperience?: number;
  onExperienceChange: (years?: number) => void;

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
  priceRange,
  onPriceRangeChange,
  selectedExperience,
  onExperienceChange,
  languageOptions,
  selectedLanguages,
  onLanguageChange,
  hasActiveFilters,
  onClearAll,
  className = "",
}: FilterSidebarProps) {
  const experienceOptions = [
    { label: "1+ years", value: 1, count: 234 },
    { label: "5+ years", value: 5, count: 156 },
    { label: "10+ years", value: 10, count: 89 },
    { label: "15+ years", value: 15, count: 45 },
  ];

  return (
    <div className={className}>
      <Card className="sticky top-6 border border-gray-100 bg-white shadow-sm">
        <CardHeader className="border-b border-gray-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-gray-900">Filters</CardTitle>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
              >
                Clear All
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Practice Area Filter */}
          <FilterButton
            className="mt-6"
            title="Practice Area"
            options={practiceAreaOptions}
            selectedValues={selectedPracticeAreas}
            onChange={onPracticeAreaChange}
            multiple={true}
            placeholder="All practice areas"
          />

          {/* Rating Filter with Stars */}
          <div>
            <h3 className="mb-3 font-medium text-gray-900">Minimum Rating</h3>
            <div className="space-y-2">
              {[5, 4, 3].map((rating) => (
                <label
                  key={rating}
                  className="flex cursor-pointer items-center space-x-2 rounded p-2 transition-colors hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedRating === rating}
                    onChange={(e) =>
                      onRatingChange(e.target.checked ? rating : undefined)
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex flex-1 items-center justify-between">
                    <div className="flex items-center">
                      <Star className="mr-1 h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-700">
                        {rating}+ stars
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      ({rating === 5 ? "45" : rating === 4 ? "128" : "89"})
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <PriceRangeFilter
            title="Hourly Rate"
            value={priceRange}
            onChange={onPriceRangeChange}
          />

          {/* Experience Filter */}
          <CheckboxFilter
            title="Experience"
            options={experienceOptions}
            selectedValues={selectedExperience ? [selectedExperience] : []}
            onChange={(values) =>
              onExperienceChange(values[0] as number | undefined)
            }
          />

          {/* Languages Filter */}
          <FilterButton
            title="Languages"
            options={languageOptions}
            selectedValues={selectedLanguages}
            onChange={onLanguageChange}
            multiple={true}
            placeholder="Any language"
          />
        </CardContent>
      </Card>
    </div>
  );
}
