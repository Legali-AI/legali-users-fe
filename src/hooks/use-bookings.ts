import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/config";
import {
  cancelBooking,
  createBooking,
  getBookingById,
  getUserBookings,
} from "@/services/lawyer.service";
import type { Booking } from "@/types";

// Hook for creating a new booking
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingData: Partial<Booking>) => createBooking(bookingData),
    onSuccess: (newBooking) => {
      // Invalidate and refetch user bookings
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER_BOOKINGS, newBooking.clientId],
      });
      // Add the new booking to the cache
      queryClient.setQueryData(
        [QUERY_KEYS.BOOKING_DETAILS, newBooking.id],
        newBooking
      );
    },
    onError: (error) => {
      console.error("Error creating booking:", error);
    },
  });
};

// Hook for fetching a single booking by ID
export const useBookingDetails = (bookingId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOOKING_DETAILS, bookingId],
    queryFn: () => getBookingById(bookingId),
    enabled: !!bookingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching user bookings
export const useUserBookings = (userId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_BOOKINGS, userId, page, limit],
    queryFn: () => getUserBookings(userId, page, limit),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook for canceling a booking
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      reason,
    }: {
      bookingId: string;
      reason?: string;
    }) => cancelBooking(bookingId, reason),
    onSuccess: (cancelledBooking) => {
      // Update the booking in cache
      queryClient.setQueryData(
        [QUERY_KEYS.BOOKING_DETAILS, cancelledBooking.id],
        cancelledBooking
      );
      // Invalidate user bookings to refresh the list
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER_BOOKINGS, cancelledBooking.clientId],
      });
    },
    onError: (error) => {
      console.error("Error canceling booking:", error);
    },
  });
};

// Hook for optimistic updates when booking status changes
export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingId,
      status,
    }: {
      bookingId: string;
      status: Booking["status"];
    }) => {
      // This would be an API call in real implementation
      // For now, just return the updated booking
      const currentBooking = queryClient.getQueryData<Booking>([
        QUERY_KEYS.BOOKING_DETAILS,
        bookingId,
      ]);

      if (!currentBooking) {
        throw new Error("Booking not found");
      }

      return {
        ...currentBooking,
        status,
        updatedAt: new Date().toISOString(),
      };
    },
    onMutate: async ({ bookingId, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.BOOKING_DETAILS, bookingId],
      });

      // Snapshot the previous value
      const previousBooking = queryClient.getQueryData<Booking>([
        QUERY_KEYS.BOOKING_DETAILS,
        bookingId,
      ]);

      // Optimistically update to the new value
      if (previousBooking) {
        queryClient.setQueryData([QUERY_KEYS.BOOKING_DETAILS, bookingId], {
          ...previousBooking,
          status,
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousBooking };
    },
    onError: (_err, { bookingId }, context) => {
      // Rollback on error
      if (context?.previousBooking) {
        queryClient.setQueryData(
          [QUERY_KEYS.BOOKING_DETAILS, bookingId],
          context.previousBooking
        );
      }
    },
    onSettled: (_data, _error, { bookingId }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.BOOKING_DETAILS, bookingId],
      });
    },
  });
};
