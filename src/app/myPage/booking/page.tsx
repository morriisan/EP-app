import { Suspense } from "react";
import { BookingsList } from "@/components/booking/bookings-list";
import { bookingService } from "@/services/booking-service";
import { requireAuth } from "@/lib/auth-utils";

export default async function BookingsPage() {
  const session = await requireAuth();
  
  // Fetch user's bookings
  const bookings = await bookingService.getUserBookings(session.user.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-theme-primary">
          My Bookings
        </h1>
      </div>

      <div className="rounded-xl shadow-sm p-6">
        <Suspense fallback={
          <div className="text-center py-8 text-gray-600 dark:text-gray-300">
            Loading bookings...
          </div>
        }>
          <BookingsList bookings={bookings} />
        </Suspense>
      </div>
    </div>
  );
}
