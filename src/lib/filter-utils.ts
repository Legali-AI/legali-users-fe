import type { ApiLawyer } from "@/types";

export interface FilterCounts {
  practiceAreas: Array<{ label: string; value: string; count: number }>;
  ratings: Array<{ rating: number; count: number }>;
  languages: Array<{ label: string; value: string; count: number }>;
  priceRange: { min: number; max: number };
}

export function calculateFilterCounts(lawyers: ApiLawyer[]): FilterCounts {
  // Calculate practice area counts
  const practiceAreaCounts = new Map<string, number>();
  lawyers.forEach(lawyer => {
    lawyer.practice_area.forEach(area => {
      practiceAreaCounts.set(area, (practiceAreaCounts.get(area) || 0) + 1);
    });
  });

  const practiceAreas = Array.from(practiceAreaCounts.entries())
    .map(([area, count]) => ({
      label: area,
      value: area,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  // Calculate rating counts
  const ratingCounts = new Map<number, number>();
  lawyers.forEach(lawyer => {
    const rating = Math.floor(parseFloat(lawyer.avg_rating));
    ratingCounts.set(rating, (ratingCounts.get(rating) || 0) + 1);
  });

  const ratings = Array.from(ratingCounts.entries())
    .map(([rating, count]) => ({ rating, count }))
    .sort((a, b) => b.rating - a.rating);

  // Calculate price range
  const prices = lawyers.map(lawyer => lawyer.min_price);
  const priceRange = {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };

  // Calculate language counts from actual data
  const languageCounts = new Map<string, number>();
  lawyers.forEach(lawyer => {
    if (lawyer.languages) {
      lawyer.languages.forEach(lang => {
        languageCounts.set(lang, (languageCounts.get(lang) || 0) + 1);
      });
    }
  });

  const languages = Array.from(languageCounts.entries())
    .map(([lang, count]) => ({
      label: lang,
      value: lang.toLowerCase(),
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    practiceAreas,
    ratings,
    languages,
    priceRange,
  };
}

export function getFilteredCounts(
  lawyers: ApiLawyer[],
  filters: {
    practiceArea?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    language?: string;
  }
) {
  let filteredLawyers = [...lawyers];

  // Apply filters
  if (filters.practiceArea) {
    filteredLawyers = filteredLawyers.filter(lawyer =>
      lawyer.practice_area.some(area =>
        area.toLowerCase().includes(filters.practiceArea!.toLowerCase())
      )
    );
  }

  if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
    filteredLawyers = filteredLawyers.filter(
      lawyer => lawyer.min_price >= filters.minPrice! && lawyer.max_price <= filters.maxPrice!
    );
  }

  if (filters.minRating !== undefined) {
    filteredLawyers = filteredLawyers.filter(
      lawyer => parseFloat(lawyer.avg_rating) >= filters.minRating!
    );
  }

  return calculateFilterCounts(filteredLawyers);
}
