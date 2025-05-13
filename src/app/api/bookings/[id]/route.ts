import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-middleware";
import { bookingService } from "@/services/booking-service";

// Cancel a booking
export const DELETE = requireAuth(async (req: Request, session) => {
  try {
    const bookingId = req.url.split('/').pop();
    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const booking = await bookingService.cancelBooking(
      bookingId,
      session.user.id
    );

    return NextResponse.json(booking);
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authorized to cancel this booking') {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }

    console.error("Error canceling booking:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}); 