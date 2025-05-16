import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-middleware";
import { bookingService } from "@/services/booking-service";

// Admin: Get all bookings or booking history
export const GET = requireAdmin(async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    if (type === 'history') {
      const history = await bookingService.getAllBookingHistory();
      return NextResponse.json(history);
    } else {
      const bookings = await bookingService.getAllBookings();
      
      // Filter by status if specified
      if (status) {
        const filteredBookings = bookings.filter(booking => booking.status === status);
        return NextResponse.json(filteredBookings);
      }
      
      return NextResponse.json(bookings);
    }
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
});

// Admin: Review a booking (approve/reject)
export const POST = requireAdmin(async (req: Request, session) => {
  try {
    const body = await req.json();
    const { bookingId, status, reviewNote } = body;

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: "Booking ID and status are required" },
        { status: 400 }
      );
    }

    if (status !== "APPROVED" && status !== "REJECTED") {
      return NextResponse.json(
        { error: "Invalid status. Must be APPROVED or REJECTED" },
        { status: 400 }
      );
    }

    const booking = await bookingService.reviewBooking(
      bookingId,
      session.user.id,
      status,
      reviewNote
    );

    return NextResponse.json(booking);
  } catch (error) {
    if (error instanceof Error && error.message === 'Another booking is already approved for this date') {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    console.error("Error reviewing booking:", error);
    return NextResponse.json(
      { error: "Failed to review booking" },
      { status: 500 }
    );
  }
}); 