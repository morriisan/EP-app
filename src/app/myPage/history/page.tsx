import { Suspense } from "react";
import { bookingService } from "@/services/booking-service";
import { requireAuth } from "@/lib/auth-utils";
import { BookingStatus } from "@prisma/client";

type BookingReason = "CANCELLED" | "PAST_DATE" | "REJECTED";

interface BookingHistory {
  id: string;
  userId: string;
  date: Date;
  description: string | null;
  status: BookingStatus;
  originalBookingId: string;
  movedToHistoryAt: Date;
  reason: BookingReason;
  waitlistPos: number | null;
  reviewedById: string | null;
  reviewNote: string | null;
}

function BookingHistoryList({ bookings }: { bookings: BookingHistory[] }) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        You don&apos;t have any booking history yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="border rounded-lg p-4 space-y-2 bg-theme-accent-secondary"
        >
          <div className="flex items-center justify-between">
            <div className="text-lg font-medium">
              {new Date(booking.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${
              booking.reason === 'CANCELLED' ? 'text-red-600 bg-red-100 dark:bg-red-900/20' :
              booking.reason === 'PAST_DATE' ? 'text-gray-600 bg-gray-100 dark:bg-gray-700/20' :
              'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
            }`}>
              {booking.reason}
            </span>
          </div>

          {booking.description && (
            <p className="text-theme-default">
              <span className="font-medium">Description:</span> {booking.description}
            </p>
          )}

          {booking.reviewNote && (
            <p className="text-sm rounded">
              <span className="font-medium">Admin Note:</span> {booking.reviewNote}
            </p>
          )}

          <div className="text-sm text-theme-default">
            Original Status: {booking.status}
            {booking.waitlistPos && ` (Waitlist #${booking.waitlistPos})`}
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function BookingHistoryPage() {
  const session = await requireAuth();
  
  // Fetch user's booking history and cast it to the correct type
  const bookingHistory = (await bookingService.getUserBookingHistory(session.user.id)) as BookingHistory[];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-theme-primary">
          Booking History
        </h1>
      </div>

      <div className="rounded-xl shadow-sm p-6">
        <Suspense fallback={
          <div className="text-center py-8 text-gray-600 dark:text-gray-300">
            Loading booking history...
          </div>
        }>
          <BookingHistoryList bookings={bookingHistory} />
        </Suspense>
      </div>
    </div>
  );
} 