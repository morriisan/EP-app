import { auth } from "@/lib/auth";
import { bookingService } from "@/services/booking-service";
import { addMonths, startOfMonth } from "date-fns";
import { BookingsList } from "@/components/booking/bookings-list";
import { calendarService } from "@/services/calendar-service";
import { headers } from "next/headers";
import { AuthPanel } from "@/components/AuthPanel";
import { BookingClientWrapper } from "@/components/booking/booking-client-wrapper";

export async function BookingServerComponent() {
  // Get the current session (if any) - but don't require it
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  // Get calendar data for the current and next two months
  const startDate = startOfMonth(new Date());
  const endDate = addMonths(startDate, 2);
  const calendarData = await calendarService.getCalendarData(startDate, endDate);

  // Only fetch user bookings if user is logged in
  const userBookings = session?.user 
    ? await bookingService.getUserBookings(session.user.id)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Calendar and Booking Form */}
        <div>
                     <BookingClientWrapper
             bookedDates={calendarData
               .filter(day => !day.isAvailable && day.status)
               .map(day => ({
                 date: new Date(day.date),
                 status: day.status || 'PENDING',
                 waitlistCount: day.waitlistCount
               }))}
             userBookings={userBookings.map(booking => ({
               date: new Date(booking.date),
               status: booking.status
             }))}
             isLoggedIn={!!session?.user}
           />
        </div>

        {/* Right Column: User's Bookings Section */}
        <div>
          {session?.user ? (
            <div className="bg-theme-section-primary rounded-xl shadow-sm">
              <div className="p-6 border-b border-theme-border-default">
                <h2 className="text-xl font-semibold text-theme-primary">Your Bookings</h2>
              </div>
              <div className="p-6">
                <BookingsList 
                  bookings={userBookings}
                />
              </div>
            </div>
          ) : (
            <div className="bg-theme-section-primary rounded-xl shadow-sm">
              <div className="p-6 border-b border-theme-border-default">
                <h2 className="text-xl font-semibold text-theme-primary">Make a Booking</h2>
              </div>
              <div className="p-6">
                <p className="text-theme-primary mb-6">
                  Please sign in to make a booking or manage your existing bookings.
                </p>
                <AuthPanel 
                  trigger={
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-theme-accent-primary text-white hover:bg-theme-accent-primary/80 h-10 px-8">
                      Sign In
                    </button>
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 