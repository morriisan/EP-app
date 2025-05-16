'use client';

import { useState } from "react";
import { format } from "date-fns";
import { BookingWithUser } from "@/services/booking-service";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BookingsListProps {
  bookings: BookingWithUser[];
  userId: string;
}

export function BookingsList({ bookings: initialBookings, userId }: BookingsListProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const cancelBooking = async (bookingId: string) => {
    setCancelingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to cancel booking");
      }

      const canceledBooking = await res.json();
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? canceledBooking : b
      ));
      
      toast.success("Booking cancelled successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel booking");
    } finally {
      setCancelingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "text-green-600 bg-green-100";
      case "PENDING": return "text-yellow-600 bg-yellow-100";
      case "WAITLISTED": return "text-purple-600 bg-purple-100";
      case "REJECTED": return "text-red-600 bg-red-100";
      case "CANCELLED": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const isBookingInPast = (date: Date | string) => {
    const bookingDate = date instanceof Date ? date : new Date(date);
    const today = new Date();
    return bookingDate < today;
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        You don't have any bookings yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className={`border rounded-lg p-4 space-y-2 ${
            isBookingInPast(booking.date) ? 'bg-gray-50' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-lg font-medium">
              {format(new Date(booking.date), "MMMM d, yyyy")}
              {isBookingInPast(booking.date) && (
                <span className="ml-2 text-sm text-gray-500">(Past)</span>
              )}
            </div>
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
              {booking.status}
            </span>
          </div>

          <div className="text-sm text-gray-600">
            <div>Name: {booking.user.name}</div>
            <div>Email: {booking.user.email}</div>
          </div>

          {booking.description && (
            <p className="text-black">
              <span className="font-medium">Description:</span> {booking.description}
            </p>
          )}

          {booking.reviewNote && (
            <p className="text-sm bg-gray-50 p-2 rounded">
              <span className="font-medium">Admin Note:</span> {booking.reviewNote}
            </p>
          )}

          {booking.waitlistPos && (
            <p className="text-sm text-purple-600">
              Waitlist Position: #{booking.waitlistPos}
            </p>
          )}

          {booking.status !== "CANCELLED" && (
            <div className="pt-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => cancelBooking(booking.id)}
                disabled={!!cancelingId}
              >
                {cancelingId === booking.id ? "Cancelling..." : "Cancel Booking"}
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 