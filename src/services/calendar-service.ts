import { Booking, BookingStatus } from "@prisma/client";
import { bookingService } from "@/services/booking-service";
import { addDays, isSameDay } from "date-fns";

export type CalendarDay = {
  date: Date;
  isAvailable: boolean;
  status?: BookingStatus;
  waitlistCount?: number;
};

export const calendarService = {
  async getCalendarData(startDate: Date, endDate: Date): Promise<CalendarDay[]> {
    // Get all bookings in the date range
    const bookings = await bookingService.getBookingsInRange(startDate, endDate);
    
    const calendarDays: CalendarDay[] = [];
    let currentDate = startDate;

    // Generate calendar days until we reach the end date
    while (currentDate <= endDate) {
      const dayBookings = bookings.filter((booking: Booking) => 
        isSameDay(new Date(booking.date), currentDate)
      );

      const waitlistedBookings = dayBookings.filter(
        (booking: Booking) => booking.status === "WAITLISTED"
      );

      calendarDays.push({
        date: new Date(currentDate),
        isAvailable: dayBookings.length === 0,
        status: dayBookings.length > 0 
          ? dayBookings[0].status 
          : undefined,
        waitlistCount: waitlistedBookings.length || undefined
      });

      currentDate = addDays(currentDate, 1);
    }

    return calendarDays;
  },

  async getDayStatus(date: Date): Promise<{
    isAvailable: boolean;
    status?: BookingStatus;
    waitlistCount: number;
  }> {
    const dayBookings = await bookingService.getBookingsByDate(date);
    const waitlistedBookings = dayBookings.filter(
      (booking: Booking) => booking.status === "WAITLISTED"
    );

    return {
      isAvailable: dayBookings.length === 0,
      status: dayBookings.length > 0 ? dayBookings[0].status : undefined,
      waitlistCount: waitlistedBookings.length
    };
  }
}; 