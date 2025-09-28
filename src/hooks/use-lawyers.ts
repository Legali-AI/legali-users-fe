import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBooking,
  getBookingById,
  getFeaturedLawyers,
  getLawyerById,
  getLawyerReviews,
  searchLawyers,
} from "@/services/lawyer.service";
import type { Booking, SearchParams } from "@/types";

// Query keys
export const queryKeys = {
  lawyers: {
    all: ["lawyers"] as const,
    search: (params: SearchParams) => [...queryKeys.lawyers.all, "search", params] as const,
    byId: (id: string) => [...queryKeys.lawyers.all, "detail", id] as const,
    reviews: (id: string) => [...queryKeys.lawyers.all, "reviews", id] as const,
    featured: () => [...queryKeys.lawyers.all, "featured"] as const,
  },
  bookings: {
    all: ["bookings"] as const,
    byId: (id: string) => [...queryKeys.bookings.all, "detail", id] as const,
  },
};

// Lawyer hooks
export function useSearchLawyers(params: SearchParams) {
  return useQuery({
    queryKey: queryKeys.lawyers.search(params),
    queryFn: () => searchLawyers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useLawyerDetails(id: string) {
  return useQuery({
    queryKey: queryKeys.lawyers.byId(id),
    queryFn: () => getLawyerById(id),
    enabled: !!id,
  });
}

export function useLawyerReviews(lawyerId: string) {
  return useQuery({
    queryKey: queryKeys.lawyers.reviews(lawyerId),
    queryFn: () => getLawyerReviews(lawyerId),
    enabled: !!lawyerId,
  });
}

export function useFeaturedLawyers() {
  return useQuery({
    queryKey: queryKeys.lawyers.featured(),
    queryFn: () => getFeaturedLawyers(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Booking hooks
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingData: Partial<Booking>) => createBooking(bookingData),
    onSuccess: () => {
      // Invalidate and refetch bookings
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
}

export function useBookingDetails(id: string) {
  return useQuery({
    queryKey: queryKeys.bookings.byId(id),
    queryFn: () => getBookingById(id),
    enabled: !!id,
  });
}
