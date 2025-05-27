import { auth } from "@/lib/auth";
import { bookingService } from "@/services/booking-service";
import { addMonths, startOfMonth } from "date-fns";
import { BookingCalendar } from "@/components/booking/booking-calendar";
import { BookingsList } from "@/components/booking/bookings-list";
import { calendarService } from "@/services/calendar-service";
import { headers } from "next/headers";
import { AuthPanel } from "@/components/AuthPanel";

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
        {/* Calendar Section - Public */}
        <div>
          <div className="bg-theme-section-primary rounded-xl shadow-sm">
            <div className="p-6 border-b border-theme-border-default">
              <h2 className="text-xl font-semibold text-theme-primary">Available Dates</h2>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-theme-primary">
             {/*    <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-white"></div>
                  <span>Available</span>
                </div> */}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-800"></div>
                  <span>Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-600"></div>
                  <span>Waitlist Available</span>
                </div>
              </div>
            </div>
            <div className="p-2 flex justify-center items-center">
              <BookingCalendar 
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
          </div>
        </div>

        {/* User's Bookings Section - Only shown when logged in */}
        {session?.user ? (
          <div>
            <div className="bg-theme-section-primary rounded-xl shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-theme-primary">Your Bookings</h2>
              </div>
              <div className="p-6">
                <BookingsList 
                  bookings={userBookings}
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-white dark:bg-gray-900/40 rounded-xl shadow-sm">
              <div className="p-6  border-pink-50/10">
                <h2 className="text-xl font-semibold text-pink-800 dark:text-pink-300">Make a Booking</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Please sign in to make a booking or manage your existing bookings.
                </p>
                <AuthPanel 
                  trigger={
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-pink-500 text-white hover:bg-pink-600 dark:bg-pink-500 dark:hover:bg-pink-600 h-10 px-8">
                      Sign In
                    </button>
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 