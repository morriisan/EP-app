import { Suspense } from "react";
import { bookingService } from "@/services/booking-service";
import { requireAuth } from "@/lib/auth-utils";

function BookingHistoryList({ bookings }: { bookings: any[] }) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        You don't have any booking history yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="border rounded-lg p-4 space-y-2 bg-gray-50 dark:bg-gray-800/50"
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
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Description:</span> {booking.description}
            </p>
          )}

          {booking.reviewNote && (
            <p className="text-sm bg-gray-100 dark:bg-gray-700/50 p-2 rounded">
              <span className="font-medium">Admin Note:</span> {booking.reviewNote}
            </p>
          )}

          <div className="text-sm text-gray-500 dark:text-gray-400">
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
  
  // Fetch user's booking history
  const bookingHistory = await bookingService.getUserBookingHistory(session.user.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-pink-800 dark:text-pink-300">
          Booking History
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-900/40 rounded-xl shadow-sm p-6">
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