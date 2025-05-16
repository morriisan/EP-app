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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Calendar Section - Public */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Available Dates</h2>
          <div className="mb-4 text-sm text-gray-600">
            <ul className="space-y-1">
              <li className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-100"></div>
                Available
              </li>
              <li className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-100"></div>
                Booked
              </li>
              <li className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-100"></div>
                Waitlist Available
              </li>
              <li className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-50"></div>
                Past Dates
              </li>
            </ul>
          </div>
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
          />
        </div>
      </div>

      {/* User's Bookings Section - Only shown when logged in */}
      {session?.user && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
            <BookingsList 
              bookings={userBookings}
            />
          </div>
        </div>
      )}

      {/* Login prompt - Only shown when not logged in */}
      {!session?.user && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Make a Booking</h2>
            <p className="text-gray-600 mb-4">
              Please sign in to make a booking or manage your existing bookings.
            </p>
            <AuthPanel 
              trigger={
                <button className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                  Sign In
                </button>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
} 