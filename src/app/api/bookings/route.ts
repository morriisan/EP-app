import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-middleware";
import { bookingService } from "@/services/booking-service";
import { notificationService } from "@/services/notification-service";

// Create a new booking
export const POST = requireAuth(async (req: Request, session) => {
  try {
    const body = await req.json();
    const { date, eventType, guestCount, description, phoneNumber } = body;

    if (!date) {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 }
      );
    }

    if (!eventType) {
      return NextResponse.json(
        { error: "Event type is required" },
        { status: 400 }
      );
    }

    if (!guestCount || guestCount < 1) {
      return NextResponse.json(
        { error: "Valid guest count is required" },
        { status: 400 }
      );
    }

    if (!phoneNumber || !String(phoneNumber).trim()) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const composedDescription = [
      `Phone: ${String(phoneNumber).trim()}`,
      description?.trim(),
    ]
      .filter(Boolean)
      .join("\n\n");

    const booking = await bookingService.createBooking(
      session.user.id,
      new Date(date),
      eventType,
      guestCount,
      composedDescription
    );

    // Send notifications based on booking status
    try {
    
        await notificationService.sendBookingCreatedNotification(booking);
      
    } catch (error) {
      console.error("Error sending notifications:", error);
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
    const date = searchParams.get("date");
    const userOnly = searchParams.get("userOnly") === "true";

    // Get user's own bookings
    if (userOnly) {
      const bookings = await bookingService.getUserBookings(session.user.id);
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