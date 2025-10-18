import { useCallback, useEffect, useMemo, useState } from "react";
import { calculateFilterCounts, type FilterCounts } from "@/lib/filter-utils";
import { LawyerService } from "@/services/lawyer.service";
import type { ApiLawyer, Lawyer, LawyerDetailApi } from "@/types";

// Adapter function to convert LawyerDetailApi to Lawyer
function adaptLawyerDetailApiToLawyer(lawyerDetail: LawyerDetailApi): Lawyer {
  // Calculate experience from member_since date
  const memberSince = new Date(lawyerDetail.member_since);
  const now = new Date();
  const experienceYears = Math.floor(
    (now.getTime() - memberSince.getTime()) / (1000 * 60 * 60 * 24 * 365)
  );

  return {
    id: lawyerDetail.id,
    name: lawyerDetail.name,
    email: `${lawyerDetail.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    profileImage: "",
    credentials: lawyerDetail.credentials,
    educations: lawyerDetail.educations,
    jurisdiction: lawyerDetail.jurisdictions,
    specialties: lawyerDetail.practice_area,
    experience: Math.max(1, experienceYears), // Use calculated experience or minimum 1 year
    rating: parseFloat(lawyerDetail.avg_rating),
    reviewCount: lawyerDetail.total_review,
    hourlyRate: Math.round((lawyerDetail.min_price + lawyerDetail.max_price) / 2),
    minPrice: lawyerDetail.min_price,
    maxPrice: lawyerDetail.max_price,
    completedCases: lawyerDetail.completed_cases,
    ongoingCases: lawyerDetail.on_going_cases,
    availability: "available" as const,
    languages: lawyerDetail.languages,
    bio: lawyerDetail.about,
    caseResults: [
      {
        id: `${lawyerDetail.id}-case-1`,
        caseType: lawyerDetail.practice_area[0] || "Legal Consultation",
        year: new Date().getFullYear() - 1,
        outcome: "Successful Resolution",
        description: `Successfully handled ${lawyerDetail.completed_cases} cases with positive outcomes.`,
      },
      {
        id: `${lawyerDetail.id}-case-2`,
        caseType: "Client Consultation",
        year: new Date().getFullYear(),
        outcome: "Ongoing Support",
        description: `Currently managing ${lawyerDetail.on_going_cases} active cases with dedicated client support.`,
      },
    ],
    pricingPackages: [
      {
        id: "1",
        name: "Consultation",
        description: "Initial consultation",
        price: lawyerDetail.min_price,
        duration: "1 hour",
        features: ["Case review", "Legal advice", "Next steps"],
      },
      {
        id: "2",
        name: "Full Representation",
        description: "Complete legal representation",
        price: lawyerDetail.max_price,
        duration: "Case duration",
        features: ["Full representation", "Court appearances", "Document preparation"],
      },
    ],
    videoIntroUrl: "",
    verificationStatus: "verified" as const,
    disciplinaryHistory: [],
    createdAt: lawyerDetail.member_since,
    updatedAt: new Date().toISOString(),
  };
}

export interface UseLawyersOptions {
  searchQuery?: string;
  practiceAreas?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  languages?: string[];
  sortBy?: "rating" | "price" | "name";
  sortOrder?: "asc" | "desc";
}

export interface UseLawyersReturn {
  lawyers: ApiLawyer[];
  loading: boolean;
  error: string | null;
  filterCounts: FilterCounts;
  refetch: () => Promise<void>;
  searchLawyers: (query: string) => Promise<void>;
  filterByPracticeArea: (area: string) => Promise<void>;
  filterByPriceRange: (min: number, max: number) => Promise<void>;
  filterByRating: (minRating: number) => Promise<void>;
  clearFilters: () => Promise<void>;
}

export function useLawyers(options: UseLawyersOptions = {}): UseLawyersReturn {
  const [lawyers, setLawyers] = useState<ApiLawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allLawyers, setAllLawyers] = useState<ApiLawyer[]>([]);
  const [filterCounts, setFilterCounts] = useState<FilterCounts>({
    practiceAreas: [],
    ratings: [],
    languages: [],
    priceRange: { min: 0, max: 0 },
  });

  const fetchLawyers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await LawyerService.getLawyers();
      setAllLawyers(data);
      setLawyers(data);

      // Calculate filter counts
      const counts = calculateFilterCounts(data);
      setFilterCounts(counts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch lawyers");
    } finally {
      setLoading(false);
    }
  }, []);

  const searchLawyers = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await LawyerService.searchLawyers(query);
      setLawyers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search lawyers");
    } finally {
      setLoading(false);
    }
  }, []);

  const filterByPracticeArea = useCallback(async (area: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await LawyerService.filterLawyersByPracticeArea(area);
      setLawyers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to filter lawyers");
    } finally {
      setLoading(false);
    }
  }, []);

  const filterByPriceRange = useCallback(async (min: number, max: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await LawyerService.filterLawyersByPriceRange(min, max);
      setLawyers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to filter lawyers by price");
    } finally {
      setLoading(false);
    }
  }, []);

  const filterByRating = useCallback(async (minRating: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await LawyerService.filterLawyersByRating(minRating);
      setLawyers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to filter lawyers by rating");
    } finally {
      setLoading(false);
    }
  }, []);

  const clearFilters = useCallback(async () => {
    setLawyers(allLawyers);
  }, [allLawyers]);

  const refetch = useCallback(async () => {
    await fetchLawyers();
  }, [fetchLawyers]);

  // Memoize options to prevent infinite re-renders
  const memoizedOptions = useMemo(
    () => options,
    [
      options.searchQuery,
      options.practiceAreas,
      options.minPrice,
      options.maxPrice,
      options.minRating,
      options.languages,
      options.sortBy,
      options.sortOrder,
    ]
  );

  // Apply initial filters when options change
  useEffect(() => {
    if (allLawyers.length === 0) return;

    let filteredLawyers = [...allLawyers];

    if (memoizedOptions.searchQuery) {
      filteredLawyers = filteredLawyers.filter(
        lawyer =>
          lawyer.name.toLowerCase().includes(memoizedOptions.searchQuery!.toLowerCase()) ||
          lawyer.about.toLowerCase().includes(memoizedOptions.searchQuery!.toLowerCase()) ||
          lawyer.city.toLowerCase().includes(memoizedOptions.searchQuery!.toLowerCase()) ||
          lawyer.practice_area.some(area =>
            area.toLowerCase().includes(memoizedOptions.searchQuery!.toLowerCase())
          )
      );
    }

    if (memoizedOptions.practiceAreas && memoizedOptions.practiceAreas.length > 0) {
      filteredLawyers = filteredLawyers.filter(lawyer =>
        memoizedOptions.practiceAreas!.some(selectedArea =>
          lawyer.practice_area.some(lawyerArea =>
            lawyerArea.toLowerCase().includes(selectedArea.toLowerCase())
          )
        )
      );
    }

    // Price range filtering
    if (memoizedOptions.minPrice !== undefined || memoizedOptions.maxPrice !== undefined) {
      filteredLawyers = filteredLawyers.filter(lawyer => {
        const lawyerMin = lawyer.min_price;
        const lawyerMax = lawyer.max_price;
        const selectedMin = memoizedOptions.minPrice || 0;
        const selectedMax = memoizedOptions.maxPrice || Infinity;

        // Lawyer is included if their price range overlaps with selected range
        return lawyerMin <= selectedMax && lawyerMax >= selectedMin;
      });
    }

    if (memoizedOptions.minRating !== undefined) {
      filteredLawyers = filteredLawyers.filter(
        lawyer => parseFloat(lawyer.avg_rating) >= memoizedOptions.minRating!
      );
    }

    // Language filtering based on lawyer.languages
    if (memoizedOptions.languages && memoizedOptions.languages.length > 0) {
      filteredLawyers = filteredLawyers.filter(
        lawyer =>
          lawyer.languages &&
          memoizedOptions.languages!.some(selectedLang =>
            lawyer.languages!.some(
              lawyerLang => lawyerLang.toLowerCase() === selectedLang.toLowerCase()
            )
          )
      );
    }

    // Apply sorting if specified
    if (memoizedOptions.sortBy && memoizedOptions.sortOrder) {
      filteredLawyers.sort((a, b) => {
        let comparison = 0;

        switch (memoizedOptions.sortBy) {
          case "rating":
            comparison = parseFloat(a.avg_rating) - parseFloat(b.avg_rating);
            break;
          case "price":
            comparison = a.min_price - b.min_price;
            break;
          case "name":
            comparison = a.name.localeCompare(b.name);
            break;
        }

        return memoizedOptions.sortOrder === "asc" ? comparison : -comparison;
      });
    }

    setLawyers(filteredLawyers);
  }, [allLawyers, memoizedOptions]);

  // Initial fetch
  useEffect(() => {
    fetchLawyers();
  }, [fetchLawyers]);

  return {
    lawyers,
    loading,
    error,
    filterCounts,
    refetch,
    searchLawyers,
    filterByPracticeArea,
    filterByPriceRange,
    filterByRating,
    clearFilters,
  };
}

// Hook for getting individual lawyer details
export function useLawyerDetails(id: string) {
  const [data, setData] = useState<Lawyer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLawyerDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const lawyerDetail = await LawyerService.getLawyerDetail(id);
      if (lawyerDetail) {
        const lawyer = adaptLawyerDetailApiToLawyer(lawyerDetail);
        setData(lawyer);
      } else {
        setData(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch lawyer details");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchLawyerDetails();
    }
  }, [id, fetchLawyerDetails]);

  return { data, isLoading, error, refetch: fetchLawyerDetails };
}

// Hook for getting lawyer reviews
export function useLawyerReviews(id: string) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const lawyerDetail = await LawyerService.getLawyerDetail(id);
      if (lawyerDetail && lawyerDetail.client_reviews) {
        const reviews = lawyerDetail.client_reviews.map((review, index) => ({
          id: `${id}-review-${index}`,
          lawyerId: id,
          clientName: review.name,
          rating: review.rate,
          comment: review.review,
          date: review.scheduled_at || new Date().toISOString(),
          isAnonymous: false, // Add missing field
          caseType: "Legal Consultation", // Add missing field - could be enhanced with real data
          verificationStatus: "verified", // Add missing field
        }));
        setData(reviews);
      } else {
        setData([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reviews");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id, fetchReviews]);

  return { data, isLoading, error, refetch: fetchReviews };
}
