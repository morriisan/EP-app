import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-middleware";
import { bookingService } from "@/services/booking-service";
import { notificationService } from "@/services/notification-service";

// Create a new booking
export const POST = requireAuth(async (req: Request, session) => {
  try {
    const body = await req.json();
    const { date, description } = body;

    if (!date) {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 }
      );
    }

    console.log('API received date:', date);
    console.log('API creating Date object:', new Date(date));

    const booking = await bookingService.createBooking(
      session.user.id,
      new Date(date),
      description
    );

    // Send notifications based on booking status
    try {
      if (booking.status === 'WAITLISTED') {
        await notificationService.sendWaitlistNotification(booking);
      } else {
        await notificationService.sendBookingCreatedNotification(booking);
      }
    } catch (error) {
      console.error("Error sending notifications:", error);
      // Continue with the response even if notification fails
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
});

// Get bookings
export const GET = requireAuth(async (req: Request, session) => {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const date = searchParams.get("date");
    const userOnly = searchParams.get("userOnly") === "true";

    // Get user's own bookings
    if (userOnly) {
      const bookings = await bookingService.getUserBookings(session.user.id);
      return NextResponse.json(bookings);
    }

    // Get bookings for a date range
    if (startDate && endDate) {
      const bookings = await bookingService.getBookingsInRange(
        new Date(startDate),
        new Date(endDate)
      );
      return NextResponse.json(bookings);
    }

    // Get bookings for a specific date
    if (date) {
      const bookings = await bookingService.getBookingsByDate(new Date(date));
      return NextResponse.json(bookings);
    }


    return NextResponse.json(
      { error: "Invalid query parameters" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}); 