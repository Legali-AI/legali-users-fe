/**
 * Example component showing how to use the new booking system
 * This demonstrates both creating bookings and managing booking state
 */

"use client";

import type React from "react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCancelBooking, useCreateBooking, useUserBookings } from "@/hooks/use-bookings";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Booking } from "@/types";

interface BookingFormProps {
  lawyerId: string;
  packageId: string;
  clientId: string;
}

export function BookingForm({ lawyerId, packageId, clientId }: BookingFormProps) {
  const dateId = useId();
  const timeId = useId();
  const amountId = useId();
  const notesId = useId();

  const [formData, setFormData] = useState({
    scheduledDate: "",
    scheduledTime: "",
    notes: "",
    totalAmount: 0,
  });

  const createBookingMutation = useCreateBooking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const bookingData: Partial<Booking> = {
        lawyerId,
        clientId,
        packageId,
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
        totalAmount: formData.totalAmount,
        notes: formData.notes,
      };

      await createBookingMutation.mutateAsync(bookingData);

      // Reset form
      setFormData({
        scheduledDate: "",
        scheduledTime: "",
        notes: "",
        totalAmount: 0,
      });

      alert("Booking created successfully!");
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Booking</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor={dateId}>Date</Label>
            <Input
              id={dateId}
              type="date"
              value={formData.scheduledDate}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  scheduledDate: e.target.value,
                }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor={timeId}>Time</Label>
            <Input
              id={timeId}
              type="time"
              value={formData.scheduledTime}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  scheduledTime: e.target.value,
                }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor={amountId}>Total Amount</Label>
            <Input
              id={amountId}
              type="number"
              value={formData.totalAmount}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  totalAmount: Number(e.target.value),
                }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor={notesId}>Notes (Optional)</Label>
            <Textarea
              id={notesId}
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={createBookingMutation.isPending}>
            {createBookingMutation.isPending ? "Creating..." : "Create Booking"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

interface UserBookingsListProps {
  userId: string;
}

export function UserBookingsList({ userId }: UserBookingsListProps) {
  const [page, setPage] = useState(1);
  const { data: bookingsData, isLoading, error } = useUserBookings(userId, page);
  const cancelBookingMutation = useCancelBooking();

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      try {
        await cancelBookingMutation.mutateAsync({
          bookingId,
          reason: "Cancelled by user",
        });
        alert("Booking cancelled successfully!");
      } catch (error) {
        console.error("Error cancelling booking:", error);
        alert("Failed to cancel booking. Please try again.");
      }
    }
  };

  if (isLoading) {
    return <div>Loading bookings...</div>;
  }

  if (error) {
    return <div>Error loading bookings: {error.message}</div>;
  }

  if (!bookingsData || bookingsData.bookings.length === 0) {
    return <div>No bookings found.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Bookings</h2>

      {bookingsData.bookings.map(booking => (
        <Card key={booking.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p>
                  <strong>Date:</strong> {formatDate(booking.scheduledDate)}
                </p>
                <p>
                  <strong>Time:</strong> {booking.scheduledTime}
                </p>
                <p>
                  <strong>Duration:</strong> {booking.duration} minutes
                </p>
                <p>
                  <strong>Amount:</strong> {formatCurrency(booking.totalAmount)}
                </p>
                <p>
                  <strong>Status:</strong>
                  <span
                    className={`ml-2 rounded px-2 py-1 text-sm ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : booking.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                    }`}>
                    {booking.status}
                  </span>
                </p>
                {booking.notes && (
                  <p>
                    <strong>Notes:</strong> {booking.notes}
                  </p>
                )}
              </div>

              {booking.status === "pending" && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleCancelBooking(booking.id)}
                  disabled={cancelBookingMutation.isPending}>
                  {cancelBookingMutation.isPending ? "Cancelling..." : "Cancel"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
          Previous
        </Button>

        <span>
          Page {page} of {bookingsData.totalPages}
        </span>

        <Button variant="outline" onClick={() => setPage(p => p + 1)} disabled={page >= bookingsData.totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
}

// Example usage in a page or component:
// export default function BookingPage() {
//   const clientId = "client-123"; // Get from auth or props
//   const lawyerId = "lawyer-456"; // Get from props or router
//   const packageId = "package-789"; // Get from selected package
//
//   return (
//     <div className="container mx-auto p-4">
//       <div className="grid md:grid-cols-2 gap-8">
//         <BookingForm
//           lawyerId={lawyerId}
//           packageId={packageId}
//           clientId={clientId}
//         />
//         <UserBookingsList userId={clientId} />
//       </div>
//     </div>
//   );
// }
